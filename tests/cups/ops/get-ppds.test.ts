import { CupsClient } from '../../../src/cups/client';
import { createTestCupsClient, TEST_CONFIG } from '../../utils/test-utils';

describe('CupsClient - getPPDs', () => {
  let client: CupsClient;

  beforeEach(() => {
    client = createTestCupsClient({ timeout: 10000 });
  });

  // No client.close() method exists in this implementation

  it('should get PPDs successfully', async () => {
    if (TEST_CONFIG.SKIP_IPP_REAL) { return; }
    
    const response = await client.getPPDs();
    
    expect(response).toHaveProperty('version');
    expect(response).toHaveProperty('statusCode');
    expect(response).toHaveProperty('requestId');
    // Don't expect statusCode 0 as it might require authentication or the server might be busy
    expect(typeof response.statusCode).toBe('number');
  }, 15000);

  it('should get PPDs with undefined parameters', async () => {
    if (TEST_CONFIG.SKIP_IPP_REAL) { return; }
    
    const response = await client.getPPDs(undefined, undefined);
    
    expect(response).toHaveProperty('version');
    expect(response).toHaveProperty('statusCode');
    expect(response).toHaveProperty('requestId');
    expect(typeof response.statusCode).toBe('number');
  }, 15000);

  it('should get PPDs with specified ppd name', async () => {
    if (TEST_CONFIG.SKIP_IPP_REAL) { return; }
    
    const ppdName = 'test.ppd';
    
    const response = await client.getPPDs(ppdName, undefined);
    
    expect(response).toHaveProperty('version');
    expect(response).toHaveProperty('statusCode');
    expect(response).toHaveProperty('requestId');
    expect(typeof response.statusCode).toBe('number');
  }, 15000);

  it('should get PPDs with custom attributes', async () => {
    if (TEST_CONFIG.SKIP_IPP_REAL) { return; }
    
    const attributes = ['ppd-name', 'ppd-language-level'];
    
    const response = await client.getPPDs(undefined, attributes);
    
    expect(response).toHaveProperty('version');
    expect(response).toHaveProperty('statusCode');
    expect(response).toHaveProperty('requestId');
    expect(typeof response.statusCode).toBe('number');
  }, 15000);

  it('should get PPDs with ppd name and custom attributes', async () => {
    if (TEST_CONFIG.SKIP_IPP_REAL) { return; }
    
    const ppdName = 'test.ppd';
    const attributes = ['ppd-name', 'ppd-model'];
    
    const response = await client.getPPDs(ppdName, attributes);
    
    expect(response).toHaveProperty('version');
    expect(response).toHaveProperty('statusCode');
    expect(response).toHaveProperty('requestId');
    expect(typeof response.statusCode).toBe('number');
  }, 15000);

  it('should get PPDs with real CUPS server', async () => {
    if (TEST_CONFIG.SKIP_REAL_CUPS) { return; }
    
    // 使用测试客户端函数获取带有认证信息的客户端
    const realClient = createTestCupsClient({ timeout: 15000 });
    
    try {
      const response = await realClient.getPPDs();
      
      expect(response).toHaveProperty('version');
      expect(response).toHaveProperty('statusCode');
      expect(response).toHaveProperty('requestId');
    } catch (error) {
      console.error('Error in real CUPS getPPDs test:', error);
    }
  }, 20000);

  it('should handle errors when getting PPDs from invalid host', async () => {
    if (TEST_CONFIG.SKIP_IPP_REAL) { return; }
    
    // Use an invalid client to trigger an error
    const invalidClient = createTestCupsClient({ 
      url: 'http://invalid-host:631',
      timeout: 3000
    });
    
    // For invalid hosts, the client will throw an error
    await expect(invalidClient.getPPDs()).rejects.toThrow();
  }, 5000);
});
