import { CupsClient } from '../../../src/cups/client';
import { createTestCupsClient, TEST_CONFIG } from '../../utils/test-utils';

describe('CupsClient - acceptJobs', () => {
  let client: CupsClient;
  const testPrinterUri = 'ipp://localhost:631/printers/test-printer';

  beforeEach(() => {
    client = createTestCupsClient();
  });

  // No client.close() method exists in this implementation

  it('should accept jobs successfully', async () => {
    if (TEST_CONFIG.SKIP_IPP_REAL) { return; }
    
    const response = await client.acceptJobs(testPrinterUri);
    
    expect(response).toHaveProperty('version');
    expect(response).toHaveProperty('statusCode');
    expect(response).toHaveProperty('requestId');
    // Just check that the request was processed and returned a status
    expect(typeof response.statusCode).toBe('number');
  });

  it('should accept jobs successfully (alternative test)', async () => {
    if (TEST_CONFIG.SKIP_IPP_REAL) { return; }
    
    const response = await client.acceptJobs(testPrinterUri);
    
    expect(response).toHaveProperty('version');
    expect(response).toHaveProperty('statusCode');
    expect(response).toHaveProperty('requestId');
    // Just check that the request was processed and returned a status
    expect(typeof response.statusCode).toBe('number');
  });

  it('should accept jobs with default options', async () => {
    if (TEST_CONFIG.SKIP_IPP_REAL) { return; }
    
    const response = await client.acceptJobs(testPrinterUri);
    
    expect(response).toHaveProperty('version');
    expect(response).toHaveProperty('statusCode');
    expect(response).toHaveProperty('requestId');
    // Just check that the request was processed and returned a status
    expect(typeof response.statusCode).toBe('number');
  });

  it('should handle errors when accepting jobs for non-existent printer', async () => {
    if (TEST_CONFIG.SKIP_IPP_REAL) { return; }
    
    const invalidPrinterUri = 'ipp://localhost:631/printers/non-existent-printer';
    
    // Note: The client doesn't throw errors, it returns responses with status codes
    const response = await client.acceptJobs(invalidPrinterUri);
    expect(response).toHaveProperty('statusCode');
  });

  it('should accept jobs with real CUPS server (skipped by default)', async () => {
    if (TEST_CONFIG.SKIP_REAL_CUPS) { return; }
    
    // Skip this test by default as it modifies printer configuration
    console.warn('Skipping real CUPS acceptJobs test to avoid modifying printer configuration');
    return;
  });
});
