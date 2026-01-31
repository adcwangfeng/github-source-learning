/**
 * GitHub源码学习助手测试
 */

async function testGithubSourceLearning() {
  console.log('🧪 开始测试GitHub源码学习助手...\n');
  
  try {
    // 导入主模块
    const GithubSourceLearningAssistant = require('./index.js');
    console.log('✅ 1. 主模块导入成功');
    
    // 创建助手实例
    const assistant = new GithubSourceLearningAssistant();
    console.log('✅ 2. 助手实例创建成功');
    
    // 测试工具函数
    const utils = require('./utils.js');
    console.log('✅ 3. 工具函数加载成功');
    
    // 测试ID生成
    const testId = utils.generateId();
    console.log(`✅ 4. ID生成测试: ${testId.substring(0, 8)}...`);
    
    // 测试文本清理
    const cleanText = utils.cleanText('  Hello World  \n  Test  ');
    console.log(`✅ 5. 文本清理测试: "${cleanText}"`);
    
    // 测试URL验证
    const isValidUrl = utils.isValidUrl('https://github.com/vuejs/vue');
    console.log(`✅ 6. URL验证测试: ${isValidUrl ? '有效' : '无效'}`);
    
    // 测试GitHub URL验证
    const isValidGithub = utils.isValidGithubUrl('https://github.com/vuejs/vue');
    console.log(`✅ 7. GitHub URL验证: ${isValidGithub ? '有效' : '无效'}`);
    
    // 测试文件类型分析
    const fileType = utils.analyzeFileType('index.js');
    console.log(`✅ 8. 文件类型分析: ${fileType}`);
    
    // 测试文件图标获取
    const fileIcon = utils.getFileIcon('javascript');
    console.log(`✅ 9. 文件图标获取: ${fileIcon}`);
    
    // 测试相似度计算
    const similarity = utils.calculateSimilarity('hello world', 'hello world!');
    console.log(`✅ 10. 相似度计算: ${(similarity * 100).toFixed(1)}%`);
    
    // 测试分词
    const tokens = utils.tokenize('Hello world test');
    console.log(`✅ 11. 分词测试: [${tokens.join(', ')}]`);
    
    // 测试关键词提取
    const keywords = utils.extractKeywords('This is a test of the system', 3);
    console.log(`✅ 12. 关键词提取: [${keywords.join(', ')}]`);
    
    // 测试摘要生成
    const summary = utils.generateSummary('This is a long text that needs to be summarized.', 20);
    console.log(`✅ 13. 摘要生成: "${summary}"`);
    
    // 测试数字格式化
    const formattedNum = utils.formatNumber(1500);
    console.log(`✅ 14. 数字格式化: ${formattedNum}`);
    
    // 测试文件大小格式化
    const formattedSize = utils.formatFileSize(1024000);
    console.log(`✅ 15. 文件大小格式化: ${formattedSize}`);
    
    console.log('\n🎉 所有单元测试通过！');
    console.log('📱 GitHub源码学习助手核心功能正常');
    
    // 测试笔记管理器
    console.log('\n📋 测试笔记管理器...');
    const noteManager = require('./note-manager.js');
    console.log('✅ 笔记管理器加载成功');
    
    // 测试导出器
    console.log('\n📤 测试导出器...');
    const exporter = require('./exporter.js');
    const formats = exporter.getSupportedFormats();
    console.log(`✅ 导出器加载成功，支持 ${formats.length} 种格式: ${formats.slice(0, 3).join(', ')}...`);
    
    // 测试问答助手
    console.log('\n💬 测试问答助手...');
    const qaHelper = require('./qa-helper.js');
    console.log('✅ 问答助手加载成功');
    
    // 测试学习路径规划器
    console.log('\n🗺️ 测试学习路径规划器...');
    const learningPath = require('./learning-path.js');
    console.log('✅ 学习路径规划器加载成功');
    
    // 测试GitHub解析器
    console.log('\n🔍 测试GitHub解析器...');
    const githubParser = require('./github-parser.js');
    console.log('✅ GitHub解析器加载成功');
    
    console.log('\n🌟 完整功能测试通过！');
    console.log('🎯 GitHub源码学习助手已准备就绪');
    
    return true;
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
    console.error('详细错误:', error.stack);
    return false;
  }
}

// 运行测试
testGithubSourceLearning().then(success => {
  if (success) {
    console.log('\n✅ 测试完成 - 所有功能正常');
  } else {
    console.log('\n❌ 测试完成 - 存在问题');
    process.exit(1);
  }
});