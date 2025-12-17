import { IppClient } from '../../../src/ipp/client';
import { createTestIppClient, TEST_CONFIG, generateTestPrintData } from '../../utils/test-utils';
import { CONSTANTS } from 'eup-ipp-encoder';

const { KEYWORD } = CONSTANTS;

describe('IPP Client - Print-Job', () => {
  let ippClient: IppClient;

  beforeEach(() => {
    ippClient = createTestIppClient();
  });

  describe('Node-IPP Server Tests', () => {
    it('should submit a basic print job to Node-IPP server', async () => {
      const printData = generateTestPrintData();
      const response = await ippClient.printJob('Test Job', printData, undefined);

      expect(response).toBeDefined();
      expect(response.version).toBeDefined();
      expect(response.statusCode).toBeDefined();
      expect(response.requestId).toBeDefined();
      // Check if it has groups or attributeGroups depending on the response type
      expect('groups' in response || 'attributeGroups' in response).toBe(true);
    });

    it('should submit a print job to Node-IPP server', async () => {
      const printData = generateTestPrintData();
      const response = await ippClient.printJob('Test Job', printData, undefined);

      expect(response).toBeDefined();
      expect(response.version).toBeDefined();
      expect(response.statusCode).toBeDefined();
      expect(response.requestId).toBeDefined();
    });

    it('should submit a print job with custom attributes from Node-IPP server', async () => {
      const printData = generateTestPrintData();
      const attributes = [
        { tag: KEYWORD, name: 'document-format', value: ['text/plain'] },
        { tag: KEYWORD, name: 'sides', value: ['one-sided'] }
      ];
      const response = await ippClient.printJob('Test Job', printData, attributes);

      expect(response).toBeDefined();
      // Check if it has groups or attributeGroups depending on the response type
      expect('groups' in response || 'attributeGroups' in response).toBe(true);
    });

    it('should submit a print job with copies from Node-IPP server', async () => {
      const printData = generateTestPrintData();
      const attributes = [
        { tag: KEYWORD, name: 'copies', value: ['2'] }
      ];
      const response = await ippClient.printJob('Test Job', printData, attributes);

      expect(response).toBeDefined();
      // Check if it has groups or attributeGroups depending on the response type
      expect('groups' in response || 'attributeGroups' in response).toBe(true);
    });
  });

  describe('Real CUPS Server Tests', () => {
    it('should submit a print job to real CUPS server', async () => {
      if (TEST_CONFIG.SKIP_IPP_REAL) {
        return;
      }

      const realCupsClient = createTestIppClient({
        url: TEST_CONFIG.CUPS_URL
      });

      const printData = generateTestPrintData();
      const response = await realCupsClient.printJob('Test Job', printData, undefined);

      expect(response).toBeDefined();
      expect(response.version).toBeDefined();
      expect(response.statusCode).toBeDefined();
      expect(response.requestId).toBeDefined();
      // Check if it has groups or attributeGroups depending on the response type
      expect('groups' in response || 'attributeGroups' in response).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle timeout', async () => {
      const slowClient = createTestIppClient({
        url: 'http://localhost:9999',
        timeout: 100
      });

      const printData = generateTestPrintData();
      await expect(slowClient.printJob('Test Job', printData, undefined)).rejects.toThrow();
    });

    it('should handle empty print data', async () => {
      const printData = Buffer.alloc(0);
      const response = await ippClient.printJob('Empty Job', printData, undefined);

      expect(response).toBeDefined();
      expect(response.statusCode).toBeDefined();
    });
  });
});
