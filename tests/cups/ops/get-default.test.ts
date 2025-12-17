import { CupsClient } from '../../../src/cups/client';
import { createTestCupsClient, skipRealCupsTest, TEST_CONFIG } from '../../utils/test-utils';

describe('CUPS Client - CUPS-Get-Default', () => {
  let cupsClient: CupsClient;

  beforeEach(() => {
    cupsClient = createTestCupsClient();
  });

  describe('CUPS Server Tests', () => {
    it('should get default printer with default attributes', async () => {
      const response = await cupsClient.getDefaultPrinter(undefined);

      expect(response).toBeDefined();
      expect(response.version).toBeDefined();
      expect(response.statusCode).toBeDefined();
      expect(response.requestId).toBeDefined();
      expect('groups' in response || 'attributeGroups' in response).toBe(true);
    });

    it('should get default printer with default attributes', async () => {
      const response = await cupsClient.getDefaultPrinter(undefined);

      expect(response).toBeDefined();
      expect(response.version).toBeDefined();
      expect(response.statusCode).toBeDefined();
      expect(response.requestId).toBeDefined();
    });

    it('should get default printer with specific attributes', async () => {
      const response = await cupsClient.getDefaultPrinter(['printer-name', 'printer-uri-supported', 'printer-state']);

      expect(response).toBeDefined();
      expect('groups' in response || 'attributeGroups' in response).toBe(true);
    });
  });

  describe('Real CUPS Server Tests', () => {
    it('should get default printer from real CUPS server', async () => {
      if (TEST_CONFIG.SKIP_REAL_CUPS) { return; }
      const response = await cupsClient.getDefaultPrinter(undefined);

      expect(response).toBeDefined();
      expect(response.version).toBeDefined();
      expect(response.statusCode).toBeDefined();
      expect(response.requestId).toBeDefined();
      expect('groups' in response || 'attributeGroups' in response).toBe(true);
    });

    it('should get default printer with specific attributes from real CUPS server', async () => {
      if (TEST_CONFIG.SKIP_REAL_CUPS) { return; }
      const response = await cupsClient.getDefaultPrinter(['printer-name', 'printer-uri-supported']);

      expect(response).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle timeout', async () => {
      const slowClient = createTestCupsClient({
        url: 'http://localhost:9999',
        timeout: 100
      });

      await expect(slowClient.getDefaultPrinter(undefined)).rejects.toThrow();
    });
  });
});
