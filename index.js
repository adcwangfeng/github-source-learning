/**
 * GitHub源码学习助手
 * 提供由浅入深的源码学习和设计思想分析
 */

class GithubSourceLearningAssistant {
  constructor() {
    this.learningProgress = new Map();
    this.noteManager = require('./note-manager.js');
    this.githubParser = require('./github-parser.js');
    this.learningPath = require('./learning-path.js');
    this.exporter = require('./exporter.js');
    this.qaHelper = require('./qa-helper.js');
    this.utils = require('./utils.js');
    this.xPublisher = require('./x-publisher.js');
  }

  /**
   * 开始学习一个新的GitHub仓库
   */
  async startLearning(githubUrl, options = {}) {
    try {
      console.log(`🚀 开始分析仓库: ${githubUrl}`);
      
      // 解析GitHub仓库
      const repoInfo = await this.githubParser.parseRepository(githubUrl);
      
      // 创建学习路径
      const learningPath = await this.learningPath.createLearningPath(repoInfo);
      
      // 初始化学习进度
      const sessionId = this.utils.generateSessionId();
      this.learningProgress.set(sessionId, {
        repoInfo,
        learningPath,
        currentStep: 0,
        notes: [],
        createdAt: new Date()
      });

      console.log(`✅ 仓库分析完成，共发现 ${repoInfo.stats.totalFiles} 个文件`);
      console.log(`🎯 学习路径已生成，包含 ${learningPath.steps.length} 个学习阶段`);

      return {
        sessionId,
        repoInfo,
        learningPath,
        message: `仓库分析完成！${repoInfo.name} 项目包含 ${repoInfo.stats.totalFiles} 个文件，${repoInfo.stats.totalLines} 行代码。让我们从架构层面开始学习吧！`
      };
    } catch (error) {
      console.error('❌ 学习启动失败:', error);
      throw error;
    }
  }

  /**
   * 获取下一步学习内容
   */
  async getNextStep(sessionId) {
    const progress = this.learningProgress.get(sessionId);
    if (!progress) {
      throw new Error('无效的学习会话');
    }

    const currentStep = progress.learningPath.steps[progress.currentStep];
    if (!currentStep) {
      return { completed: true, message: '🎉 恭喜！您已完成整个学习路径！' };
    }

    // 更新进度
    progress.currentStep += 1;

    return {
      step: currentStep,
      progress: {
        current: progress.currentStep - 1,
        total: progress.learningPath.steps.length,
        percentage: Math.round(((progress.currentStep - 1) / progress.learningPath.steps.length) * 100)
      },
      message: `第 ${progress.currentStep}/${progress.learningPath.steps.length} 步: ${currentStep.title}`
    };
  }

  /**
   * 添加学习笔记
   */
  async addNote(sessionId, note) {
    const progress = this.learningProgress.get(sessionId);
    if (!progress) {
      throw new Error('无效的学习会话');
    }

    const noteEntry = {
      id: this.utils.generateId(),
      timestamp: new Date(),
      content: note,
      type: 'note'
    };

    progress.notes.push(noteEntry);
    
    // 保存到笔记管理器
    await this.noteManager.saveNote(progress.repoInfo.name, noteEntry);

    return { success: true, message: '笔记已保存' };
  }

  /**
   * 问答交互
   */
  async askQuestion(sessionId, question) {
    const progress = this.learningProgress.get(sessionId);
    if (!progress) {
      throw new Error('无效的学习会话');
    }

    const answer = await this.qaHelper.answerQuestion(question, progress.repoInfo);
    
    // 保存问答记录
    const qaEntry = {
      id: this.utils.generateId(),
      timestamp: new Date(),
      question,
      answer,
      type: 'qa'
    };

    progress.notes.push(qaEntry);
    await this.noteManager.saveNote(progress.repoInfo.name, qaEntry);

    return { answer, relatedFiles: answer.relatedFiles || [] };
  }

  /**
   * 导出学习笔记
   */
  async exportNotes(sessionId, format = 'markdown') {
    const progress = this.learningProgress.get(sessionId);
    if (!progress) {
      throw new Error('无效的学习会话');
    }

    const notes = await this.noteManager.getNotes(progress.repoInfo.name);
    const exportResult = await this.exporter.export(notes, progress.repoInfo, format);

    return {
      exported: true,
      filePath: exportResult.filePath,
      format,
      message: `笔记已导出为 ${format} 格式: ${exportResult.filePath}`
    };
  }

  /**
   * 获取学习统计
   */
  getLearningStats(sessionId) {
    const progress = this.learningProgress.get(sessionId);
    if (!progress) {
      throw new Error('无效的学习会话');
    }

    return {
      repoInfo: progress.repoInfo,
      progress: {
        current: progress.currentStep - 1,
        total: progress.learningPath.steps.length,
        percentage: progress.learningPath.steps.length > 0 
          ? Math.round(((progress.currentStep - 1) / progress.learningPath.steps.length) * 100)
          : 0
      },
      notesCount: progress.notes.length,
      completedSteps: progress.currentStep - 1
    };
  }

  /**
   * 获取可用的导出格式
   */
  getExportFormats() {
    return this.exporter.getSupportedFormats();
  }

  /**
   * 发布学习总结到 X.com
   */
  async publishToX(sessionId, options = {}) {
    const progress = this.learningProgress.get(sessionId);
    if (!progress) {
      throw new Error('无效的学习会话');
    }

    if (!this.xPublisher.isEnabled()) {
      throw new Error('X Publisher 未启用，请配置必要的 API 凭证');
    }

    try {
      const notes = await this.noteManager.getNotes(progress.repoInfo.name);
      const result = await this.xPublisher.publishLearningSummary(
        progress.repoInfo, 
        notes, 
        options
      );

      return result;
    } catch (error) {
      console.error('❌ X 发布失败:', error);
      throw error;
    }
  }

  /**
   * 发布技术文章到 X.com
   */
  async publishArticleToX(sessionId, articleContent, options = {}) {
    const progress = this.learningProgress.get(sessionId);
    if (!progress) {
      throw new Error('无效的学习会话');
    }

    if (!this.xPublisher.isEnabled()) {
      throw new Error('X Publisher 未启用，请配置必要的 API 凭证');
    }

    try {
      const result = await this.xPublisher.publishTechnicalArticle(
        progress.repoInfo,
        articleContent,
        options
      );

      return result;
    } catch (error) {
      console.error('❌ X 文章发布失败:', error);
      throw error;
    }
  }

  /**
   * 发布问答总结到 X.com
   */
  async publishQAToX(sessionId, questions, answers, options = {}) {
    const progress = this.learningProgress.get(sessionId);
    if (!progress) {
      throw new Error('无效的学习会话');
    }

    if (!this.xPublisher.isEnabled()) {
      throw new Error('X Publisher 未启用，请配置必要的 API 凭证');
    }

    try {
      const result = await this.xPublisher.publishQASummary(
        progress.repoInfo,
        questions,
        answers,
        options
      );

      return result;
    } catch (error) {
      console.error('❌ X 问答发布失败:', error);
      throw error;
    }
  }

  /**
   * 检查 X Publisher 配置状态
   */
  getXConfigStatus() {
    return this.xPublisher.getConfigStatus();
  }
}

module.exports = GithubSourceLearningAssistant;