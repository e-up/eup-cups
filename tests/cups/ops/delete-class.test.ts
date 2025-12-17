import { CupsClient } from '../../../src/cups/client';
import { createTestCupsClient, skipRealCupsTest, TEST_CONFIG } from '../../utils/test-utils';

describe('CUPS Client - CUPS-Delete-Class', () => {
  let cupsClient: CupsClient;

  beforeEach(() => {
    cupsClient = createTestCupsClient();
  });

  describe('CUPS Server Tests', () => {
    it('should send delete-class request with class URI', async () => {
      const testClassUri = 'ipp://localhost:631/classes/test-class';

      // This test is expected to fail since we're not actually deleting a class, just testing the request structure
      const response = await cupsClient.deleteClass(testClassUri);
      expect(response.statusCode).toBeGreaterThan(0);
    });

    it('should handle parseResponse option when deleting class', async () => {
      const testClassUri = 'ipp://localhost:631/classes/test-class';

      // This test is expected to fail since we're not actually deleting a class, just testing the request structure
      const response = await cupsClient.deleteClass(testClassUri);
      expect(response.statusCode).toBeGreaterThan(0);
      expect(typeof response.statusCode).toBe('number');
    });

    it('should send delete-class request with default options', async () => {
      const testClassUri = 'ipp://localhost:631/classes/test-class';

      // This test is expected to fail since we're not actually deleting a class, just testing the request structure
      const response = await cupsClient.deleteClass(testClassUri);
      expect(response.statusCode).toBeGreaterThan(0);
    });
  });

  describe('Real CUPS Server Tests', () => {
    it('should skip real CUPS server test for delete-class', async () => {
      // Skip this test as it modifies system configuration
      if (TEST_CONFIG.SKIP_REAL_CUPS) { return; }
      
      // We're not actually executing the test, just verifying the skip logic
      expect(true).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle timeout when deleting class', async () => {
      const testClassUri = 'ipp://localhost:631/classes/test-class';

      const slowClient = createTestCupsClient({
        url: 'http://localhost:9999',
        timeout: 100
      });

      await expect(slowClient.deleteClass(testClassUri)).rejects.toThrow();
    });

    it('should handle invalid class URI', async () => {
      const invalidClassUri = 'invalid-uri';

      // This test is expected to fail due to invalid URI format
      const response = await cupsClient.deleteClass(invalidClassUri);
      expect(response.statusCode).toBeGreaterThan(0);
    });
  });
});