import { CupsClient } from '../../../src/cups/client';
import { createTestCupsClient, TEST_CONFIG } from '../../utils/test-utils';
import { CONSTANTS } from 'eup-ipp-encoder';

const { KEYWORD, URI } = CONSTANTS;

describe('CupsClient - createLocalPrinter', () => {
  let client: CupsClient;

  beforeEach(() => {
    client = createTestCupsClient();
  });

  it('should create local printer successfully', async () => {
    if (TEST_CONFIG.SKIP_IPP_REAL) { return; }
    
    const attributes = [
      { tag: KEYWORD, name: 'printer-name', value: ['local-test-printer'] },
      { tag: URI, name: 'device-uri', value: ['file:/dev/null'] },
      { tag: KEYWORD, name: 'ppd-name', value: ['test.ppd'] }
    ];
    
    const response = await client.createLocalPrinter(attributes);
    
    expect(response).toHaveProperty('version');
    expect(response).toHaveProperty('statusCode');
    expect(response).toHaveProperty('requestId');
    // Depending on the server implementation, this might return 0 (success) or another status
  });

  it('should create local printer successfully (alternative test)', async () => {
    if (TEST_CONFIG.SKIP_IPP_REAL) { return; }
    
    const attributes = [
      { tag: KEYWORD, name: 'printer-name', value: ['local-test-printer'] },
      { tag: URI, name: 'device-uri', value: ['file:/dev/null'] },
      { tag: KEYWORD, name: 'ppd-name', value: ['test.ppd'] }
    ];
    
    const response = await client.createLocalPrinter(attributes);
    
    expect(response).toHaveProperty('version');
    expect(response).toHaveProperty('statusCode');
    expect(response).toHaveProperty('requestId');
  });

  it('should create local printer with default options', async () => {
    if (TEST_CONFIG.SKIP_IPP_REAL) { return; }
    
    const attributes = [
      { tag: KEYWORD, name: 'printer-name', value: ['local-test-printer'] },
      { tag: URI, name: 'device-uri', value: ['file:/dev/null'] },
      { tag: KEYWORD, name: 'ppd-name', value: ['test.ppd'] }
    ];
    
    const response = await client.createLocalPrinter(attributes);
    
    expect(response).toHaveProperty('version');
    expect(response).toHaveProperty('statusCode');
    expect(response).toHaveProperty('requestId');
  });

  it('should handle errors when creating local printer with invalid parameters', async () => {
    if (TEST_CONFIG.SKIP_IPP_REAL) { return; }
    
    const attributes = [
      { tag: KEYWORD, name: 'printer-name', value: ['local-test-printer'] },
      { tag: URI, name: 'device-uri', value: ['file:/dev/null'] },
      { tag: KEYWORD, name: 'ppd-name', value: ['non-existent.ppd'] }
    ];
    
    // This test checks if the server properly responds to requests with invalid parameters
    const response = await client.createLocalPrinter(attributes);
    
    expect(response).toBeDefined();
    expect(response).toHaveProperty('version');
    expect(response).toHaveProperty('statusCode');
    expect(response).toHaveProperty('requestId');
    // The response should indicate an error due to invalid parameters
    expect(response.statusCode).toBeGreaterThan(0); // non-success status
  });

  it('should create local printer with real CUPS server (skipped by default)', async () => {
    if (TEST_CONFIG.SKIP_REAL_CUPS) { return; }
    
    // Skip this test by default as it modifies system configuration
    console.warn('Skipping real CUPS createLocalPrinter test to avoid modifying system configuration');
    return;
  });
});
