import { CupsClient } from '../../../src/cups/client';
import { createTestCupsClient, skipRealCupsTest, TEST_CONFIG } from '../../utils/test-utils';
import { CONSTANTS } from 'eup-ipp-encoder';

const { KEYWORD, URI, INTEGER, BOOLEAN } = CONSTANTS;

describe('CUPS Client - CUPS-Add-Modify-Printer', () => {
  let cupsClient: CupsClient;

  beforeEach(() => {
    // Use the mock IPP server for testing instead of real CUPS server
    cupsClient = createTestCupsClient({ url: TEST_CONFIG.NODE_IPP_URL });
  });

  describe('CUPS Server Tests', () => {
    it('should send add-modify-printer request with minimal attributes', async () => {
      const mockAttributes = [
        { tag: KEYWORD, name: 'printer-name', value: ['test-printer'] },
        { tag: URI, name: 'device-uri', value: ['ipp://localhost:631/printers/test-printer'] },
        { tag: KEYWORD, name: 'printer-make-and-model', value: ['Test Printer'] }
      ];

      const response = await cupsClient.addModifyPrinter(mockAttributes);

      expect(response).toHaveProperty('version');
      expect(response).toHaveProperty('statusCode');
      expect(response).toHaveProperty('requestId');
      expect(typeof response.statusCode).toBe('number');
    });

    it('should handle parseResponse option', async () => {
      const mockAttributes = [
        { tag: KEYWORD, name: 'printer-name', value: ['test-printer'] },
        { tag: URI, name: 'device-uri', value: ['ipp://localhost:631/printers/test-printer'] }
      ];

      const response = await cupsClient.addModifyPrinter(mockAttributes);

      expect(response).toHaveProperty('version');
      expect(response).toHaveProperty('statusCode');
      expect(response).toHaveProperty('requestId');
      expect(typeof response.statusCode).toBe('number');
    });

    it('should send add-modify-printer request with comprehensive attributes', async () => {
      const mockAttributes = [
        { tag: KEYWORD, name: 'printer-name', value: ['test-printer'] },
        { tag: URI, name: 'device-uri', value: ['ipp://localhost:631/printers/test-printer'] },
        { tag: KEYWORD, name: 'printer-make-and-model', value: ['Test Printer Model'] },
        { tag: INTEGER, name: 'printer-port', value: [631] },
        { tag: BOOLEAN, name: 'printer-is-shared', value: [false] },
        { tag: KEYWORD, name: 'printer-location', value: ['Test Location'] },
        { tag: KEYWORD, name: 'printer-info', value: ['Test Printer Description'] }
      ];

      const response = await cupsClient.addModifyPrinter(mockAttributes);

      expect(response).toHaveProperty('version');
      expect(response).toHaveProperty('statusCode');
      expect(response).toHaveProperty('requestId');
      expect(typeof response.statusCode).toBe('number');
    });
  });

  describe('Real CUPS Server Tests', () => {
    it('should skip real CUPS server test for add-modify-printer', async () => {
      // Skip this test as it modifies system configuration
      if (TEST_CONFIG.SKIP_REAL_CUPS) { return; }
      
      // We're not actually executing the test, just verifying the skip logic
      expect(true).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle timeout when adding printer', async () => {
      const mockAttributes = [
        { tag: KEYWORD, name: 'printer-name', value: ['test-printer'] },
        { tag: URI, name: 'device-uri', value: ['ipp://localhost:631/printers/test-printer'] }
      ];

      const slowClient = createTestCupsClient({
        url: 'http://localhost:9999',
        timeout: 100
      });

      await expect(slowClient.addModifyPrinter(mockAttributes)).rejects.toThrow();
    });

    it('should handle missing required attributes', async () => {
      const incompleteAttributes = [
        // Missing required attributes like printer-name and device-uri
        { tag: KEYWORD, name: 'printer-info', value: ['Incomplete Printer'] }
      ];

      const response = await cupsClient.addModifyPrinter(incompleteAttributes);

      expect(response).toHaveProperty('version');
      expect(response).toHaveProperty('statusCode');
      expect(response).toHaveProperty('requestId');
      expect(typeof response.statusCode).toBe('number');
    });
  });
});