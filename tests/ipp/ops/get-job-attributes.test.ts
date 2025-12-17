import { IppClient } from '../../../src/ipp/client';
import { createTestIppClient, TEST_CONFIG } from '../../utils/test-utils';

// Use a reasonable test job ID
const TEST_JOB_ID = 1;

// Test attributes to request
const TEST_ATTRIBUTES = ['job-id', 'job-name', 'job-state'];

describe('IPP Client - Get-Job-Attributes', () => {
  let ippClient: IppClient;

  beforeEach(() => {
    ippClient = createTestIppClient();
  });

  describe('Node-IPP Server Tests', () => {
    it('should get job attributes with basic parameters from Node-IPP server', async () => {
      const response = await ippClient.getJobAttributes(TEST_JOB_ID, undefined);

      expect(response).toBeDefined();
      expect(response.version).toBeDefined();
      expect(response.statusCode).toBeDefined();
      expect(response.requestId).toBeDefined();
      // Check if it has groups or attributeGroups depending on the response type
      expect('groups' in response || 'attributeGroups' in response).toBe(true);
    });

    it('should get job attributes with specific requested attributes from Node-IPP server', async () => {
      const response = await ippClient.getJobAttributes(TEST_JOB_ID, TEST_ATTRIBUTES);

      expect(response).toBeDefined();
      expect(response.version).toBeDefined();
      expect(response.statusCode).toBeDefined();
      expect(response.requestId).toBeDefined();
      expect('groups' in response || 'attributeGroups' in response).toBe(true);
    });

    it('should get job attributes with raw response from Node-IPP server', async () => {
      const response = await ippClient.getJobAttributes(TEST_JOB_ID, undefined);

      expect(response).toBeDefined();
      expect(response.version).toBeDefined();
      expect(response.statusCode).toBeDefined();
      expect(response.requestId).toBeDefined();
      // Check for jobAttributes in parsed response
    });

    it('should get job attributes with specific attributes and raw response from Node-IPP server', async () => {
      const response = await ippClient.getJobAttributes(TEST_JOB_ID, TEST_ATTRIBUTES);

      expect(response).toBeDefined();
      expect(response.version).toBeDefined();
      expect(response.statusCode).toBeDefined();
      expect(response.requestId).toBeDefined();
    });
  });

  describe('Real CUPS Server Tests', () => {
    it('should get job attributes with basic parameters from real CUPS server', async () => {
      if (TEST_CONFIG.SKIP_IPP_REAL) {
        return;
      }

      const realCupsClient = createTestIppClient({
        url: TEST_CONFIG.CUPS_URL
      });

      const response = await realCupsClient.getJobAttributes(TEST_JOB_ID, undefined);

      expect(response).toBeDefined();
      expect(response.version).toBeDefined();
      expect(response.statusCode).toBeDefined();
      expect(response.requestId).toBeDefined();
      expect('groups' in response || 'attributeGroups' in response).toBe(true);
    });

    it('should get job attributes with raw response from real CUPS server', async () => {
      if (TEST_CONFIG.SKIP_IPP_REAL) {
        return;
      }

      const realCupsClient = createTestIppClient({
        url: TEST_CONFIG.CUPS_URL
      });

      const response = await realCupsClient.getJobAttributes(TEST_JOB_ID, undefined);

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

      await expect(invalidClient.getJobAttributes(TEST_JOB_ID, undefined)).rejects.toThrow();
    });

    it('should handle non-existent job ID', async () => {
      // Use a very high job ID that is unlikely to exist
      const nonExistentJobId = 999999;
      
      // This might succeed or fail depending on server implementation
      // Some servers return success with minimal attributes, while others return an error
      try {
        const response = await ippClient.getJobAttributes(nonExistentJobId, undefined);
        
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
