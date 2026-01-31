/**
 * 工具函数
 * 提供通用的工具函数
 */

const crypto = require('crypto');

class Utils {
  /**
   * 生成唯一ID
   */
  generateId() {
    return crypto.randomBytes(16).toString('hex');
  }

  /**
   * 生成会话ID
   */
  generateSessionId() {
    return `session_${Date.now()}_${this.generateId().substring(0, 8)}`;
  }

  /**
   * 格式化文件大小
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * 格式化时间
   */
  formatTime(ms) {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  }

  /**
   * 估计代码复杂度
   */
  estimateComplexity(linesOfCode) {
    if (linesOfCode < 100) return '简单';
    if (linesOfCode < 1000) return '中等';
    if (linesOfCode < 10000) return '复杂';
    return '非常复杂';
  }

  /**
   * 分析文件类型
   */
  analyzeFileType(fileName) {
    const ext = fileName.split('.').pop().toLowerCase();
    const typeMap = {
      // 源代码
      'js': 'javascript',
      'ts': 'typescript',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'cs': 'csharp',
      'go': 'go',
      'rb': 'ruby',
      'php': 'php',
      'swift': 'swift',
      'kt': 'kotlin',
      
      // 配置文件
      'json': 'json',
      'yaml': 'yaml',
      'yml': 'yaml',
      'xml': 'xml',
      'toml': 'toml',
      'ini': 'ini',
      
      // 文档
      'md': 'markdown',
      'txt': 'text',
      'rst': 'rst',
      'html': 'html',
      'htm': 'html',
      
      // 样式
      'css': 'css',
      'scss': 'scss',
      'sass': 'sass',
      'less': 'less',
      
      // 模板
      'ejs': 'ejs',
      'jade': 'jade',
      'pug': 'pug',
      
      // 数据
      'sql': 'sql',
      'csv': 'csv',
      'json': 'json'
    };
    
    return typeMap[ext] || 'unknown';
  }

  /**
   * 获取文件图标
   */
  getFileIcon(fileType) {
    const iconMap = {
      'javascript': '📄',
      'typescript': '📄',
      'python': '🐍',
      'java': '☕',
      'cpp': '🔧',
      'c': '🔧',
      'csharp': '🔷',
      'go': '🐹',
      'ruby': '💎',
      'php': '🐘',
      'swift': '🍎',
      'kotlin': '🇰',
      'json': '📋',
      'yaml': '📋',
      'xml': '📋',
      'toml': '📋',
      'ini': '📋',
      'markdown': '📝',
      'text': '📄',
      'rst': '📄',
      'html': '🌐',
      'css': '🎨',
      'scss': '🎨',
      'sass': '🎨',
      'less': '🎨',
      'sql': '🗄️',
      'csv': '📊',
      'unknown': '❓'
    };
    
    return iconMap[fileType] || '❓';
  }

  /**
   * 清理文本
   */
  cleanText(text) {
    return text
      .replace(/\r\n/g, '\n')  // 统一换行符
      .replace(/\t/g, '  ')    // 将制表符转换为空格
      .replace(/\s+\n/g, '\n') // 移除行尾空格
      .trim();
  }

  /**
   * 提取代码片段
   */
  extractCodeSnippets(text) {
    const regex = /```([\s\S]*?)```/g;
    const matches = [];
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      matches.push({
        fullMatch: match[0],
        language: match[1].split('\n')[0] || '',
        code: match[1].replace(/^\w+\n/, '').trim()
      });
    }
    
    return matches;
  }

  /**
   * 计算相似度
   */
  calculateSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  /**
   * 计算编辑距离
   */
  levenshteinDistance(str1, str2) {
    const matrix = Array(str2.length + 1).fill().map(() => Array(str1.length + 1).fill(0));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,     // 插入
          matrix[j - 1][i] + 1,     // 删除
          matrix[j - 1][i - 1] + cost // 替换
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  /**
   * 分词
   */
  tokenize(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(token => token.length > 0);
  }

  /**
   * 关键词提取
   */
  extractKeywords(text, maxKeywords = 10) {
    const tokens = this.tokenize(text);
    const wordFreq = new Map();
    
    tokens.forEach(token => {
      if (token.length > 2) { // 过滤短词
        wordFreq.set(token, (wordFreq.get(token) || 0) + 1);
      }
    });
    
    // 按频率排序并返回top关键词
    return Array.from(wordFreq.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, maxKeywords)
      .map(([word]) => word);
  }

  /**
   * 生成摘要
   */
  generateSummary(text, maxLength = 200) {
    if (text.length <= maxLength) return text;
    
    const sentences = text.split(/[.!?。！？]+/);
    let summary = '';
    
    for (const sentence of sentences) {
      if ((summary + sentence).length > maxLength) {
        summary += sentence.substring(0, maxLength - summary.length);
        break;
      }
      summary += sentence + '.';
    }
    
    return summary + '...';
  }

  /**
   * 验证URL
   */
  isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  /**
   * 验证GitHub URL
   */
  isValidGithubUrl(url) {
    const githubRegex = /^https:\/\/github\.com\/[\w-]+\/[\w-]+(?:\/tree\/[\w-]+)?$/;
    return githubRegex.test(url);
  }

  /**
   * 延迟函数
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 重试机制
   */
  async retryAsync(fn, maxRetries = 3, delayMs = 1000) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await this.delay(delayMs * Math.pow(2, i)); // 指数退避
      }
    }
  }

  /**
   * 格式化数字
   */
  formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }
}

module.exports = new Utils();