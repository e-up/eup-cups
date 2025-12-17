import { IppClient } from '../../../src/ipp/client';
import { createTestIppClient, TEST_CONFIG } from '../../utils/test-utils';

const TEST_DOCUMENT_URI = 'http://example.com/test.txt';

 describe('IPP Client - Print-URI', () => {
  let ippClient: IppClient;

  beforeEach(() => {
    ippClient = createTestIppClient();
  });

  describe('Node-IPP Server Tests', () => {
    it('should print URI with basic attributes from Node-IPP server', async () => {
      const response = await ippClient.printURI('Test URI Job', TEST_DOCUMENT_URI, undefined);

      expect(response).toBeDefined();
      expect(response.version).toBeDefined();
      expect(response.statusCode).toBeDefined();
      expect(response.requestId).toBeDefined();
      // Check if it has groups or attributeGroups depending on the response type
      expect('groups' in response || 'attributeGroups' in response).toBe(true);
    });

    it('should print URI from Node-IPP server', async () => {
      const response = await ippClient.printURI('Test URI Job', TEST_DOCUMENT_URI, undefined);

      expect(response).toBeDefined();
      expect(response.version).toBeDefined();
      expect(response.statusCode).toBeDefined();
      expect(response.requestId).toBeDefined();
    });

    it('should print URI with custom attributes from Node-IPP server', async () => {
      const attributes = [
        { tag: 'keyword', name: 'copies', value: ['2'] }
      ];
      const response = await ippClient.printURI('Test URI Job with Copies', TEST_DOCUMENT_URI, attributes);

      expect(response).toBeDefined();
      expect(response.version).toBeDefined();
      expect(response.statusCode).toBeDefined();
      expect(response.requestId).toBeDefined();
      expect('groups' in response || 'attributeGroups' in response).toBe(true);
    });
  });

  describe('Real CUPS Server Tests', () => {
    it('should print URI with basic attributes from real CUPS server', async () => {
      if (TEST_CONFIG.SKIP_IPP_REAL) {
        return;
      }

      const realCupsClient = createTestIppClient({
        url: TEST_CONFIG.CUPS_URL
      });

      const response = await realCupsClient.printURI('Test URI Job', TEST_DOCUMENT_URI, undefined);

      expect(response).toBeDefined();
      expect(response.version).toBeDefined();
      expect(response.statusCode).toBeDefined();
      expect(response.requestId).toBeDefined();
      expect('groups' in response || 'attributeGroups' in response).toBe(true);
    });

    it('should print URI from real CUPS server', async () => {
      if (TEST_CONFIG.SKIP_IPP_REAL) {
        return;
      }

      const realCupsClient = createTestIppClient({
        url: TEST_CONFIG.CUPS_URL
      });

      const response = await realCupsClient.printURI('Test URI Job', TEST_DOCUMENT_URI, undefined);

      expect(response).toBeDefined();
      expect(response.version).toBeDefined();
      expect(response.statusCode).toBeDefined();
      expect(response.requestId).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid document URI', async () => {
      // Node-IPP server returns an error response instead of throwing, so check the status code
      const response = await ippClient.printURI('Invalid URI Job', 'invalid-uri', undefined);
      
      expect(response).toBeDefined();
      expect(response.statusCode).toBeDefined();
      // Check that it's an error status code
      expect(response.statusCode).toBeGreaterThanOrEqual(1000);
    });
  });
});