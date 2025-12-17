import { IppClient, IppClientOptions } from '../ipp/client';
import { CupsOperationId } from './ops';
import { IPPResponse, CONSTANTS } from 'eup-ipp-encoder';

const {
  KEYWORD,
  INTEGER,
  URI,
  ENUM,
  BOOLEAN,
  NAME_WITHOUT_LANG
} = CONSTANTS;

/**
 * CUPS Client 类
 */
export class CupsClient extends IppClient {
  constructor(options: IppClientOptions) {
    super(options);
  }

  /**
   * 获取所有打印机列表
   */
  async getPrinters(
    attributes?: string[],
  ): Promise<IPPResponse> {
    const attrs: Array<{ tag: number; name: string; value: any[] }> = [];
    
    if (attributes) {
      attrs.push({ tag: KEYWORD, name: 'requested-attributes', value: attributes });
    } else {
      // 默认请求更多必要属性，包括printer-type用于区分打印机和打印机类
      attrs.push({ tag: KEYWORD, name: 'requested-attributes', value: [
        'printer-name', 
        'printer-uri-supported', 
        'printer-state',
        'printer-state-reasons',
        'printer-type',
        'printer-is-accepting-jobs',
        'printer-location',
        'printer-info',
        'printer-make-and-model',
        'document-format-supported',
        'media-supported'
      ] });
    }

    return this.sendRequest(CupsOperationId.GetPrinters, attrs, undefined);
  }

  /**
   * 获取默认打印机
   */
  async getDefaultPrinter(
    attributes?: string[],
  ): Promise<IPPResponse> {
    const attrs: Array<{ tag: number; name: string; value: any[] }> = [];
    
    if (attributes) {
      attrs.push({ tag: KEYWORD, name: 'requested-attributes', value: attributes });
    }

    return this.sendRequest(CupsOperationId.GetDefault, attrs, undefined);
  }

  /**
   * 获取所有打印机类
   */
  async getClasses(
    attributes?: string[],
  ): Promise<IPPResponse> {
    const attrs: Array<{ tag: number; name: string; value: any[] }> = [];
    
    if (attributes) {
      attrs.push({ tag: KEYWORD, name: 'requested-attributes', value: attributes });
    } else {
      attrs.push({ tag: KEYWORD, name: 'requested-attributes', value: ['printer-name', 'printer-uri-supported', 'member-uris'] });
    }

    return this.sendRequest(CupsOperationId.GetClasses, attrs, undefined);
  }

  /**
   * 添加或修改打印机
   */
  async addModifyPrinter(
    attributes: Array<{ tag: number; name: string; value: any[] }>,
  ): Promise<IPPResponse> {
    return this.sendRequest(CupsOperationId.AddModifyPrinter, attributes, undefined);
  }

  /**
   * 删除打印机
   */
  async deletePrinter(
    printerUri: string,
  ): Promise<IPPResponse> {
    return this.sendRequest(CupsOperationId.DeletePrinter, [
      { tag: URI, name: 'printer-uri', value: [printerUri] }
    ], undefined);
  }

  /**
   * 添加或修改打印机类
   */
  async addModifyClass(
    attributes: Array<{ tag: number; name: string; value: any[] }>,
  ): Promise<IPPResponse> {
    return this.sendRequest(CupsOperationId.AddModifyClass, attributes, undefined);
  }

  /**
   * 删除打印机类
   */
  async deleteClass(
    classUri: string,
  ): Promise<IPPResponse> {
    return this.sendRequest(CupsOperationId.DeleteClass, [
      { tag: URI, name: 'printer-uri', value: [classUri] }
    ], undefined);
  }

  /**
   * 设置默认打印机
   */
  async setDefault(
    printerUri: string,
  ): Promise<IPPResponse> {
    return this.sendRequest(CupsOperationId.SetDefault, [
      { tag: URI, name: 'printer-uri', value: [printerUri] }
    ], undefined);
  }

  /**
   * 获取可用设备列表
   */
  async getDevices(
    deviceId?: string,
    attributes?: string[],
  ): Promise<IPPResponse> {
    const attrs: Array<{ tag: number; name: string; value: any[] }> = [];
    
    if (deviceId) {
      attrs.push({ tag: KEYWORD, name: 'device-id', value: [deviceId] });
    }
    
    if (attributes) {
      attrs.push({ tag: KEYWORD, name: 'requested-attributes', value: attributes });
    } else {
      attrs.push({ tag: KEYWORD, name: 'requested-attributes', value: ['device-id', 'device-info', 'device-uri'] });
    }

    return this.sendRequest(CupsOperationId.GetDevices, attrs, undefined);
  }

