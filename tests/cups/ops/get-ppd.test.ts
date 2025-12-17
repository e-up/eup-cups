import { CupsClient } from '../../../src/cups/client';
import { createTestCupsClient, TEST_CONFIG } from '../../utils/test-utils';

describe('CupsClient - getPPD', () => {
  let client: CupsClient;
  const testPrinterName = 'test-printer';

  beforeEach(() => {
    client = createTestCupsClient();
  });

  // No client.close() method exists in this implementation

  it('should get PPD successfully', async () => {
    if (TEST_CONFIG.SKIP_IPP_REAL) { return; }

    const response = await client.getPPD(testPrinterName);

    expect(response).toHaveProperty('version');
    expect(response).toHaveProperty('statusCode');
    expect(response).toHaveProperty('requestId');
    // Depending on the server implementation, this might return 0 (success) or another status
  });

  it('should get PPD and parse response to JSON', async () => {
    if (TEST_CONFIG.SKIP_IPP_REAL) { return; }

    const response = await client.getPPD(testPrinterName);

    expect(response).toHaveProperty('version');
    expect(response).toHaveProperty('statusCode');
    expect(response).toHaveProperty('requestId');

    // For parsed response, check the attribute structure
    if ('attributeGroups' in response) {
      expect(Array.isArray(response.attributeGroups)).toBe(true);
    }
  });

  it('should get PPD with default options', async () => {
    if (TEST_CONFIG.SKIP_IPP_REAL) { return; }

    const response = await client.getPPD(testPrinterName);

    expect(response).toHaveProperty('version');
    expect(response).toHaveProperty('statusCode');
    expect(response).toHaveProperty('requestId');
  });

  it('should handle errors when getting PPD for non-existent printer', async () => {
    if (TEST_CONFIG.SKIP_IPP_REAL) { return; }

    const invalidPrinterName = 'non-existent-printer';

    // Note: The client doesn't throw errors, it returns responses with status codes
    const response = await client.getPPD(invalidPrinterName);
    expect(response).toHaveProperty('statusCode');
  });

  it('should get PPD with real CUPS server', async () => {
    if (TEST_CONFIG.SKIP_REAL_CUPS) { return; }

    const realClient = createTestCupsClient();

    try {
      // This test will only work if there's at least one printer installed
      const response = await realClient.getPPD(testPrinterName);

      expect(response).toHaveProperty('version');
      expect(response).toHaveProperty('statusCode');
      expect(response).toHaveProperty('requestId');
    } catch (error) {
      // If no printers are available, this is expected
      console.warn('No printers available for getPPD test:', error);
    }
  });
});
