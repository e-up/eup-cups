import { CupsClient } from '../cups/client';
import { argv } from 'node:process';
import { formatIppResponse, flattenIppResponse } from '..';

/**
 * 获取打印机信息示例
 *
 * 这个示例展示了如何使用 CUPS Client 获取打印机的详细信息，
 * 包括列出所有打印机和获取特定打印机的详细属性。
 *
 * 运行方式：
 * 1. 先构建项目: npm run build
 * 2. 然后运行示例:
 *    - 列出所有打印机: node dist/examples/cups-get-printer-info.js
 *    - 获取特定打印机详情: node dist/examples/cups-get-printer-info.js "YourPrinterName"
 */

// CUPS 服务器配置选项
const cupsOptions = {
    // CUPS 服务器 URL
    url: 'http://localhost:631',
    username: process.env.CUPS_USERNAME, // 可选，如果需要认证
    password: process.env.CUPS_PASSWORD, // 可选，如果需要认证
    timeout: 5000
};

// 要查询的打印机名称（支持从命令行参数获取）
const targetPrinterName = argv[2];

async function getPrinterInfo() {
    console.log('CUPS 获取打印机信息示例');
    console.log('='.repeat(60));

    try {
        // 创建 CUPS 客户端实例
        const client = new CupsClient(cupsOptions);
        
        // 获取所有打印机信息
        console.log('🔍 正在获取打印机信息...');
        const printersResponse = await client.getPrinters();
        console.log('✅ 打印机信息获取成功');
        // 使用JSON.stringify显示完整的输出
        console.log(JSON.stringify(flattenIppResponse(printersResponse), null, 2))
        // console.log(printersResponse.groups)

    } catch (error) {
        console.error('❌ 获取打印机信息失败:', (error as Error).message);
        console.error('错误详情:', error);
        process.exit(1);
    }
}

// 运行示例
getPrinterInfo();