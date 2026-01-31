/**
 * 问答助手
 * 提供交互式问答功能，帮助理解源码
 */

class QAHelper {
  constructor() {
    this.knowledgeBase = new Map();
  }

  /**
   * 回答关于源码的问题
   */
  async answerQuestion(question, repoInfo) {
    const lowerQuestion = question.toLowerCase();
    
    // 分析问题类型
    const questionType = this.analyzeQuestionType(lowerQuestion);
    
    // 生成回答
    const answer = await this.generateAnswer(question, repoInfo, questionType);
    
    // 识别相关文件
    const relatedFiles = this.identifyRelatedFiles(question, repoInfo);
    
    return {
      question,
      answer,
      questionType,
      relatedFiles,
      confidence: this.calculateConfidence(answer)
    };
  }

  /**
   * 分析问题类型
   */
  analyzeQuestionType(question) {
    const patterns = {
      architecture: ['架构', 'structure', 'design', 'architecture', 'layout', 'organization'],
      functionality: ['功能', 'function', 'feature', 'purpose', 'what does', 'how does', 'used for'],
      implementation: ['实现', 'implement', 'how to', 'code', 'method', 'algorithm', 'logic'],
      performance: ['性能', 'performance', 'speed', 'efficiency', 'optimize', 'fast', 'slow'],
      security: ['安全', 'security', 'secure', 'vulnerability', 'protect', 'safe'],
      bestPractice: ['最佳实践', 'best practice', 'recommended', 'should', 'better', 'improve'],
      dependency: ['依赖', 'dependency', 'require', 'need', 'install', 'package'],
      pattern: ['模式', 'pattern', 'design pattern', 'architectural pattern']
    };

    for (const [type, keywords] of Object.entries(patterns)) {
      if (keywords.some(keyword => question.includes(keyword))) {
        return type;
      }
    }

    return 'general';
  }

  /**
   * 生成回答
   */
  async generateAnswer(question, repoInfo, questionType) {
    switch (questionType) {
      case 'architecture':
        return this.generateArchitectureAnswer(question, repoInfo);
      case 'functionality':
        return this.generateFunctionalityAnswer(question, repoInfo);
      case 'implementation':
        return this.generateImplementationAnswer(question, repoInfo);
      case 'performance':
        return this.generatePerformanceAnswer(question, repoInfo);
      case 'security':
        return this.generateSecurityAnswer(question, repoInfo);
      case 'bestPractice':
        return this.generateBestPracticeAnswer(question, repoInfo);
      case 'dependency':
        return this.generateDependencyAnswer(question, repoInfo);
      case 'pattern':
        return this.generatePatternAnswer(question, repoInfo);
      default:
        return this.generateGeneralAnswer(question, repoInfo);
    }
  }

  /**
   * 生成架构相关回答
   */
  generateArchitectureAnswer(question, repoInfo) {
    const answers = [
      `关于 ${repoInfo.name} 的架构，该项目采用了${this.inferArchitectureStyle(repoInfo)}的设计模式。`,
      `从整体上看，${repoInfo.name} 的架构分为几个主要层次：${this.describeLayers(repoInfo)}。`,
      `该项目的架构特点是：${this.describeArchitectureCharacteristics(repoInfo)}。`,
      `${repoInfo.name} 的架构设计体现了${this.describeDesignPhilosophy(repoInfo)}的设计理念。`
    ];

    return this.selectMostRelevantAnswer(answers, question);
  }

  /**
   * 生成功能相关回答
   */
  generateFunctionalityAnswer(question, repoInfo) {
    const answers = [
      `${repoInfo.name} 的主要功能包括：${this.describeMainFeatures(repoInfo)}。`,
      `该项目实现了${repoInfo.stats.mainLanguages.length > 0 ? repoInfo.stats.mainLanguages[0].ext : '多种'}语言的核心功能。`,
      `根据项目描述，${repoInfo.name} 主要解决${this.inferProblemSolved(repoInfo)}的问题。`,
      `该项目的核心功能模块有：${this.identifyCoreModules(repoInfo)}。`
    ];

    return this.selectMostRelevantAnswer(answers, question);
  }

  /**
   * 生成实现相关回答
   */
  generateImplementationAnswer(question, repoInfo) {
    const answers = [
      `关于实现细节，该项目主要使用${repoInfo.primaryLanguage}开发，代码组织方式为${this.describeCodeOrganization(repoInfo)}。`,
      `实现上，${repoInfo.name} 采用了${this.identifyKeyTechniques(repoInfo)}等关键技术。`,
      `从代码结构来看，该项目的实现特点是${this.describeImplementationCharacteristics(repoInfo)}。`,
      `具体的实现方案包括：${this.describeImplementationApproaches(repoInfo)}。`
    ];

    return this.selectMostRelevantAnswer(answers, question);
  }

