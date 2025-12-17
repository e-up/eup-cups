import { IppClient } from '../../../src/ipp/client';
import { createTestIppClient, TEST_CONFIG, generateTestPrintData } from '../../utils/test-utils';
import { Buffer } from 'node:buffer';

// Use a reasonable test job ID
const TEST_JOB_ID = 1;

 describe('IPP Client - Send-Document', () => {
  let ippClient: IppClient;

  beforeEach(() => {
    ippClient = createTestIppClient();
  });

  describe('Node-IPP Server Tests', () => {
    it('should send document with basic attributes from Node-IPP server', async () => {
      const printData = generateTestPrintData();
      const response = await ippClient.sendDocument(TEST_JOB_ID, printData, true, undefined);

      expect(response).toBeDefined();
      expect(response.version).toBeDefined();
      expect(response.statusCode).toBeDefined();
      expect(response.requestId).toBeDefined();
      // Check if it has groups or attributeGroups depending on the response type
      expect('groups' in response || 'attributeGroups' in response).toBe(true);
    });

    it('should send document from Node-IPP server', async () => {
      const printData = generateTestPrintData();
      const response = await ippClient.sendDocument(TEST_JOB_ID, printData, true, undefined);

      expect(response).toBeDefined();
      expect(response.version).toBeDefined();
      expect(response.statusCode).toBeDefined();
      expect(response.requestId).toBeDefined();
    });

    it('should send document as last document from Node-IPP server', async () => {
      const printData = generateTestPrintData();
      const response = await ippClient.sendDocument(TEST_JOB_ID, printData, true, undefined);

      expect(response).toBeDefined();
      expect(response.version).toBeDefined();
      expect(response.statusCode).toBeDefined();
      expect(response.requestId).toBeDefined();
      expect('groups' in response || 'attributeGroups' in response).toBe(true);
    });

    it('should send document as intermediate document from Node-IPP server', async () => {
      const printData = generateTestPrintData();
      const response = await ippClient.sendDocument(TEST_JOB_ID, printData, false, undefined);

      expect(response).toBeDefined();
      expect(response.version).toBeDefined();
      expect(response.statusCode).toBeDefined();
      expect(response.requestId).toBeDefined();
      expect('groups' in response || 'attributeGroups' in response).toBe(true);
    });

    it('should send document with custom attributes from Node-IPP server', async () => {
      const printData = generateTestPrintData();
      const attributes = [
        { tag: 'keyword', name: 'document-format', value: ['text/plain'] }
      ];
      const response = await ippClient.sendDocument(TEST_JOB_ID, printData, true, attributes);

      expect(response).toBeDefined();
      expect(response.version).toBeDefined();
      expect(response.statusCode).toBeDefined();
      expect(response.requestId).toBeDefined();
      expect('groups' in response || 'attributeGroups' in response).toBe(true);
    });
  });

  describe('Real CUPS Server Tests', () => {
    it('should send document with basic attributes from real CUPS server', async () => {
      if (TEST_CONFIG.SKIP_IPP_REAL) {
        return;
      }

      const realCupsClient = createTestIppClient({
        url: TEST_CONFIG.CUPS_URL
      });

      const printData = generateTestPrintData();
      const response = await realCupsClient.sendDocument(TEST_JOB_ID, printData, true, undefined);

      expect(response).toBeDefined();
      expect(response.version).toBeDefined();
      expect(response.statusCode).toBeDefined();
      expect(response.requestId).toBeDefined();
      expect('groups' in response || 'attributeGroups' in response).toBe(true);
    });

    it('should send document from real CUPS server', async () => {
      if (TEST_CONFIG.SKIP_IPP_REAL) {
        return;
      }

      const realCupsClient = createTestIppClient({
        url: TEST_CONFIG.CUPS_URL
      });

      const printData = generateTestPrintData();
      const response = await realCupsClient.sendDocument(TEST_JOB_ID, printData, true, undefined);

      expect(response).toBeDefined();
      expect(response.version).toBeDefined();
      expect(response.statusCode).toBeDefined();
      expect(response.requestId).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid configuration', async () => {
      // Create client with invalid URL to test error handling
      const invalidClient = createTestIppClient({
        url: 'http://non-existent-server:9999'
      });

      const printData = generateTestPrintData();
      await expect(invalidClient.sendDocument(TEST_JOB_ID, printData, true, undefined)).rejects.toThrow();
    });
  });
});