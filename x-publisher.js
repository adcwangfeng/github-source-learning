/**
 * X.com (Twitter) 发布器
 * 用于自动化推送内容到 X.com
 */

const { TwitterApi } = require('twitter-api-v2');

class XPublisher {
  constructor() {
    this.client = null;
    this.isEnabled = false;
    this.config = {
      apiKey: process.env.X_API_KEY,
      apiSecret: process.env.X_API_SECRET,
      accessToken: process.env.X_ACCESS_TOKEN,
      accessSecret: process.env.X_ACCESS_SECRET,
      bearerToken: process.env.X_BEARER_TOKEN
    };
    
    this.validateConfig();
  }

  /**
   * 验证配置
   */
  validateConfig() {
    const required = ['apiKey', 'apiSecret', 'accessToken', 'accessSecret', 'bearerToken'];
    const missing = required.filter(key => !this.config[key]);
    
    if (missing.length === 0) {
      this.isEnabled = true;
      this.initializeClient();
    } else {
      console.log(`⚠️ X Publisher 配置不完整，缺少: ${missing.join(', ')}`);
      console.log('💡 设置环境变量 X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_SECRET, X_BEARER_TOKEN 来启用此功能');
    }
  }

  /**
   * 初始化客户端
   */
  initializeClient() {
    try {
      this.client = new TwitterApi({
        appKey: this.config.apiKey,
        appSecret: this.config.apiSecret,
        accessToken: this.config.accessToken,
        accessSecret: this.config.apiSecret,
      });
      
      console.log('✅ X Publisher 客户端初始化成功');
    } catch (error) {
      console.error('❌ X Publisher 客户端初始化失败:', error.message);
      this.isEnabled = false;
    }
  }

  /**
   * 推送学习总结到 X.com
   */
  async publishLearningSummary(repoInfo, notes, options = {}) {
    if (!this.isEnabled) {
      throw new Error('X Publisher 未启用，请配置必要的 API 凭证');
    }

    try {
      // 生成推文内容
      const tweetContent = this.generateTweetContent(repoInfo, notes, options);
      
      // 发布推文
      const response = await this.client.v2.tweet(tweetContent.text);
      
      return {
        success: true,
        tweetId: response.data.id,
        url: `https://x.com/user/status/${response.data.id}`,
        content: tweetContent.text,
        message: `✅ 学习总结已成功发布到 X.com: ${response.data.id}`
      };
    } catch (error) {
      console.error('❌ 推送失败:', error);
      throw new Error(`推送失败: ${error.message}`);
    }
  }

  /**
   * 生成推文内容
   */
  generateTweetContent(repoInfo, notes, options = {}) {
    const maxTweetLength = 280; // X.com 推文最大长度
    
    // 创建标题
    let title = `📚 深度学习笔记: ${repoInfo.name}`;
    if (repoInfo.owner) {
      title = `📚 深度学习笔记: ${repoInfo.owner}/${repoInfo.name}`;
    }
    
    // 创建内容摘要
    let content = `深入分析了 ${repoInfo.name} 项目，学到很多关于${repoInfo.primaryLanguage}项目架构的知识！\n\n`;
    
    // 添加项目信息
    content += `📁 ${repoInfo.stats.totalFiles} 文件 | `;
    content += `${this.formatNumber(repoInfo.stats.totalLines)} 代码行 | `;
    content += `⭐ ${this.formatNumber(repoInfo.stars)} Stars\n\n`;
    
    // 添加学习要点
    const keyInsights = this.extractKeyInsights(notes);
    if (keyInsights.length > 0) {
      content += '🔑 关键发现:\n';
      keyInsights.slice(0, 3).forEach((insight, index) => {
        content += `• ${insight}\n`;
      });
      content += '\n';
    }
    
    // 添加学习心得
    const learningNotes = notes.filter(note => note.type === 'note');
    if (learningNotes.length > 0) {
      content += '💡 学习心得:\n';
      const recentNotes = learningNotes.slice(-2); // 最近2条笔记
      recentNotes.forEach(note => {
        const noteText = this.truncateText(note.content, 50);
        content += `• ${noteText}\n`;
      });
    }
    
    // 添加标签
    content += `\n#GitHub #源码学习 #${repoInfo.primaryLanguage} #技术分享 #开发者`;
    
    // 确保不超过推文长度限制
    let finalContent = this.truncateTweet(content, maxTweetLength);
    
    return {
      text: finalContent
    };
  }

  /**
   * 推送技术文章到 X.com
   */
  async publishTechnicalArticle(repoInfo, articleContent, options = {}) {
    if (!this.isEnabled) {
      throw new Error('X Publisher 未启用，请配置必要的 API 凭证');
    }

    try {
      // 生成技术文章推文
      const tweetContent = this.generateTechnicalTweet(repoInfo, articleContent, options);
      
      // 发布推文
      const response = await this.client.v2.tweet(tweetContent.text);
      
      return {
        success: true,
        tweetId: response.data.id,
        url: `https://x.com/user/status/${response.data.id}`,
        content: tweetContent.text,
        message: `✅ 技术文章已成功发布到 X.com: ${response.data.id}`
      };
    } catch (error) {
      console.error('❌ 推送失败:', error);
      throw new Error(`推送失败: ${error.message}`);
    }
  }