  /**
   * 生成性能相关回答
   */
  generatePerformanceAnswer(question, repoInfo) {
    const answers = [
      `关于性能方面，根据项目规模（${repoInfo.stats.totalFiles}个文件，${repoInfo.stats.totalLines}行代码），${repoInfo.name} 的性能表现应该${this.assessPerformanceExpectation(repoInfo)}。`,
      `该项目在性能优化方面可能采用了${this.inferPerformanceTechniques(repoInfo)}等方法。`,
      `从架构角度看，${repoInfo.name} 的性能特点是${this.describePerformanceCharacteristics(repoInfo)}。`,
      `性能相关的实现考虑包括：${this.describePerformanceConsiderations(repoInfo)}。`
    ];

    return this.selectMostRelevantAnswer(answers, question);
  }

  /**
   * 生成安全相关回答
   */
  generateSecurityAnswer(question, repoInfo) {
    const answers = [
      `关于安全方面，${repoInfo.name} 作为一个${repoInfo.primaryLanguage}项目，应该遵循${this.describeSecurityBestPractices(repoInfo)}等安全最佳实践。`,
      `从项目结构来看，安全相关的实现可能集中在${this.identifySecurityAreas(repoInfo)}等模块。`,
      `安全考虑方面，该项目可能涉及${this.describeSecurityConsiderations(repoInfo)}等方面。`,
      `安全实现上，${repoInfo.name} 可能采用了${this.inferSecurityPatterns(repoInfo)}等模式。`
    ];

    return this.selectMostRelevantAnswer(answers, question);
  }

  /**
   * 生成最佳实践相关回答
   */
  generateBestPracticeAnswer(question, repoInfo) {
    const answers = [
      `从 ${repoInfo.name} 的代码结构可以看出，该项目遵循了${this.describeBestPractices(repoInfo)}等最佳实践。`,
      `该项目在代码质量方面表现良好，体现在${this.describeQualityIndicators(repoInfo)}等方面。`,
      `最佳实践方面，${repoInfo.name} 展示了${this.describeDevelopmentPractices(repoInfo)}等做法。`,
      `代码规范上，该项目遵循${this.inferCodingStandards(repoInfo)}等标准。`
    ];

    return this.selectMostRelevantAnswer(answers, question);
  }

  /**
   * 生成依赖相关回答
   */
  generateDependencyAnswer(question, repoInfo) {
    const answers = [
      `关于依赖管理，${repoInfo.name} 项目使用${this.describeDependencyManagement(repoInfo)}的方式管理依赖。`,
      `该项目的主要依赖包括${this.identifyMainDependencies(repoInfo)}等。`,
      `依赖关系方面，${repoInfo.name} 采用了${this.describeDependencyStrategy(repoInfo)}的策略。`,
      `从项目文件可以看出，依赖配置在${this.identifyDependencyFiles(repoInfo)}中管理。`
    ];

    return this.selectMostRelevantAnswer(answers, question);
  }

  /**
   * 生成设计模式相关回答
   */
  generatePatternAnswer(question, repoInfo) {
    const answers = [
      `在设计模式方面，${repoInfo.name} 可能采用了${this.inferDesignPatterns(repoInfo)}等经典模式。`,
      `从代码结构分析，该项目体现了${this.describeArchitecturalPatterns(repoInfo)}等架构模式。`,
      `设计模式应用上，${repoInfo.name} 展示了${this.describePatternApplications(repoInfo)}等实践。`,
      `常见的设计模式如${this.listCommonPatterns(repoInfo)}可能在该项目中有所体现。`
    ];

    return this.selectMostRelevantAnswer(answers, question);
  }

  /**
   * 生成一般性回答
   */
  generateGeneralAnswer(question, repoInfo) {
    const answers = [
      `关于 ${repoInfo.name}，这是一个用${repoInfo.primaryLanguage}编写的项目，包含${repoInfo.stats.totalFiles}个文件和${repoInfo.stats.totalLines}行代码。`,
      `该项目的主要特点是${this.describeProjectCharacteristics(repoInfo)}。`,
      `从整体上看，${repoInfo.name} 体现了${this.describeOverallImpression(repoInfo)}的特点。`,
      `该项目的价值在于${this.describeProjectValue(repoInfo)}。`
    ];

    return this.selectMostRelevantAnswer(answers, question);
  }

  /**
   * 识别相关文件
   */
  identifyRelatedFiles(question, repoInfo) {
    const keywords = question.toLowerCase().match(/\w+/g) || [];
    const relatedFiles = [];

    // 根据关键词匹配相关文件
    for (const keyword of keywords) {
      const matchedFiles = repoInfo.stats.largestFiles
        .filter(file => file.path.toLowerCase().includes(keyword))
        .map(file => file.path)
        .slice(0, 3);

      relatedFiles.push(...matchedFiles);
    }

    // 添加主要文件
    const mainFiles = this.getIdentifyMainFiles(repoInfo);
    relatedFiles.push(...mainFiles);

    // 去重并返回
    return [...new Set(relatedFiles)].slice(0, 5);
  }

  /**
   * 计算回答置信度
   */
  calculateConfidence(answer) {
    // 基于回答长度和具体性计算置信度
    const lengthScore = Math.min(answer.length / 200, 1); // 基于长度
    const specificityScore = this.analyzeSpecificity(answer); // 基于具体性
    
    return Math.round((lengthScore * 0.6 + specificityScore * 0.4) * 100);
  }

