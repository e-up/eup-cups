import { CupsClient } from '../cups/client';
import { IPPResponse } from 'eup-ipp-encoder';
import { argv } from 'node:process';
import { formatIppResponse, flattenIppResponse } from '..';


/**
 * 启用处于 "Rejecting Jobs" 状态的打印机示例
 *
 * 这个示例展示了如何使用 CUPS Client 检查打印机状态并启用拒绝作业的打印机。
 * 当打印机状态为 Idle - "Rejecting Jobs" 时，可以使用 acceptJobs 方法使其重新接受作业。
 *
 * 运行方式：
 * 1. 先构建项目: npm run build
 * 2. 然后运行示例:
 *    - 列出所有打印机状态: node dist/examples/cups-enable-printer.js
 *    - 启用指定打印机: node dist/examples/cups-enable-printer.js "YourPrinterName"
 */

// CUPS 服务器配置选项
const cupsOptions = {
    // CUPS 服务器 URL
    url: 'http://localhost:631',
    username: process.env.CUPS_USERNAME, // 可选，如果需要认证
    password: process.env.CUPS_PASSWORD, // 可选，如果需要认证
    timeout: 5000
};

// 要启用的打印机名称（支持从命令行参数获取）
const targetPrinterName = argv[2];



async function enablePrinter() {
    console.log('CUPS 启用打印机示例');
    console.log('='.repeat(60));

    try {
        // 创建 CUPS 客户端实例
        const client = new CupsClient(cupsOptions);

        // 获取所有打印机信息
        const printersResponse = await client.getPrinters();
        const flattenedPrinters = flattenIppResponse(printersResponse);
        console.log(flattenedPrinters)
        // 检查是否有目标打印机参数
        if (targetPrinterName) {
            console.log(`\n🔄 正在启用打印机 "${targetPrinterName}" 接受作业...`);
            // 获取打印机URI
            const printerUri = await client.getPrinterUri(targetPrinterName);
            if (!printerUri) {
                console.error(`❌ 打印机 "${targetPrinterName}" 未找到`);
                process.exit(1);
            }
            console.log(`   找到打印机 URI: ${printerUri}`);
            const response = await client.acceptJobs(printerUri);
            console.log('✅ 操作完成:', formatIppResponse(response));
        } else {
            // 没有指定打印机，列出所有打印机状态
            console.log('📋 所有打印机状态:');
            console.log('-'.repeat(60));

            const printers = flattenedPrinters.groups["4"] || []; // 使用原始标签值 0x04 (转换为字符串 '4')
            printers.forEach((printer: any, index: number) => {
                const printerStateReasons = printer["printer-state-reasons"] || [];
                const isRejectingJobs = Array.isArray(printerStateReasons) 
                    ? printerStateReasons.includes('rejecting-jobs') 
                    : printerStateReasons === 'rejecting-jobs';

                console.log(`${index + 1}. ${printer["printer-name"]}`);
                console.log(`   状态码: ${printer["printer-state"]}`);
                console.log(`   状态原因: ${Array.isArray(printerStateReasons) ? printerStateReasons.join(', ') : printerStateReasons || '无'}`);
                console.log(`   是否拒绝作业: ${isRejectingJobs ? '✅ 是' : '❌ 否'}`);
                console.log(`   URI: ${printer["printer-uri-supported"]}`);
                console.log('');
            });

            console.log('提示: 要启用拒绝作业的打印机，请运行:');
            console.log('node dist/examples/cups-enable-printer.js "PrinterName"');
        }

    } catch (error) {
        console.error('❌ 操作失败:', (error as Error).message);
        console.error('错误详情:', error);
        process.exit(1);
    }
}

// 运行示例
enablePrinter();
