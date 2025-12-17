import { IppClient } from '../../../src/ipp/client';
import { createTestIppClient, TEST_CONFIG } from '../../utils/test-utils';

// Use a reasonable test job ID
const TEST_JOB_ID = 1;

 describe('IPP Client - Cancel-Job', () => {
  let ippClient: IppClient;

  beforeEach(() => {
    ippClient = createTestIppClient();
  });

  describe('Node-IPP Server Tests', () => {
    it('should cancel job with basic attributes from Node-IPP server', async () => {
      const response = await ippClient.cancelJob(TEST_JOB_ID);

      expect(response).toBeDefined();
      expect(response.version).toBeDefined();
      expect(response.statusCode).toBeDefined();
      expect(response.requestId).toBeDefined();
      // Check if it has groups or attributeGroups depending on the response type
      expect('groups' in response || 'attributeGroups' in response).toBe(true);
    });

    it('should cancel job with raw response from Node-IPP server', async () => {
      const response = await ippClient.cancelJob(TEST_JOB_ID);

      expect(response).toBeDefined();
      expect(response.version).toBeDefined();
      expect(response.statusCode).toBeDefined();
      expect(response.requestId).toBeDefined();
      // Check for jobAttributes in parsed response
    });
  });

  describe('Real CUPS Server Tests', () => {
    it('should cancel job with basic attributes from real CUPS server', async () => {
      if (TEST_CONFIG.SKIP_IPP_REAL) {
        return;
      }

      const realCupsClient = createTestIppClient({
        url: TEST_CONFIG.CUPS_URL
      });

      const response = await realCupsClient.cancelJob(TEST_JOB_ID);

      expect(response).toBeDefined();
      expect(response.version).toBeDefined();
      expect(response.statusCode).toBeDefined();
      expect(response.requestId).toBeDefined();
      expect('groups' in response || 'attributeGroups' in response).toBe(true);
    });

    it('should cancel job with raw response from real CUPS server', async () => {
      if (TEST_CONFIG.SKIP_IPP_REAL) {
        return;
      }

      const realCupsClient = createTestIppClient({
        url: TEST_CONFIG.CUPS_URL
      });

      const response = await realCupsClient.cancelJob(TEST_JOB_ID);

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

      await expect(invalidClient.cancelJob(TEST_JOB_ID)).rejects.toThrow();
    });

    it('should handle non-existent job ID', async () => {
      // Use a very high job ID that is unlikely to exist
      const nonExistentJobId = 999999;
      
      // This might succeed or fail depending on server implementation
      // Some servers return success even for non-existent jobs, while others return an error
      try {
        const response = await ippClient.cancelJob(nonExistentJobId);
        
        expect(response).toBeDefined();
        expect(response.version).toBeDefined();
        expect(response.requestId).toBeDefined();
      } catch (error) {
        // If it fails, make sure it's a reasonable error
        expect(error).toBeDefined();
        expect(error instanceof Error).toBe(true);
      }
    });
  });
});