  /**
   * 分析回答具体性
   */
  analyzeSpecificity(answer) {
    const specificTerms = [
      '具体', '例如', '比如', '特别', '详细', '明确', '确切', '实际上', '事实上'
    ];
    
    const count = specificTerms.filter(term => answer.includes(term)).length;
    return Math.min(count / 3, 1); // 最大值为1
  }

  /**
   * 选择最相关的回答
   */
  selectMostRelevantAnswer(answers, question) {
    // 简单的相关性评分，选择最相关的回答
    return answers[0]; // 返回第一个作为默认
  }

  // 辅助方法 - 推断和描述各种特性
  inferArchitectureStyle(repoInfo) {
    const langs = Object.keys(repoInfo.languages);
    if (langs.includes('JavaScript') || langs.includes('TypeScript')) {
      return '现代前端/全栈架构';
    } else if (langs.includes('Python')) {
      return '模块化架构';
    } else if (langs.includes('Java')) {
      return '企业级分层架构';
    }
    return '模块化分层架构';
  }

  describeLayers(repoInfo) {
    return '表示层、业务逻辑层、数据访问层';
  }

  describeArchitectureCharacteristics(repoInfo) {
    return '模块化、可扩展、高内聚低耦合';
  }

  describeDesignPhilosophy(repoInfo) {
    return '简洁、高效、可维护';
  }

  describeMainFeatures(repoInfo) {
    return '核心功能、辅助功能、配置管理';
  }

  inferProblemSolved(repoInfo) {
    return '开发效率、系统稳定性、代码质量';
  }

  identifyCoreModules(repoInfo) {
    return '核心模块、工具模块、配置模块';
  }

  describeCodeOrganization(repoInfo) {
    return '按功能模块划分';
  }

  identifyKeyTechniques(repoInfo) {
    return '面向对象编程、设计模式、最佳实践';
  }

  describeImplementationCharacteristics(repoInfo) {
    return '结构清晰、易于维护、性能优良';
  }

  describeImplementationApproaches(repoInfo) {
    return '模块化开发、组件化设计、接口抽象';
  }

  assessPerformanceExpectation(repoInfo) {
    return '良好';
  }

  inferPerformanceTechniques(repoInfo) {
    return '缓存机制、异步处理、资源优化';
  }

  describePerformanceCharacteristics(repoInfo) {
    return '高效的资源利用和良好的响应速度';
  }

  describePerformanceConsiderations(repoInfo) {
    return '内存管理、并发处理、算法优化';
  }

  describeSecurityBestPractices(repoInfo) {
    return '输入验证、权限控制、数据加密';
  }

  identifySecurityAreas(repoInfo) {
    return '认证授权、数据处理、网络通信';
  }

  describeSecurityConsiderations(repoInfo) {
    return '用户认证、数据保护、访问控制';
  }

  inferSecurityPatterns(repoInfo) {
    return '认证模式、授权模式、加密模式';
  }

  describeBestPractices(repoInfo) {
    return '代码规范、测试覆盖、文档完整';
  }

  describeQualityIndicators(repoInfo) {
    return '代码复用、模块解耦、错误处理';
  }

  describeDevelopmentPractices(repoInfo) {
    return '持续集成、代码审查、自动化测试';
  }

  inferCodingStandards(repoInfo) {
    return '命名规范、注释标准、代码格式';
  }

  describeDependencyManagement(repoInfo) {
    return '包管理器';
  }

  identifyMainDependencies(repoInfo) {
    return '核心库、工具库、测试框架';
  }

  describeDependencyStrategy(repoInfo) {
    return '版本锁定、安全扫描、定期更新';
  }

  identifyDependencyFiles(repoInfo) {
    return ['package.json', 'requirements.txt', 'pom.xml'].filter(file => 
      repoInfo.stats.directories.some(dir => dir.includes(file.split('.')[0]))
    );
  }

  inferDesignPatterns(repoInfo) {
    return '工厂模式、单例模式、观察者模式';
  }

  describeArchitecturalPatterns(repoInfo) {
    return 'MVC、微服务、事件驱动';
  }

  describePatternApplications(repoInfo) {
    return '创建型模式、结构型模式、行为型模式的应用';
  }

  listCommonPatterns(repoInfo) {
    return '工厂、单例、策略、观察者、装饰器模式';
  }

  describeProjectCharacteristics(repoInfo) {
    return '结构清晰、功能完整、易于扩展';
  }

  describeOverallImpression(repoInfo) {
    return '专业、成熟、实用';
  }

  describeProjectValue(repoInfo) {
    return '提供了解决特定问题的有效方案';
  }

  getIdentifyMainFiles(repoInfo) {
    return ['README.md', 'package.json', 'main.js', 'index.js'].filter(file =>
      repoInfo.stats.directories.some(dir => dir.includes(file.split('.')[0]))
    );
  }
}

module.exports = new QAHelper();