  /**
   * 获取可用PPD列表
   */
  async getPPDs(
    ppdName?: string,
    attributes?: string[],
  ): Promise<IPPResponse> {
    const attrs: Array<{ tag: number; name: string; value: any[] }> = [];
    
    if (ppdName) {
      attrs.push({ tag: KEYWORD, name: 'ppd-name', value: [ppdName] });
    }
    
    if (attributes) {
      attrs.push({ tag: KEYWORD, name: 'requested-attributes', value: attributes });
    } else {
      attrs.push({ tag: KEYWORD, name: 'requested-attributes', value: ['ppd-name', 'ppd-language-level', 'ppd-model'] });
    }

    return this.sendRequest(CupsOperationId.GetPPDs, attrs, undefined);
  }

  /**
   * 移动作业
   */
  async moveJob(
    jobId: number,
    sourcePrinterUri: string,
    destinationPrinterUri: string,
  ): Promise<IPPResponse> {
    return this.sendRequest(CupsOperationId.MoveJob, [
      { tag: URI, name: 'printer-uri', value: [sourcePrinterUri] },
      { tag: INTEGER, name: 'job-id', value: [jobId] },
      { tag: URI, name: 'destination-printer-uri', value: [destinationPrinterUri] }
    ], undefined);
  }

  /**
   * 作业认证
   */
  async authenticateJob(
    jobId: number,
    printerUri: string,
  ): Promise<IPPResponse> {
    return this.sendRequest(CupsOperationId.AuthenticateJob, [
      { tag: URI, name: 'printer-uri', value: [printerUri] },
      { tag: INTEGER, name: 'job-id', value: [jobId] }
    ], undefined);
  }

  /**
   * 获取PPD文件
   */
  async getPPD(
    printerUri: string,
  ): Promise<IPPResponse> {
    return this.sendRequest(CupsOperationId.GetPPD, [
      { tag: URI, name: 'printer-uri', value: [printerUri] }
    ], undefined);
  }

  /**
   * 获取文档
   */
  async getDocument(
    jobId: number,
    printerUri: string,
    documentId?: number,
    documentFormat?: string,
  ): Promise<IPPResponse> {
    const attrs: Array<{ tag: number; name: string; value: any[] }> = [
      { tag: URI, name: 'printer-uri', value: [printerUri] },
      { tag: INTEGER, name: 'job-id', value: [jobId] }
    ];

    if (documentId !== undefined) {
      attrs.push({ tag: INTEGER, name: 'document-id', value: [documentId] });
    }

    if (documentFormat) {
      attrs.push({ tag: KEYWORD, name: 'document-format', value: [documentFormat] });
    }

    return this.sendRequest(CupsOperationId.GetDocument, attrs, undefined);
  }

  /**
   * 创建本地打印机
   */
  async createLocalPrinter(
    attributes: Array<{ tag: number; name: string; value: any[] }>,
  ): Promise<IPPResponse> {
    return this.sendRequest(CupsOperationId.CreateLocalPrinter, attributes, undefined);
  }

  /**
   * 接受作业（已废弃）
   */
  async acceptJobs(
    printerUri: string,
  ): Promise<IPPResponse> {
    return this.sendRequest(CupsOperationId.AcceptJobs, [
      { tag: URI, name: 'printer-uri', value: [printerUri] }
    ], undefined);
  }

  /**
   * 拒绝作业（已废弃）
   */
  async rejectJobs(
    printerUri: string,
  ): Promise<IPPResponse> {
    return this.sendRequest(CupsOperationId.RejectJobs, [
      { tag: URI, name: 'printer-uri', value: [printerUri] }
    ], undefined);
  }

  /**
   * 根据打印机名称获取其URI
   */
  async getPrinterUri(
    printerName: string,
  ): Promise<string | null> {
    const printersResponse = await this.getPrinters(['printer-name', 'printer-uri-supported']);
    
    if (printersResponse.groups) {
      for (const group of printersResponse.groups) {
        if (group.attributes) {
          let currentName: string | null = null;
          let currentUri: string | null = null;
          
          for (const attr of group.attributes) {
            if (attr.name === 'printer-name' && attr.value && attr.value.length > 0) {
              currentName = attr.value[0];
            } else if (attr.name === 'printer-uri-supported' && attr.value && attr.value.length > 0) {
              currentUri = attr.value[0];
            }
            
            // 如果同时找到了名称和URI，并且名称匹配，返回URI
            if (currentName === printerName && currentUri) {
              return currentUri;
            }
          }
        }
      }
    }
    
    return null;
  }
}

/**
 * 创建 CUPS Client 实例
 */
export function createCupsClient(options: IppClientOptions): CupsClient {
  return new CupsClient(options);
}
