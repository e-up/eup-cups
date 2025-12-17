import { IppClient } from '../../../src/ipp/client';
import { createTestIppClient, TEST_CONFIG } from '../../utils/test-utils';

// Use a reasonable test job ID and document URI
const TEST_JOB_ID = 1;
const TEST_DOCUMENT_URI = 'http://example.com/test-document.txt';

describe('IPP Client - Send-URI', () => {
  let ippClient: IppClient;

  beforeEach(() => {
    ippClient = createTestIppClient();
  });

  describe('Node-IPP Server Tests', () => {
    it('should send URI with basic attributes from Node-IPP server', async () => {
      const response = await ippClient.sendURI(TEST_JOB_ID, TEST_DOCUMENT_URI, true, undefined);

      expect(response).toBeDefined();
      expect(response.version).toBeDefined();
      expect(response.statusCode).toBeDefined();
      expect(response.requestId).toBeDefined();
      // Check if it has groups or attributeGroups depending on the response type
      expect('groups' in response || 'attributeGroups' in response).toBe(true);
    });

    it('should send URI from Node-IPP server', async () => {
      const response = await ippClient.sendURI(TEST_JOB_ID, TEST_DOCUMENT_URI, true, undefined);

      expect(response).toBeDefined();
      expect(response.version).toBeDefined();
      expect(response.statusCode).toBeDefined();
      expect(response.requestId).toBeDefined();
    });

    it('should send URI as last document from Node-IPP server', async () => {
      const response = await ippClient.sendURI(TEST_JOB_ID, TEST_DOCUMENT_URI, true, undefined);

      expect(response).toBeDefined();
      expect(response.version).toBeDefined();
      expect(response.statusCode).toBeDefined();
      expect(response.requestId).toBeDefined();
      expect('groups' in response || 'attributeGroups' in response).toBe(true);
    });

    it('should send URI as intermediate document from Node-IPP server', async () => {
      const response = await ippClient.sendURI(TEST_JOB_ID, TEST_DOCUMENT_URI, false, undefined);

      expect(response).toBeDefined();
      expect(response.version).toBeDefined();
      expect(response.statusCode).toBeDefined();
      expect(response.requestId).toBeDefined();
      expect('groups' in response || 'attributeGroups' in response).toBe(true);
    });

    it('should send URI with custom attributes from Node-IPP server', async () => {
      const attributes = [
        { tag: 'keyword', name: 'document-format', value: ['text/plain'] }
      ];
      const response = await ippClient.sendURI(TEST_JOB_ID, TEST_DOCUMENT_URI, true, attributes);

      expect(response).toBeDefined();
      expect(response.version).toBeDefined();
      expect(response.statusCode).toBeDefined();
      expect(response.requestId).toBeDefined();
      expect('groups' in response || 'attributeGroups' in response).toBe(true);
    });
  });

  describe('Real CUPS Server Tests', () => {
    it('should send URI with basic attributes from real CUPS server', async () => {
      if (TEST_CONFIG.SKIP_IPP_REAL) {
        return;
      }

      const realCupsClient = createTestIppClient({
        url: TEST_CONFIG.CUPS_URL
      });

      const response = await realCupsClient.sendURI(TEST_JOB_ID, TEST_DOCUMENT_URI, true, undefined);

      expect(response).toBeDefined();
      expect(response.version).toBeDefined();
      expect(response.statusCode).toBeDefined();
      expect(response.requestId).toBeDefined();
      expect('groups' in response || 'attributeGroups' in response).toBe(true);
    });

    it('should send URI from real CUPS server', async () => {
      if (TEST_CONFIG.SKIP_IPP_REAL) {
        return;
      }

      const realCupsClient = createTestIppClient({
        url: TEST_CONFIG.CUPS_URL
      });

      const response = await realCupsClient.sendURI(TEST_JOB_ID, TEST_DOCUMENT_URI, true, undefined);

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

      await expect(invalidClient.sendURI(TEST_JOB_ID, TEST_DOCUMENT_URI, true, undefined)).rejects.toThrow();
    });

    it('should handle invalid document URI', async () => {
      // Node-IPP server returns an error response instead of throwing, so check the status code
      const response = await ippClient.sendURI(TEST_JOB_ID, 'invalid-uri', true, undefined);

      expect(response).toBeDefined();
      expect(response.statusCode).toBeDefined();
      // Check that it's an error status code
      expect(response.statusCode).toBeGreaterThanOrEqual(1000);
    });
  });
});