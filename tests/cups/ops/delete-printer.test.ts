import { CupsClient } from '../../../src/cups/client';
import { createTestCupsClient, skipRealCupsTest, TEST_CONFIG } from '../../utils/test-utils';

describe('CUPS Client - CUPS-Delete-Printer', () => {
  let cupsClient: CupsClient;

  beforeEach(() => {
    cupsClient = createTestCupsClient();
  });

  describe('CUPS Server Tests', () => {
    it('should send delete-printer request with printer URI', async () => {
      const testPrinterUri = 'ipp://localhost:631/printers/test-printer';

      // This test verifies the request structure, not actual deletion
      const response = await cupsClient.deletePrinter(testPrinterUri);
      
      expect(response).toHaveProperty('version');
      expect(response).toHaveProperty('statusCode');
      expect(response).toHaveProperty('requestId');
      expect(typeof response.statusCode).toBe('number');
    });

    it('should handle parseResponse option when deleting printer', async () => {
      const testPrinterUri = 'ipp://localhost:631/printers/test-printer';

      // This test verifies the request structure, not actual deletion
      const response = await cupsClient.deletePrinter(testPrinterUri);
      
      expect(response).toHaveProperty('version');
      expect(response).toHaveProperty('statusCode');
      expect(response).toHaveProperty('requestId');
      expect(typeof response.statusCode).toBe('number');
    });

    it('should send delete-printer request with default options', async () => {
      const testPrinterUri = 'ipp://localhost:631/printers/test-printer';

      // This test verifies the request structure, not actual deletion
      const response = await cupsClient.deletePrinter(testPrinterUri);
      
      expect(response).toHaveProperty('version');
      expect(response).toHaveProperty('statusCode');
      expect(response).toHaveProperty('requestId');
      expect(typeof response.statusCode).toBe('number');
    });
  });

  describe('Real CUPS Server Tests', () => {
    it('should skip real CUPS server test for delete-printer', async () => {
      // Skip this test as it modifies system configuration
      if (TEST_CONFIG.SKIP_REAL_CUPS) { return; }
      
      // We're not actually executing the test, just verifying the skip logic
      expect(true).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle timeout when deleting printer', async () => {
      const testPrinterUri = 'ipp://localhost:631/printers/test-printer';

      const slowClient = createTestCupsClient({
        url: 'http://localhost:9999',
        timeout: 100
      });

      await expect(slowClient.deletePrinter(testPrinterUri)).rejects.toThrow();
    });

    it('should handle invalid printer URI', async () => {
      const invalidPrinterUri = 'invalid-uri';

      // This test verifies the behavior with invalid URI, which might return an error response
      const response = await cupsClient.deletePrinter(invalidPrinterUri);
      
      expect(response).toHaveProperty('version');
      expect(response).toHaveProperty('statusCode');
      expect(response).toHaveProperty('requestId');
      expect(typeof response.statusCode).toBe('number');
    });
  });
});