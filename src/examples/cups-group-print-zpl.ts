import { CupsClient } from '../cups/client';
import { Buffer } from 'node:buffer';
import { CONSTANTS } from 'eup-ipp-encoder';
import { argv } from 'node:process';
import { formatIppResponse } from '..';

/**
 * 使用 CUPS 分组打印 ZPL 示例
 *
 * 这个示例展示了如何使用 CUPS Client 向打印机类（Printer Class）发送 ZPL 命令，
 * 实现分组打印功能。打印机类是一组打印机的集合，CUPS 会自动选择可用的打印机来处理作业。
 *
 * 运行方式：
 * 1. 先构建项目: npm run build
 * 2. 然后运行示例:
 *    - 默认打印机类: node dist/examples/cups-group-print-zpl.js
 *    - 指定打印机类: node dist/examples/cups-group-print-zpl.js "YourPrinterClass"
 */

const { KEYWORD, URI } = CONSTANTS;

// ZPL 命令示例 - 打印一个简单的标签
const zplCode = `^XA
^FO50,50^A0N,50,50^FDHello Group Print^FS
^FO50,120^A0N,30,30^FDPrint Success^FS
^FO50,170^BY2^BCN,50,N,N
^FDGROUP-ZPL^FS
^XZ`;

// CUPS 服务器配置选项
const cupsOptions = {
    // CUPS 服务器 URL
    url: 'http://localhost:631',
    username: process.env.CUPS_USERNAME, // 可选，如果需要认证
    password: process.env.CUPS_PASSWORD, // 可选，如果需要认证
    timeout: 5000
};

// 打印机类名称（支持从命令行参数获取）
const printerClassName = argv[2] || 'ZPL';

async function groupPrintZplLabel() {
    console.log('CUPS 分组打印 ZPL 示例');
    console.log('='.repeat(60));

    try {
        // 创建 CUPS 客户端实例
        const client = new CupsClient(cupsOptions);

        console.log('1. 获取所有打印机类...');
        // 获取所有打印机类
        const classesResponse = await client.getClasses();

        // 解析打印机类信息
        if (classesResponse.groups) {
            const classes = classesResponse.groups
                .flatMap(group => group.attributes)
                .filter(attr => attr.name === 'printer-name')
                .map(attr => Array.isArray(attr.value) ? attr.value[0] : attr.value);

            console.log('可用的打印机类:', classes);

            // 检查我们的目标打印机类是否存在
            if (!classes.includes(printerClassName)) {
                console.log(`\n警告: 打印机类 "${printerClassName}" 不存在!`);
                console.log('请先在 CUPS 中创建打印机类并添加打印机。');
                console.log(`示例命令: sudo lpadmin -p ${printerClassName} -E -v ipp://localhost/classes/${printerClassName} -m everywhere`);
                return;
            }
        }

        // 构建打印机类的 URI
        const printerClassUri = `${cupsOptions.url}/classes/${printerClassName}`;
        console.log(`\n2. 使用打印机类: ${printerClassUri}`);

        // 创建指向打印机类的新客户端实例
        const classClient = new CupsClient({
            ...cupsOptions,
            url: printerClassUri
        });

        // 将 ZPL 代码转换为 Buffer
        const zplBuffer = Buffer.from(zplCode, 'utf-8');

        console.log('\n3. 发送 ZPL 打印作业到打印机类...');
        // 发送打印作业到打印机类
        const response = await classClient.printJob('Group ZPL Label Test', zplBuffer, [
            // 明确指定文档格式为 ZPL
            { tag: KEYWORD, name: 'document-format', value: ['application/octet-stream'] },
            // 可以添加更多作业属性
            { tag: KEYWORD, name: 'print-quality', value: ['normal'] },
            { tag: KEYWORD, name: 'orientation-requested', value: ['portrait'] }
        ]);

        console.log('\n✅ 打印作业发送成功!');
        console.log('响应状态:', response.statusCode);
        console.log('响应原文', formatIppResponse(response))

        // 检查版本信息
        if (response.version) {
            console.log('IPP 版本:', `${response.version.major}.${response.version.minor}`);
        }
        console.log('请求ID:', response.requestId);

        // 检查响应中的作业ID
        if (response.groups) {
            const jobIdAttr = response.groups
                .flatMap(group => group.attributes)
                .find(attr => attr.name === 'job-id');

            const jobUriAttr = response.groups
                .flatMap(group => group.attributes)
                .find(attr => attr.name === 'job-uri');

            if (jobIdAttr && jobIdAttr.value) {
                // 正确处理值可能是字符串或数组的情况
                const jobId = Array.isArray(jobIdAttr.value) ? jobIdAttr.value[0] : jobIdAttr.value;
                console.log('作业ID:', jobId);
            }

            if (jobUriAttr && jobUriAttr.value) {
                // 正确处理值可能是字符串或数组的情况
                const jobUri = Array.isArray(jobUriAttr.value) ? jobUriAttr.value[0] : jobUriAttr.value;
                // 使用 JSON.stringify 确保完整输出 URI
                console.log('作业URI:', JSON.stringify(jobUri));
                console.log('作业URI长度:', typeof jobUri === 'string' ? jobUri.length : 'N/A');
            }
        }

        console.log('\n📋 打印结果: CUPS 会自动选择打印机类中的可用打印机来处理此作业');

    } catch (error) {
        console.error('❌ 打印失败:', (error as Error).message);
        console.error('错误详情:', error);
        process.exit(1);
    }
}

// 运行示例
groupPrintZplLabel();
