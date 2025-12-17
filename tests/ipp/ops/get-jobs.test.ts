import { IppClient } from '../../../src/ipp/client';
import { createTestIppClient, TEST_CONFIG } from '../../utils/test-utils';

describe('IPP Client - Get-Jobs', () => {
  let ippClient: IppClient;

  beforeEach(() => {
    ippClient = createTestIppClient();
  });

  describe('Node-IPP Server Tests', () => {
    it('should get jobs with default parameters from Node-IPP server', async () => {
      const response = await ippClient.getJobs('not-completed');

      expect(response).toBeDefined();
      expect(response.version).toBeDefined();
      expect(response.statusCode).toBeDefined();
      expect(response.requestId).toBeDefined();
      // Check if it has groups or attributeGroups depending on the response type
      expect('groups' in response || 'attributeGroups' in response).toBe(true);
    });

    it('should get raw jobs from Node-IPP server', async () => {
      const response = await ippClient.getJobs('not-completed');

      expect(response).toBeDefined();
      expect(response.version).toBeDefined();
      expect(response.statusCode).toBeDefined();
      expect(response.requestId).toBeDefined();
      // Check for jobAttributes in parsed response
    });

    it('should get completed jobs from Node-IPP server', async () => {
      const response = await ippClient.getJobs('completed');

      expect(response).toBeDefined();
      // Check if it has groups or attributeGroups depending on the response type
      expect('groups' in response || 'attributeGroups' in response).toBe(true);
    });

    it('should get all jobs from Node-IPP server', async () => {
      const response = await ippClient.getJobs('all');

      expect(response).toBeDefined();
      // Check if it has groups or attributeGroups depending on the response type
      expect('groups' in response || 'attributeGroups' in response).toBe(true);
    });
  });

  describe('Real CUPS Server Tests', () => {
    it('should get jobs from real CUPS server', async () => {
      if (TEST_CONFIG.SKIP_IPP_REAL) {
        return;
      }

      const realCupsClient = createTestIppClient({
        url: TEST_CONFIG.CUPS_URL
      });

      const response = await realCupsClient.getJobs('not-completed');

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

      await expect(slowClient.getJobs('not-completed')).rejects.toThrow();
    });
  });
});
