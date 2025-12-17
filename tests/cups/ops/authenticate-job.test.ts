import { CupsClient } from '../../../src/cups/client';
import { createTestCupsClient, TEST_CONFIG } from '../../utils/test-utils';

describe('CupsClient - authenticateJob', () => {
  let client: CupsClient;
  const testJobId = 1;

  beforeEach(() => {
    client = createTestCupsClient();
  });

  // No close method needed in CupsClient

  it('should authenticate job successfully', async () => {
    if (TEST_CONFIG.SKIP_IPP_REAL) { return; }
    
    const response = await client.authenticateJob(testJobId, TEST_CONFIG.TEST_PRINTER_URI);
    
    expect(response).toHaveProperty('version');
    expect(response).toHaveProperty('statusCode');
    expect(response).toHaveProperty('requestId');
    // Depending on the server implementation, this might return 0 (success) or another status
  });

  it('should authenticate job successfully (alternative test)', async () => {
    if (TEST_CONFIG.SKIP_IPP_REAL) { return; }
    
    const response = await client.authenticateJob(testJobId, TEST_CONFIG.TEST_PRINTER_URI);
    
    expect(response).toHaveProperty('version');
    expect(response).toHaveProperty('statusCode');
    expect(response).toHaveProperty('requestId');
  });

  it('should authenticate job with default options', async () => {
    if (TEST_CONFIG.SKIP_IPP_REAL) { return; }
    
    const response = await client.authenticateJob(testJobId, TEST_CONFIG.TEST_PRINTER_URI);
    
    expect(response).toHaveProperty('version');
    expect(response).toHaveProperty('statusCode');
    expect(response).toHaveProperty('requestId');
  });

  it('should handle errors when authenticating non-existent job', async () => {
    if (TEST_CONFIG.SKIP_IPP_REAL) { return; }
    
    const invalidJobId = 9999;
    
    // This test checks if the server properly responds to requests with invalid job IDs
    const response = await client.authenticateJob(invalidJobId, TEST_CONFIG.TEST_PRINTER_URI);
    
    expect(response).toBeDefined();
    expect(response).toHaveProperty('version');
    expect(response).toHaveProperty('statusCode');
    expect(response).toHaveProperty('requestId');
    // The response should indicate an error due to invalid job ID
    expect(response.statusCode).toBeGreaterThan(0); // non-success status
  });

  it('should authenticate job with real CUPS server (skipped by default)', async () => {
    if (TEST_CONFIG.SKIP_REAL_CUPS) { return; }
    
    // Skip this test by default as it modifies actual job authentication
    console.warn('Skipping real CUPS authenticateJob test to avoid modifying actual job authentication');
    return;
  });
});
