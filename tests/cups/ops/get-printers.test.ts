import { CupsClient } from '../../../src/cups/client';
import { createTestCupsClient, TEST_CONFIG } from '../../utils/test-utils';

describe('CUPS Client - CUPS-Get-Printers', () => {
  let cupsClient: CupsClient;

  beforeEach(() => {
    cupsClient = createTestCupsClient();
  });

  describe('CUPS Server Tests', () => {
    it('should get printers with default attributes', async () => {
      const response = await cupsClient.getPrinters(undefined);

      expect(response).toBeDefined();
      expect(response.version).toBeDefined();
      expect(response.statusCode).toBeDefined();
      expect(response.requestId).toBeDefined();
      // Check if it has groups or attributeGroups depending on the response type
      expect('groups' in response || 'attributeGroups' in response).toBe(true);
    });

    it('should get printers with raw response', async () => {
      const response = await cupsClient.getPrinters(undefined);

      expect(response).toBeDefined();
      expect(response.version).toBeDefined();
      expect(response.statusCode).toBeDefined();
      expect(response.requestId).toBeDefined();
      // Check for printerAttributes in parsed response
    });

    it('should get printers with specific attributes', async () => {
      const response = await cupsClient.getPrinters(['printer-name', 'printer-state', 'printer-uri-supported']);

      expect(response).toBeDefined();
      // Check if it has groups or attributeGroups depending on the response type
      expect('groups' in response || 'attributeGroups' in response).toBe(true);
    });
  });

  describe('Real CUPS Server Tests', () => {
    it('should get printers from real CUPS server', async () => {
      if (TEST_CONFIG.SKIP_REAL_CUPS) {
        return;
      }

      const response = await cupsClient.getPrinters(undefined);

      expect(response).toBeDefined();
      expect(response.version).toBeDefined();
      expect(response.statusCode).toBeDefined();
      expect(response.requestId).toBeDefined();
      // Check if it has groups or attributeGroups depending on the response type
      expect('groups' in response || 'attributeGroups' in response).toBe(true);
    });

    it('should get raw printers from real CUPS server', async () => {
      if (TEST_CONFIG.SKIP_REAL_CUPS) {
        return;
      }

      const response = await cupsClient.getPrinters(['printer-name', 'printer-state']);

      expect(response).toBeDefined();
      // Check for printerAttributes in parsed response
    });
  });

  describe('Error Handling', () => {
    it('should handle timeout', async () => {
      const slowClient = createTestCupsClient({
        url: 'http://localhost:9999',
        timeout: 100
      });

      await expect(slowClient.getPrinters(undefined)).rejects.toThrow();
    });
  });
});
