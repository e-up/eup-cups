/**
 * 测试脚本：批量运行所有示例文件
 * 用于检查src/examples目录中的所有示例是否能正常运行
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 示例文件目录
const examplesDir = path.join(__dirname, 'src', 'examples');

// 获取所有.ts示例文件
const exampleFiles = fs.readdirSync(examplesDir)
  .filter(file => file.endsWith('.ts'))
  .map(file => path.join(examplesDir, file));

console.log(`找到 ${exampleFiles.length} 个示例文件`);
console.log('=' .repeat(50));

// 记录结果
const results = {
  passed: [],
  failed: []
};

// 运行每个示例文件
exampleFiles.forEach((file, index) => {
  const fileName = path.basename(file);
  console.log(`\n[${index + 1}/${exampleFiles.length}] 运行示例: ${fileName}`);
  
  try {
    // 运行示例文件
    const output = execSync(`npx tsx "${file}"`, {
      cwd: __dirname,
      timeout: 30000, // 30秒超时
      encoding: 'utf8'
    });
    
    console.log('✅ 成功');
    results.passed.push(fileName);
  } catch (error) {
    console.log('❌ 失败');
    console.log(`  错误信息: ${error.message}`);
    results.failed.push(fileName);
  }
});

console.log('\n' + '=' .repeat(50));
console.log('测试结果汇总:');
console.log(`✅ 通过: ${results.passed.length} 个`);
console.log(`❌ 失败: ${results.failed.length} 个`);

if (results.passed.length > 0) {
  console.log('\n通过的示例:');
  results.passed.forEach(file => console.log(`  - ${file}`));
}

if (results.failed.length > 0) {
  console.log('\n失败的示例:');
  results.failed.forEach(file => console.log(`  - ${file}`));
  
  console.log('\n请检查失败的示例文件，修复问题后重新运行此脚本');
  process.exit(1);
} else {
  console.log('\n所有示例文件都成功运行！');
  process.exit(0);
}
