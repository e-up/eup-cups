import { IppClient, IppClientOptions } from '../../src/ipp/client';
import { CupsClient } from '../../src/cups/client';
import { CONSTANTS } from 'eup-ipp-encoder';

// 加载环境变量
require('dotenv').config();

const { KEYWORD } = CONSTANTS;

// 测试配置
const TEST_CONFIG = {
  CUPS_URL: process.env.CUPS_URL || 'http://localhost:631',
  NODE_IPP_URL: process.env.NODE_IPP_URL || 'http://localhost:3000',
  TEST_PRINTER_URI: process.env.TEST_PRINTER_URI || 'ipp://localhost:631/printers/TestPrinter',
  TEST_CLASS_URI: process.env.TEST_CLASS_URI || 'ipp://localhost:631/classes/TestClass',
  TEST_JOB_ID: parseInt(process.env.TEST_JOB_ID || '1'),
  SKIP_REAL_CUPS: process.env.SKIP_CUPS_REAL === '1',
  SKIP_IPP_REAL: process.env.SKIP_IPP_REAL === '1'
};

/**
 * 创建IPP客户端实例
 */
export function createTestIppClient(options?: Partial<IppClientOptions>): IppClient {
  return new IppClient({
    url: options?.url || TEST_CONFIG.NODE_IPP_URL,
    timeout: options?.timeout || 5000,
    username: options?.username || process.env.CUPS_USERNAME,
    password: options?.password || process.env.CUPS_PASSWORD
  });
}

/**
 * 创建CUPS客户端实例
 */
export function createTestCupsClient(options?: Partial<IppClientOptions>): CupsClient {
  return new CupsClient({
    url: options?.url || TEST_CONFIG.CUPS_URL,
    timeout: options?.timeout || 5000,
    username: options?.username || process.env.CUPS_USERNAME,
    password: options?.password || process.env.CUPS_PASSWORD
  });
}

/**
 * 跳过真实CUPS测试的装饰器
 */
export function skipRealCupsTest(): MethodDecorator {
  return function(target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    if (TEST_CONFIG.SKIP_REAL_CUPS) {
      // Use jest.skip() instead of jest.fn().skip()
      descriptor.value = jest.fn();
      (descriptor.value as any).skip = true;
    }
    return descriptor;
  };
}

/**
 * 跳过真实IPP测试的装饰器
 */
export function skipRealIppTest(): MethodDecorator {
  return function(target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    if (TEST_CONFIG.SKIP_IPP_REAL) {
      // Use jest.skip() instead of jest.fn().skip()
      descriptor.value = jest.fn();
      (descriptor.value as any).skip = true;
    }
    return descriptor;
  };
}

/**
 * 基础测试属性
 */
export const BASIC_PRINTER_ATTRIBUTES = [
  'printer-name',
  'printer-uri-supported',
  'printer-state',
  'printer-is-accepting-jobs'
];

/**
 * 生成测试用的打印数据
 */
export function generateTestPrintData(): Buffer {
  return Buffer.from('Test print job content', 'utf-8');
}

// 导出测试配置
export { TEST_CONFIG };
