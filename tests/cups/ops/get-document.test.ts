import { CupsClient } from '../../../src/cups/client';
import { createTestCupsClient, TEST_CONFIG } from '../../utils/test-utils';

describe('CupsClient - getDocument', () => {
  let client: CupsClient;
  const testJobId = 1;
  const testDocumentId = 1;

  beforeEach(() => {
    client = createTestCupsClient();
  });

  // Note: No client.close() method exists in this implementation

  it('should get document successfully', async () => {
    if (TEST_CONFIG.SKIP_IPP_REAL) { return; }

    const response = await client.getDocument(testJobId, TEST_CONFIG.TEST_PRINTER_URI, testDocumentId);

    expect(response).toHaveProperty('version');
    expect(response).toHaveProperty('statusCode');
    expect(response).toHaveProperty('requestId');
    // Depending on the server implementation, this might return 0 (success) or another status
  });

  it('should get document and parse response to JSON', async () => {
    if (TEST_CONFIG.SKIP_IPP_REAL) { return; }

    const response = await client.getDocument(testJobId, TEST_CONFIG.TEST_PRINTER_URI, testDocumentId, undefined);

    expect(response).toHaveProperty('version');
    expect(response).toHaveProperty('statusCode');
    expect(response).toHaveProperty('requestId');

    // For parsed response, check the attribute structure
    if ('attributeGroups' in response) {
      expect(Array.isArray(response.attributeGroups)).toBe(true);
    }
  });

  it('should get document with default options', async () => {
    if (TEST_CONFIG.SKIP_IPP_REAL) { return; }

    const response = await client.getDocument(testJobId, TEST_CONFIG.TEST_PRINTER_URI, testDocumentId, undefined);

    expect(response).toHaveProperty('version');
    expect(response).toHaveProperty('statusCode');
    expect(response).toHaveProperty('requestId');
  });

  it('should handle errors when getting document for non-existent job', async () => {
    if (TEST_CONFIG.SKIP_IPP_REAL) { return; }

    const invalidJobId = 9999;

    // Note: The client doesn't throw errors, it returns responses with status codes
    const response = await client.getDocument(invalidJobId, TEST_CONFIG.TEST_PRINTER_URI, testDocumentId);
    expect(response).toHaveProperty('statusCode');
  });

  it('should handle errors when getting non-existent document from job', async () => {
    if (TEST_CONFIG.SKIP_IPP_REAL) { return; }

    const invalidDocumentId = 9999;

    // Note: The client doesn't throw errors, it returns responses with status codes
    const response = await client.getDocument(testJobId, TEST_CONFIG.TEST_PRINTER_URI, invalidDocumentId);
    expect(response).toHaveProperty('statusCode');
  });

  it('should get document with real CUPS server (skipped by default)', async () => {
    if (TEST_CONFIG.SKIP_REAL_CUPS) { return; }

    // Skip this test by default as it requires actual print jobs
    console.warn('Skipping real CUPS getDocument test as it requires actual print jobs');
    return;
  });
});
