import { IPPRequest, IPPResponse,encoder,decoder, CONSTANTS } from 'eup-ipp-encoder';

const {
  OPERATION_ATTRIBUTES_TAG,
  CHARSET,
  NATURAL_LANG,
  NAME_WITHOUT_LANG,
  KEYWORD,
  ENUM,
  BOOLEAN,
  INTEGER,
  URI
} = CONSTANTS;
import { IppOperationId } from './ops';
import { Buffer } from 'node:buffer';

/**
 * IPP Client 配置选项
 */
export interface IppClientOptions {
  /** 打印机或 IPP 服务器的 URL */
  url: string;
  /** 用户名（可选） */
  username?: string;
  /** 密码（可选） */
  password?: string;
  /** 连接超时时间（毫秒） */
  timeout?: number;
}

/**
 * IPP Client 类
 */
export class IppClient {
  private url: URL;
  private username?: string;
  private password?: string;
  private timeout: number;

  constructor(options: IppClientOptions) {
    this.url = new URL(options.url);
    this.username = options.username;
    this.password = options.password;
    this.timeout = options.timeout || 30000;
  }

  /**
   * 发送 IPP 请求
   */
  async sendRequest(
    operationId: number, 
    attributes: any[] = [], 
    data?: Buffer
  ): Promise<IPPResponse> {
    // 创建 IPP 请求对象
    const request: IPPRequest = {
      version: { major: 2, minor: 0 },
      operationId,
      requestId: Math.floor(Math.random() * 0xffff),
      groups: [
        {
          tag: OPERATION_ATTRIBUTES_TAG, // operation-attributes-tag
          attributes: [
            { tag: CHARSET, name: 'attributes-charset', value: ['utf-8'] },
            { tag: NATURAL_LANG, name: 'attributes-natural-language', value: ['en'] },
            ...attributes
          ]
        }
      ]
    };

    // 如果有认证信息，添加认证属性
    if (this.username && this.password && request.groups) {
      request.groups[0].attributes.push(
        { tag: NAME_WITHOUT_LANG, name: 'requesting-user-name', value: [this.username] }
      );
    }

    // 发送请求并获取响应
    const response = await this.sendIppRequest(request, data);
    
    // 总是返回原始响应，不进行解析
    return response;
  }