  /**
   * 生成技术文章推文
   */
  generateTechnicalTweet(repoInfo, articleContent, options = {}) {
    const maxTweetLength = 280;
    
    let content = `📖 技术深度解析: ${repoInfo.name}\n\n`;
    content += `通过深入学习 ${repoInfo.name} 项目，我总结了这篇技术文章:\n\n`;
    
    // 从文章内容中提取关键信息
    const keyPoints = this.extractKeyPoints(articleContent);
    keyPoints.forEach(point => {
      content += `• ${point}\n`;
    });
    
    content += `\n${repoInfo.description || ''}\n\n`;
    content += `🔗 ${repoInfo.html_url}\n`;
    content += `#技术文章 #${repoInfo.primaryLanguage} #架构设计 #开源项目`;
    
    let finalContent = this.truncateTweet(content, maxTweetLength);
    
    return {
      text: finalContent
    };
  }

  /**
   * 推送问答总结到 X.com
   */
  async publishQASummary(repoInfo, questions, answers, options = {}) {
    if (!this.isEnabled) {
      throw new Error('X Publisher 未启用，请配置必要的 API 凭证');
    }

    try {
      // 生成问答总结推文
      const tweetContent = this.generateQATweet(repoInfo, questions, answers, options);
      
      // 发布推文
      const response = await this.client.v2.tweet(tweetContent.text);
      
      return {
        success: true,
        tweetId: response.data.id,
        url: `https://x.com/user/status/${response.data.id}`,
        content: tweetContent.text,
        message: `✅ 问答总结已成功发布到 X.com: ${response.data.id}`
      };
    } catch (error) {
      console.error('❌ 推送失败:', error);
      throw new Error(`推送失败: ${error.message}`);
    }
  }

  /**
   * 生成问答推文
   */
  generateQATweet(repoInfo, questions, answers, options = {}) {
    const maxTweetLength = 280;
    
    let content = `❓ 源码学习问答: ${repoInfo.name}\n\n`;
    content += `在学习 ${repoInfo.name} 项目时的一些常见问题和解答:\n\n`;
    
    // 取前几个问答对
    const qaPairs = questions.slice(0, 2).map((q, idx) => ({
      question: q,
      answer: answers[idx] || '...'
    }));
    
    qaPairs.forEach(pair => {
      content += `Q: ${this.truncateText(pair.question, 30)}?\n`;
      content += `A: ${this.truncateText(pair.answer, 40)}\n\n`;
    });
    
    content += `#源码问答 #${repoInfo.primaryLanguage} #技术学习 #开发者`;
    
    let finalContent = this.truncateTweet(content, maxTweetLength);
    
    return {
      text: finalContent
    };
  }

  /**
   * 检查是否已启用
   */
  isEnabled() {
    return this.isEnabled;
  }

  /**
   * 获取配置状态
   */
  getConfigStatus() {
    return {
      isEnabled: this.isEnabled,
      hasCredentials: !!this.config.apiKey && !!this.config.apiSecret && 
                    !!this.config.accessToken && !!this.config.accessSecret && 
                    !!this.config.bearerToken,
      missingFields: Object.entries(this.config)
        .filter(([_, value]) => !value)
        .map(([key]) => key)
    };
  }

  // 辅助方法
  extractKeyInsights(notes) {
    const insights = [];
    notes.forEach(note => {
      if (note.content.includes('架构')) insights.push('架构设计思路');
      if (note.content.includes('模式')) insights.push('设计模式应用');
      if (note.content.includes('优化')) insights.push('性能优化技巧');
      if (note.content.includes('最佳实践')) insights.push('最佳实践方法');
      if (note.content.includes('组件')) insights.push('模块化设计');
      if (note.content.includes('安全')) insights.push('安全设计考虑');
    });
    
    if (insights.length === 0) {
      insights.push('项目整体架构', '代码组织方式', '技术选型思路');
    }
    
    return [...new Set(insights)]; // 去重
  }

  extractKeyPoints(content) {
    const points = [];
    const lines = content.split('\n');
    
    lines.forEach(line => {
      if (line.includes('#') || line.includes('*') || line.includes('-')) {
        const cleanLine = line.replace(/[#*-]/g, '').trim();
        if (cleanLine.length > 5 && cleanLine.length < 60) {
          points.push(cleanLine);
        }
      }
    });
    
    if (points.length === 0) {
      points.push('项目架构分析', '代码质量评估', '技术实现细节');
    }
    
    return points.slice(0, 3);
  }

  truncateTweet(text, maxLength) {
    if (text.length <= maxLength) return text;
    
    // 尝试在句子边界截断
    const truncated = text.substring(0, maxLength - 3);
    const lastSentence = truncated.lastIndexOf('.');
    if (lastSentence > maxLength * 0.7) { // 确保不是在开头截断
      return truncated.substring(0, lastSentence + 1) + '...';
    }
    
    return truncated + '...';
  }

  truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

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

module.exports = new XPublisher();