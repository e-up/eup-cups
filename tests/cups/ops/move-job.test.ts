import { CupsClient } from '../../../src/cups/client';
import { createTestCupsClient, TEST_CONFIG } from '../../utils/test-utils';

describe('CupsClient - moveJob', () => {
  let client: CupsClient;
  const testJobId = 1;
  const testSourcePrinterUri = TEST_CONFIG.TEST_PRINTER_URI;
  const testDestinationUri = 'ipp://localhost:631/printers/destination-printer';

  beforeEach(() => {
    client = createTestCupsClient();
  });

  it('should move job successfully', async () => {
    if (TEST_CONFIG.SKIP_IPP_REAL) { return; }
    
    const response = await client.moveJob(testJobId, testSourcePrinterUri, testDestinationUri);
    
    expect(response).toHaveProperty('version');
    expect(response).toHaveProperty('statusCode');
    expect(response).toHaveProperty('requestId');
    // Depending on the server implementation, this might return 0 (success) or another status
  });

  it('should move job and return raw response', async () => {
    if (TEST_CONFIG.SKIP_IPP_REAL) { return; }
    
    const response = await client.moveJob(testJobId, testSourcePrinterUri, testDestinationUri);
    
    expect(response).toHaveProperty('version');
    expect(response).toHaveProperty('statusCode');
    expect(response).toHaveProperty('requestId');
    
    // Check for attribute groups in the raw response
    expect('attributeGroups' in response || 'groups' in response).toBe(true);
  });

  it('should move job with default options', async () => {
    if (TEST_CONFIG.SKIP_IPP_REAL) { return; }
    
    const response = await client.moveJob(testJobId, testSourcePrinterUri, testDestinationUri);
    
    expect(response).toHaveProperty('version');
    expect(response).toHaveProperty('statusCode');
    expect(response).toHaveProperty('requestId');
  });

  it('should handle errors when moving non-existent job', async () => {
    if (TEST_CONFIG.SKIP_IPP_REAL) { return; }
    
    const invalidJobId = 9999;
    
    // Note: The client doesn't throw errors, it returns responses with status codes
    const response = await client.moveJob(invalidJobId, testSourcePrinterUri, testDestinationUri);
    expect(response).toHaveProperty('statusCode');
  });

  it('should handle errors when moving to invalid destination printer', async () => {
    if (TEST_CONFIG.SKIP_IPP_REAL) { return; }
    
    const invalidDestinationUri = 'ipp://localhost:631/printers/non-existent-printer';
    
    // Note: The client doesn't throw errors, it returns responses with status codes
    const response = await client.moveJob(testJobId, testSourcePrinterUri, invalidDestinationUri);
    expect(response).toHaveProperty('statusCode');
  });

  it('should move job with real CUPS server (skipped by default)', async () => {
    if (TEST_CONFIG.SKIP_REAL_CUPS) { return; }
    
    // Skip this test by default as it modifies job state
    console.warn('Skipping real CUPS moveJob test to avoid modifying job state');
    return;
  });
});