  /**
   * 发送 IPP 请求到服务器
   */
  private async sendIppRequest(request: IPPRequest, data?: Buffer): Promise<IPPResponse> {
    // 编码 IPP 请求
    const ippData = encoder.encode(request);
    
    // 准备完整的请求体
    const requestBody = data ? Buffer.concat([ippData, data]) : ippData;
    
    // 设置请求 URL
    const url = new URL(this.url);
    // 设置默认端口
    if (!url.port) {
      url.port = this.url.protocol === 'https:' ? '443' : '631';
    }
    
    // 创建 AbortController 用于超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    
    const fetchOptions: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/ipp',
        'Content-Length': requestBody.length.toString(),
        'Host': `${url.hostname}:${url.port}`
      },
      body: new Uint8Array(requestBody),
      signal: controller.signal
    };

    // 如果有认证信息，添加认证头
    if (this.username && this.password) {
      const auth = Buffer.from(`${this.username}:${this.password}`).toString('base64');
      fetchOptions.headers = {
        ...fetchOptions.headers,
        'Authorization': `Basic ${auth}`
      };
    }

    try {
      // 发送请求
      const response = await fetch(url.href, fetchOptions);
      clearTimeout(timeoutId); // 清除超时
      
      // 检查 HTTP 状态码
      if (!response.ok) {
        throw new Error(`HTTP request failed with status ${response.status}: ${response.statusText}`);
      }
      
      // 读取响应数据
      const buffer = await response.arrayBuffer();
      const ippResponseData = Buffer.from(buffer);
      
      // 解码 IPP 响应
      const ippResponse = decoder.decodeResponse(ippResponseData);
      return ippResponse;
    } catch (error) {
      clearTimeout(timeoutId); // 确保清除超时
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error(`IPP request timed out after ${this.timeout}ms`);
        }
        throw new Error(`IPP request failed: ${error.message}`);
      }
      throw new Error('IPP request failed with unknown error');
    }
  }

  /**
   * 获取打印机属性
   */
  async getPrinterAttributes(
    attributes?: string[]
  ): Promise<IPPResponse> {
    const attrs = [
      { tag: URI, name: 'printer-uri', value: [`${this.url.protocol}//${this.url.host}${this.url.pathname}`] }
    ];
    
    if (attributes) {
      attrs.push({ tag: KEYWORD, name: 'requested-attributes', value: attributes });
    } else {
      attrs.push({ tag: KEYWORD, name: 'requested-attributes', value: ['all'] });
    }

    return this.sendRequest(IppOperationId.GetPrinterAttributes, attrs);
  }

  /**
   * 获取作业列表
   */
  async getJobs(
    whichJobs: 'completed' | 'not-completed' | 'all' = 'not-completed'
  ): Promise<IPPResponse> {
    return this.sendRequest(IppOperationId.GetJobs, [
      { tag: ENUM, name: 'which-jobs', value: [whichJobs] },
      { tag: BOOLEAN, name: 'my-jobs', value: [false] },
      { tag: KEYWORD, name: 'requested-attributes', value: ['job-id', 'job-name', 'job-state'] }
    ]);
  }

  /**
   * 打印作业
   */
  async printJob(
    jobName: string,
    document: Buffer,
    attributes?: any[]
  ): Promise<IPPResponse> {
    const attrs: any[] = [
      { tag: URI, name: 'printer-uri', value: [`${this.url.protocol}//${this.url.host}${this.url.pathname}`] },
      { tag: NAME_WITHOUT_LANG, name: 'job-name', value: [jobName] },
      { tag: KEYWORD, name: 'document-format', value: ['application/octet-stream'] },
      ...attributes || []
    ];

    return this.sendRequest(IppOperationId.PrintJob, attrs, document);
  }

  /**
   * 通过URI打印
   */
  async printURI(
    jobName: string,
    documentURI: string,
    attributes?: any[]
  ): Promise<IPPResponse> {
    const attrs: any[] = [
      { tag: URI, name: 'printer-uri', value: [`${this.url.protocol}//${this.url.host}${this.url.pathname}`] },
      { tag: NAME_WITHOUT_LANG, name: 'job-name', value: [jobName] },
      { tag: URI, name: 'document-uri', value: [documentURI] },
      ...attributes || []
    ];

    return this.sendRequest(IppOperationId.PrintURI, attrs);
  }

  /**
   * 验证作业
   */
  async validateJob(
    attributes?: any[]
  ): Promise<IPPResponse> {
    const attrs: any[] = [
      { tag: URI, name: 'printer-uri', value: [`${this.url.protocol}//${this.url.host}${this.url.pathname}`] },
      ...attributes || []
    ];

    return this.sendRequest(IppOperationId.ValidateJob, attrs);
  }

  /**
   * 创建作业
   */
  async createJob(
    jobName: string,
    attributes?: any[]
  ): Promise<IPPResponse> {
    const attrs: any[] = [
      { tag: URI, name: 'printer-uri', value: [`${this.url.protocol}//${this.url.host}${this.url.pathname}`] },
      { tag: NAME_WITHOUT_LANG, name: 'job-name', value: [jobName] },
      ...attributes || []
    ];

    return this.sendRequest(IppOperationId.CreateJob, attrs);
  }

  /**
   * 发送文档
   */
  async sendDocument(
    jobId: number,
    document: Buffer,
    lastDocument: boolean = true,
    attributes?: any[]
  ): Promise<IPPResponse> {
    const attrs: any[] = [
      { tag: URI, name: 'printer-uri', value: [`${this.url.protocol}//${this.url.host}${this.url.pathname}`] },
      { tag: INTEGER, name: 'job-id', value: [jobId] },
      { tag: BOOLEAN, name: 'last-document', value: [lastDocument] },
      { tag: KEYWORD, name: 'document-format', value: ['application/octet-stream'] },
      ...attributes || []
    ];

    return this.sendRequest(IppOperationId.SendDocument, attrs, document);
  }

  /**
   * 通过URI发送文档
   */
  async sendURI(
    jobId: number,
    documentURI: string,
    lastDocument: boolean = true,
    attributes?: any[]
  ): Promise<IPPResponse> {
    const attrs: any[] = [
      { tag: URI, name: 'printer-uri', value: [`${this.url.protocol}//${this.url.host}${this.url.pathname}`] },
      { tag: INTEGER, name: 'job-id', value: [jobId] },
      { tag: BOOLEAN, name: 'last-document', value: [lastDocument] },
      { tag: URI, name: 'document-uri', value: [documentURI] },
      ...attributes || []
    ];

    return this.sendRequest(IppOperationId.SendURI, attrs);
  }

  /**
   * 取消作业
   */
  async cancelJob(
    jobId: number
  ): Promise<IPPResponse> {
    return this.sendRequest(IppOperationId.CancelJob, [
      { tag: URI, name: 'printer-uri', value: [`${this.url.protocol}//${this.url.host}${this.url.pathname}`] },
      { tag: INTEGER, name: 'job-id', value: [jobId] }
    ]);
  }

  /**
   * 获取作业属性
   */
  async getJobAttributes(
    jobId: number,
    attributes?: string[]
  ): Promise<IPPResponse> {
    const attrs = [
      { tag: URI, name: 'printer-uri', value: [`${this.url.protocol}//${this.url.host}${this.url.pathname}`] },
      { tag: INTEGER, name: 'job-id', value: [jobId] }
    ];
    
    if (attributes) {
      attrs.push({ tag: KEYWORD, name: 'requested-attributes', value: attributes });
    }

    return this.sendRequest(IppOperationId.GetJobAttributes, attrs);
  }

  /**
   * 暂停作业
   */
  async holdJob(
    jobId: number
  ): Promise<IPPResponse> {
    return this.sendRequest(IppOperationId.HoldJob, [
      { tag: URI, name: 'printer-uri', value: [`${this.url.protocol}//${this.url.host}${this.url.pathname}`] },
      { tag: INTEGER, name: 'job-id', value: [jobId] }
    ]);
  }

  /**
   * 释放作业
   */
  async releaseJob(
    jobId: number
  ): Promise<IPPResponse> {
    return this.sendRequest(IppOperationId.ReleaseJob, [
      { tag: URI, name: 'printer-uri', value: [`${this.url.protocol}//${this.url.host}${this.url.pathname}`] },
      { tag: INTEGER, name: 'job-id', value: [jobId] }
    ]);
  }

  /**
   * 重启作业
   */
  async restartJob(
    jobId: number
  ): Promise<IPPResponse> {
    return this.sendRequest(IppOperationId.RestartJob, [
      { tag: URI, name: 'printer-uri', value: [`${this.url.protocol}//${this.url.host}${this.url.pathname}`] },
      { tag: INTEGER, name: 'job-id', value: [jobId] }
    ]);
  }

  /**
   * 关闭作业
   */
  async closeJob(
    jobId: number
  ): Promise<IPPResponse> {
    return this.sendRequest(IppOperationId.CloseJob, [
      { tag: URI, name: 'printer-uri', value: [`${this.url.protocol}//${this.url.host}${this.url.pathname}`] },
      { tag: INTEGER, name: 'job-id', value: [jobId] }
    ]);
  }

  /**
   * 重新处理作业
   */
  async reprocessJob(
    jobId: number
  ): Promise<IPPResponse> {
    return this.sendRequest(IppOperationId.ReprocessJob, [
      { tag: URI, name: 'printer-uri', value: [`${this.url.protocol}//${this.url.host}${this.url.pathname}`] },
      { tag: INTEGER, name: 'job-id', value: [jobId] }
    ]);
  }

  /**
   * 取消所有作业
   */
  async cancelJobs(
    whichJobs?: 'aborted' | 'pending' | 'processing' | 'held' | 'completed' | 'stopped' | 'canceled' | 'all'
  ): Promise<IPPResponse> {
    const attrs = [
      { tag: URI, name: 'printer-uri', value: [`${this.url.protocol}//${this.url.host}${this.url.pathname}`] }
    ];
    
    if (whichJobs) {
      attrs.push({ tag: ENUM, name: 'which-jobs', value: [whichJobs] });
    }

    return this.sendRequest(IppOperationId.CancelJobs, attrs);
  }

  /**
   * 取消当前用户的所有作业
   */
  async cancelMyJobs(): Promise<IPPResponse> {
    return this.sendRequest(IppOperationId.CancelMyJobs, [
      { tag: URI, name: 'printer-uri', value: [`${this.url.protocol}//${this.url.host}${this.url.pathname}`] }
    ]);
  }

  /**
   * 重新提交作业
   */
  async resubmitJob(
    jobId: number,
    attributes?: any[]
  ): Promise<IPPResponse> {
    const attrs: any[] = [
      { tag: URI, name: 'printer-uri', value: [`${this.url.protocol}//${this.url.host}${this.url.pathname}`] },
      { tag: INTEGER, name: 'job-id', value: [jobId] },
      ...attributes || []
    ];

    return this.sendRequest(IppOperationId.ResubmitJob, attrs);
  }

  /**
   * 暂停打印机
   */
  async pausePrinter(): Promise<IPPResponse> {
    return this.sendRequest(IppOperationId.PausePrinter, [
      { tag: URI, name: 'printer-uri', value: [`${this.url.protocol}//${this.url.host}${this.url.pathname}`] }
    ]);
  }

  /**
   * 恢复打印机
   */
  async resumePrinter(): Promise<IPPResponse> {
    return this.sendRequest(IppOperationId.ResumePrinter, [
      { tag: URI, name: 'printer-uri', value: [`${this.url.protocol}//${this.url.host}${this.url.pathname}`] }
    ]);
  }

  /**
   * 清除所有作业
   */
  async purgeJobs(): Promise<IPPResponse> {
    return this.sendRequest(IppOperationId.PurgeJobs, [
      { tag: URI, name: 'printer-uri', value: [`${this.url.protocol}//${this.url.host}${this.url.pathname}`] }
    ]);
  }

  /**
   * 设置打印机属性
   */
  async setPrinterAttributes(
    attributes: any[]
  ): Promise<IPPResponse> {
    return this.sendRequest(IppOperationId.SetPrinterAttributes, [
      { tag: URI, name: 'printer-uri', value: [`${this.url.protocol}//${this.url.host}${this.url.pathname}`] },
      ...attributes
    ]);
  }

  /**
   * 设置作业属性
   */
  async setJobAttributes(
    jobId: number,
    attributes: any[]
  ): Promise<IPPResponse> {
    return this.sendRequest(IppOperationId.SetJobAttributes, [
      { tag: URI, name: 'printer-uri', value: [`${this.url.protocol}//${this.url.host}${this.url.pathname}`] },
      { tag: INTEGER, name: 'job-id', value: [jobId] },
      ...attributes
    ]);
  }

  /**
   * 创建打印机订阅
   */
  async createPrinterSubscription(
    attributes?: any[]
  ): Promise<IPPResponse> {
    return this.sendRequest(IppOperationId.CreatePrinterSubscription, [
      { tag: URI, name: 'printer-uri', value: [`${this.url.protocol}//${this.url.host}${this.url.pathname}`] },
      ...attributes || []
    ]);
  }

  /**
   * 创建作业订阅
   */
  async createJobSubscription(
    jobId: number,
    attributes?: any[]
  ): Promise<IPPResponse> {
    return this.sendRequest(IppOperationId.CreateJobSubscription, [
      { tag: URI, name: 'printer-uri', value: [`${this.url.protocol}//${this.url.host}${this.url.pathname}`] },
      { tag: INTEGER, name: 'job-id', value: [jobId] },
      ...attributes || []
    ]);
  }

  /**
   * 获取订阅属性
   */
  async getSubscriptionAttributes(
    subscriptionId: number,
    attributes?: string[]
  ): Promise<IPPResponse> {
    const attrs = [
      { tag: URI, name: 'printer-uri', value: [`${this.url.protocol}//${this.url.host}${this.url.pathname}`] },
      { tag: INTEGER, name: 'subscription-id', value: [subscriptionId] }
    ];
    
    if (attributes) {
      attrs.push({ tag: KEYWORD, name: 'requested-attributes', value: attributes });
    }

    return this.sendRequest(IppOperationId.GetSubscriptionAttributes, attrs);
  }

  /**
   * 获取订阅列表
   */
  async getSubscriptions(
    attributes?: string[]
  ): Promise<IPPResponse> {
    const attrs = [
      { tag: URI, name: 'printer-uri', value: [`${this.url.protocol}//${this.url.host}${this.url.pathname}`] }
    ];
    
    if (attributes) {
      attrs.push({ tag: KEYWORD, name: 'requested-attributes', value: attributes });
    }

    return this.sendRequest(IppOperationId.GetSubscriptions, attrs);
  }

  /**
   * 续订订阅
   */
  async renewSubscription(
    subscriptionId: number,
    attributes?: any[]
  ): Promise<IPPResponse> {
    return this.sendRequest(IppOperationId.RenewSubscription, [
      { tag: URI, name: 'printer-uri', value: [`${this.url.protocol}//${this.url.host}${this.url.pathname}`] },
      { tag: INTEGER, name: 'subscription-id', value: [subscriptionId] },
      ...attributes || []
    ]);
  }

  /**
   * 取消订阅
   */
  async cancelSubscription(
    subscriptionId: number
  ): Promise<IPPResponse> {
    return this.sendRequest(IppOperationId.CancelSubscription, [
      { tag: URI, name: 'printer-uri', value: [`${this.url.protocol}//${this.url.host}${this.url.pathname}`] },
      { tag: INTEGER, name: 'subscription-id', value: [subscriptionId] }
    ]);
  }

  /**
   * 获取通知
   */
  async getNotifications(
    notificationChannelURI: string
  ): Promise<IPPResponse> {
    return this.sendRequest(IppOperationId.GetNotifications, [
      { tag: URI, name: 'printer-uri', value: [`${this.url.protocol}//${this.url.host}${this.url.pathname}`] },
      { tag: URI, name: 'notification-channel-uri', value: [notificationChannelURI] }
    ]);
  }

  /**
   * 启用打印机
   */
  async enablePrinter(): Promise<IPPResponse> {
    return this.sendRequest(IppOperationId.EnablePrinter, [
      { tag: URI, name: 'printer-uri', value: [`${this.url.protocol}//${this.url.host}${this.url.pathname}`] }
    ]);
  }

  /**
   * 禁用打印机
   */
  async disablePrinter(): Promise<IPPResponse> {
    return this.sendRequest(IppOperationId.DisablePrinter, [
      { tag: URI, name: 'printer-uri', value: [`${this.url.protocol}//${this.url.host}${this.url.pathname}`] }
    ]);
  }

  /**
   * 暂停新作业
   */
  async holdNewJobs(): Promise<IPPResponse> {
    return this.sendRequest(IppOperationId.HoldNewJobs, [
      { tag: URI, name: 'printer-uri', value: [`${this.url.protocol}//${this.url.host}${this.url.pathname}`] }
    ]);
  }

  /**
   * 释放暂停的新作业
   */
  async releaseHeldNewJobs(): Promise<IPPResponse> {
    return this.sendRequest(IppOperationId.ReleaseHeldNewJobs, [
      { tag: URI, name: 'printer-uri', value: [`${this.url.protocol}//${this.url.host}${this.url.pathname}`] }
    ]);
  }
}

/**
 * 创建 IPP Client 实例
 */
export function createIppClient(options: IppClientOptions): IppClient {
  return new IppClient(options);
}
