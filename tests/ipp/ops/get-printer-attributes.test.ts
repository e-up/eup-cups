import { IppClient } from '../../../src/ipp/client';
import { createTestIppClient, TEST_CONFIG, BASIC_PRINTER_ATTRIBUTES } from '../../utils/test-utils';

describe('IPP Client - Get-Printer-Attributes', () => {
  let ippClient: IppClient;

  beforeEach(() => {
    ippClient = createTestIppClient();
  });

  describe('Node-IPP Server Tests', () => {
    it('should get basic printer attributes from Node-IPP server', async () => {
      const response = await ippClient.getPrinterAttributes(BASIC_PRINTER_ATTRIBUTES);

      expect(response).toBeDefined();
      expect(response.version).toBeDefined();
      expect(response.statusCode).toBeDefined();
      expect(response.requestId).toBeDefined();
      // Check if it has groups or attributeGroups depending on the response type
      expect('groups' in response || 'attributeGroups' in response).toBe(true);
    });

    it('should get printer attributes from Node-IPP server', async () => {
      const response = await ippClient.getPrinterAttributes(BASIC_PRINTER_ATTRIBUTES);

      expect(response).toBeDefined();
      expect(response.version).toBeDefined();
      expect(response.statusCode).toBeDefined();
      expect(response.requestId).toBeDefined();
    });
  });

  describe('Real CUPS Server Tests', () => {
    it('should get basic printer attributes from real CUPS server', async () => {
      if (TEST_CONFIG.SKIP_IPP_REAL) {
        return;
      }

      const realCupsClient = createTestIppClient({
        url: TEST_CONFIG.CUPS_URL
      });

      const response = await realCupsClient.getPrinterAttributes(BASIC_PRINTER_ATTRIBUTES);

      expect(response).toBeDefined();
      expect(response.version).toBeDefined();
      expect(response.statusCode).toBeDefined();
      expect(response.requestId).toBeDefined();
      expect('groups' in response || 'attributeGroups' in response).toBe(true);
    });

    it('should get printer attributes from real CUPS server', async () => {
      if (TEST_CONFIG.SKIP_IPP_REAL) {
        return;
      }

      const realCupsClient = createTestIppClient({
        url: TEST_CONFIG.CUPS_URL
      });

      const response = await realCupsClient.getPrinterAttributes(BASIC_PRINTER_ATTRIBUTES);

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
      
      await expect(invalidClient.getPrinterAttributes())
        .rejects
        .toThrow();
    });
  });
});
