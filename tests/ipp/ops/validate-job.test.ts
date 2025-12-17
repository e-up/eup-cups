import { IppClient } from '../../../src/ipp/client';
import { createTestIppClient, TEST_CONFIG } from '../../utils/test-utils';

 describe('IPP Client - Validate-Job', () => {
  let ippClient: IppClient;

  beforeEach(() => {
    ippClient = createTestIppClient();
  });

  describe('Node-IPP Server Tests', () => {
    it('should validate job with basic attributes from Node-IPP server', async () => {
      const response = await ippClient.validateJob(undefined);

      expect(response).toBeDefined();
      expect(response.version).toBeDefined();
      expect(response.statusCode).toBeDefined();
      expect(response.requestId).toBeDefined();
      // Check if it has groups or attributeGroups depending on the response type
      expect('groups' in response || 'attributeGroups' in response).toBe(true);
    });

    it('should validate job with parsed response from Node-IPP server', async () => {
      const response = await ippClient.validateJob(undefined);

      expect(response).toBeDefined();
      expect(response.version).toBeDefined();
      expect(response.statusCode).toBeDefined();
      expect(response.requestId).toBeDefined();
      // Check for printerAttributes or jobAttributes in parsed response
    });

    it('should validate job with custom attributes from Node-IPP server', async () => {
      const attributes = [
        { tag: 'keyword', name: 'media', value: ['iso_a4_210x297mm'] },
        { tag: 'keyword', name: 'sides', value: ['one-sided'] }
      ];
      const response = await ippClient.validateJob(attributes);

      expect(response).toBeDefined();
      expect(response.version).toBeDefined();
      expect(response.statusCode).toBeDefined();
      expect(response.requestId).toBeDefined();
      expect('groups' in response || 'attributeGroups' in response).toBe(true);
    });
  });

  describe('Real CUPS Server Tests', () => {
    it('should validate job with basic attributes from real CUPS server', async () => {
      if (TEST_CONFIG.SKIP_IPP_REAL) {
        return;
      }

      const realCupsClient = createTestIppClient({
        url: TEST_CONFIG.CUPS_URL
      });

      const response = await realCupsClient.validateJob(undefined);

      expect(response).toBeDefined();
      expect(response.version).toBeDefined();
      expect(response.statusCode).toBeDefined();
      expect(response.requestId).toBeDefined();
      expect('groups' in response || 'attributeGroups' in response).toBe(true);
    });

    it('should validate job with parsed response from real CUPS server', async () => {
      if (TEST_CONFIG.SKIP_IPP_REAL) {
        return;
      }

      const realCupsClient = createTestIppClient({
        url: TEST_CONFIG.CUPS_URL
      });

      const response = await realCupsClient.validateJob(undefined);

      expect(response).toBeDefined();
      expect(response.version).toBeDefined();
      expect(response.statusCode).toBeDefined();
      expect(response.requestId).toBeDefined();
    });

    // Commented out due to real CUPS server configuration dependency
    // it('should validate job with custom attributes from real CUPS server', async () => {
    //   if (TEST_CONFIG.SKIP_IPP_REAL) {
    //     return;
    //   }

    //   const realCupsClient = createTestIppClient({
    //     url: TEST_CONFIG.CUPS_URL
    //   });

    //   const attributes = [
    //     { tag: 'keyword', name: 'copies', value: ['3'] }
    //   ];
    //   const response = await realCupsClient.validateJob(attributes);

    //   expect(response).toBeDefined();
    //   expect(response.version).toBeDefined();
    //   expect(response.statusCode).toBeDefined();
    //   expect(response.requestId).toBeDefined();
    //   expect('groups' in response || 'attributeGroups' in response).toBe(true);
    // });
  });

  describe('Error Handling', () => {
    it('should handle invalid configuration', async () => {
      // Create client with invalid URL to test error handling
      const invalidClient = createTestIppClient({
        url: 'http://non-existent-server:9999'
      });

      await expect(invalidClient.validateJob(undefined)).rejects.toThrow();
    });
  });
});