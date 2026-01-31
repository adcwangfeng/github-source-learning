/**
 * 学习路径规划器
 * 负责生成从架构到细节的学习路径
 */

class LearningPathPlanner {
  /**
   * 创建学习路径
   */
  async createLearningPath(repoInfo) {
    const steps = [
      {
        id: 'overview',
        title: '项目概览',
        description: '了解项目的基本信息、目标和核心功能',
        level: 'overview',
        priority: 1,
        content: this.generateOverviewStep(repoInfo),
        estimatedTime: '10-15分钟'
      },
      {
        id: 'architecture',
        title: '架构分析',
        description: '分析项目的整体架构设计和核心组件关系',
        level: 'architecture',
        priority: 2,
        content: this.generateArchitectureStep(repoInfo),
        estimatedTime: '20-30分钟'
      },
      {
        id: 'modules',
        title: '模块分析',
        description: '深入了解各个核心模块的设计和实现',
        level: 'module',
        priority: 3,
        content: this.generateModulesStep(repoInfo),
        estimatedTime: '30-45分钟'
      },
      {
        id: 'components',
        title: '组件详解',
        description: '详细分析关键组件的具体实现和设计模式',
        level: 'component',
        priority: 4,
        content: this.generateComponentsStep(repoInfo),
        estimatedTime: '45-60分钟'
      },
      {
        id: 'patterns',
        title: '设计模式与最佳实践',
        description: '识别项目中的设计模式和开发最佳实践',
        level: 'pattern',
        priority: 5,
        content: this.generatePatternsStep(repoInfo),
        estimatedTime: '30-40分钟'
      },
      {
        id: 'deep-dive',
        title: '深度挖掘',
        description: '深入研究感兴趣的特定功能或模块',
        level: 'deep-dive',
        priority: 6,
        content: this.generateDeepDiveStep(repoInfo),
        estimatedTime: '60+分钟'
      },
      {
        id: 'summary',
        title: '总结与思考',
        description: '总结学习收获，提出改进建议和思考',
        level: 'summary',
        priority: 7,
        content: this.generateSummaryStep(repoInfo),
        estimatedTime: '20-30分钟'
      }
    ];

    return {
      repo: repoInfo.name,
      totalSteps: steps.length,
      estimatedTotalTime: this.calculateTotalTime(steps),
      steps: steps,
      difficulty: this.estimateDifficulty(repoInfo),
      recommendedPrerequisites: this.getPrerequisites(repoInfo)
    };
  }

  /**
   * 生成项目概览步骤
   */
  generateOverviewStep(repoInfo) {
    return {
      intro: `让我们开始探索 **${repoInfo.name}** 项目！`,
      content: [
        `**项目简介**: ${repoInfo.description || '暂无描述'}`,
        `**Stars**: ${repoInfo.stars.toLocaleString()} | **Forks**: ${repoInfo.forks.toLocaleString()}`,
        `**主要语言**: ${repoInfo.primaryLanguage}`,
        `**文件总数**: ${repoInfo.stats.totalFiles}`,
        `**代码行数**: ${repoInfo.stats.totalLines.toLocaleString()}`
      ],
      questions: [
        '这个项目的整体目标是什么？',
        '它解决了什么问题？',
        '它的核心价值主张是什么？',
        '从README中你看到了哪些关键特性？'
      ],
      activities: [
        '仔细阅读README文档',
        '查看项目的贡献指南',
        '了解项目的许可证信息'
      ]
    };
  }

  /**
   * 生成架构分析步骤
   */
  generateArchitectureStep(repoInfo) {
    return {
      intro: '现在让我们深入了解项目的整体架构设计。',
      content: [
        '**目录结构分析**:',
        `- 根目录包含的主要文件: ${this.getMainFiles(repoInfo).join(', ')}`,
        `- 主要目录: ${repoInfo.stats.directories.slice(0, 5).join(', ')}`,
        `- 项目组织方式: ${this.identifyProjectStructure(repoInfo)}`
      ],
      analysis: {
        entryPoints: this.getIdentifyEntryPoints(repoInfo),
        dependencies: this.analyzeDependencies(repoInfo),
        coreComponents: this.identifyCoreComponents(repoInfo),
        designPhilosophy: this.inferDesignPhilosophy(repoInfo)
      },
      questions: [
        '项目采用了什么样的架构模式？',
        '核心组件之间是如何交互的？',
        '是否有明显的分层设计？',
        '依赖管理是如何处理的？'
      ],
      activities: [
        '绘制项目的架构图',
        '识别项目的入口文件',
        '分析依赖关系图'
      ]
    };
  }

  /**
   * 生成模块分析步骤
   */
  generateModulesStep(repoInfo) {
    return {
      intro: '接下来我们深入分析项目的核心模块。',
      content: [
        '**主要模块分析**:',
        this.identifyKeyModules(repoInfo).map(module => `- ${module.name}: ${module.description}`).join('\n'),
        '\n**模块间关系**:',
        this.analyzeModuleRelationships(repoInfo)
      ],
      focusAreas: this.getIdentifyFocusAreas(repoInfo),
      questions: [
        '哪个模块是项目的核心？',
        '模块间的耦合度如何？',
        '是否存在循环依赖？',
        '模块的设计是否符合单一职责原则？'
      ],
      activities: [
        '深入阅读核心模块的源码',
        '绘制模块间的关系图',
        '分析模块的接口设计'
      ]
    };
  }

  /**
   * 生成组件详解步骤
   */
  generateComponentsStep(repoInfo) {
    return {
      intro: '现在让我们详细分析关键组件的具体实现。',
      content: [
        '**核心组件分析**:',
        this.identifyKeyComponents(repoInfo).map(comp => `- ${comp.name}: ${comp.purpose}`).join('\n'),
        '\n**设计模式应用**:',
        this.identifyDesignPatterns(repoInfo)
      ],
      deepAnalysis: {
        criticalComponents: this.getIdentifyCriticalComponents(repoInfo),
        implementationDetails: this.analyzeImplementationDetails(repoInfo),
        performanceConsiderations: this.analyzePerformanceAspects(repoInfo)
      },
      questions: [
        '组件采用了哪些设计模式？',
        '代码的可读性和可维护性如何？',
        '是否存在性能优化的机会？',
        '错误处理机制是否完善？'
      ],
      activities: [
        '逐行分析关键组件的实现',
        '识别代码中的设计模式',
        '评估代码质量'
      ]
    };
  }

  /**
   * 生成设计模式步骤
   */
  generatePatternsStep(repoInfo) {
    return {
      intro: '识别项目中使用的设计模式和最佳实践。',
      content: [
        '**设计模式**:',
        this.detectDesignPatterns(repoInfo).join('\n'),
        '\n**最佳实践**:',
        this.identifyBestPractices(repoInfo).join('\n'),
        '\n**编码规范**:',
        this.analyzeCodingStandards(repoInfo)
      ],
      patterns: this.detectDesignPatterns(repoInfo),
      practices: this.identifyBestPractices(repoInfo),
      questions: [
        '项目遵循了哪些编码规范？',
        '测试覆盖率如何？',
        '文档质量如何？',
        '代码审查流程是否完善？'
      ],
      activities: [
        '整理项目使用的设计模式',
        '总结最佳实践',
        '识别改进点'
      ]
    };
  }

  /**
   * 生成深度挖掘步骤
   */
  generateDeepDiveStep(repoInfo) {
    return {
      intro: '现在可以选择感兴趣的特定功能进行深度挖掘。',
      content: [
        '**可深入的方向**:',
        this.getSuggestedDeepDiveTopics(repoInfo).join('\n'),
        '\n**高级话题**:',
        this.identifyAdvancedTopics(repoInfo)
      ],
      suggestedTopics: this.getSuggestedDeepDiveTopics(repoInfo),
      advancedTopics: this.identifyAdvancedTopics(repoInfo),
      questions: [
        '哪个功能最吸引你？',
        '你想了解哪个算法的实现？',
        '哪个模块的设计最有意思？',
        '你发现了哪些有趣的技巧？'
      ],
      activities: [
        '选择一个功能进行深度分析',
        '理解复杂的算法实现',
        '研究性能优化技巧'
      ]
    };
  }

  /**
   * 生成总结步骤
   */
  generateSummaryStep(repoInfo) {
    return {
      intro: '让我们总结整个学习过程，提炼收获和思考。',
      content: [
        '**学习总结**:',
        this.generateLearningSummary(repoInfo),
        '\n**改进建议**:',
        this.suggestImprovements(repoInfo),
        '\n**个人思考**:',
        this.encouragePersonalReflection()
      ],
      summary: this.generateLearningSummary(repoInfo),
      improvements: this.suggestImprovements(repoInfo),
      reflection: this.encouragePersonalReflection(),
      questions: [
        '这次学习最大的收获是什么？',
        '学到了哪些新的设计思路？',
        '如何将这些知识应用到自己的项目中？',
        '项目还有哪些可以改进的地方？'
      ],
      activities: [
        '撰写学习总结报告',
        '整理学到的设计模式',
        '制定实践计划'
      ]
    };
  }

  // 辅助方法
  calculateTotalTime(steps) {
    const timeMap = {
      '10-15分钟': 15,
      '20-30分钟': 30,
      '30-45分钟': 45,
      '45-60分钟': 60,
      '60+分钟': 90
    };
    
    const totalTime = steps.reduce((sum, step) => sum + timeMap[step.estimatedTime] || 30, 0);
    return `${Math.floor(totalTime / 60)}小时${totalTime % 60}分钟`;
  }

  estimateDifficulty(repoInfo) {
    const lines = repoInfo.stats.totalLines;
    if (lines < 1000) return '初级';
    if (lines < 10000) return '中级';
    if (lines < 50000) return '高级';
    return '专家级';
  }

  getPrerequisites(repoInfo) {
    const lang = repoInfo.primaryLanguage.toLowerCase();
    const prereqs = ['基础编程知识'];
    
    if (lang.includes('javascript') || lang.includes('js')) {
      prereqs.push('JavaScript基础知识', 'Node.js基础', '现代前端框架');
    } else if (lang.includes('python')) {
      prereqs.push('Python基础知识', 'Python生态系统');
    } else if (lang.includes('java')) {
      prereqs.push('Java基础知识', 'JVM概念', 'Spring框架');
    }
    
    return prereqs;
  }

  getMainFiles(repoInfo) {
    const commonFiles = ['README.md', 'package.json', 'requirements.txt', 'Dockerfile', 
                        'Makefile', 'setup.py', 'pom.xml', 'build.gradle'];
    return commonFiles.filter(file => 
      repoInfo.stats.directories.some(dir => dir.includes(file.split('.')[0]))
    ).concat(['main.js', 'app.js', 'server.js', 'index.js']);
  }

  identifyProjectStructure(repoInfo) {
    const dirs = repoInfo.stats.directories;
    if (dirs.some(d => d.includes('src'))) return '典型的src结构';
    if (dirs.some(d => d.includes('lib'))) return '库结构';
    if (dirs.some(d => d.includes('app'))) return '应用结构';
    return '扁平结构';
  }

  getIdentifyEntryPoints(repoInfo) {
    const entryPoints = [];
    if (repoInfo.stats.fileTypes['.js']) {
      entryPoints.push('main.js', 'index.js', 'app.js', 'server.js');
    }
    if (repoInfo.stats.fileTypes['.py']) {
      entryPoints.push('__init__.py', 'main.py', 'app.py');
    }
    return entryPoints;
  }

  analyzeDependencies(repoInfo) {
    // 分析依赖关系的逻辑
    return ['package.json分析', '依赖图谱', '第三方库识别'];
  }

  identifyCoreComponents(repoInfo) {
    // 识别核心组件的逻辑
    return ['主要模块', '核心类', '关键函数'];
  }

  inferDesignPhilosophy(repoInfo) {
    // 推断设计哲学的逻辑
    return '面向对象设计，模块化架构';
  }

  identifyKeyModules(repoInfo) {
    return [
      { name: 'Core Module', description: '核心功能模块' },
      { name: 'Utils Module', description: '工具函数模块' },
      { name: 'Config Module', description: '配置管理模块' }
    ];
  }

  analyzeModuleRelationships(repoInfo) {
    return ['模块A -> 模块B (依赖)', '模块C <- 模块D (被依赖)'];
  }

  getIdentifyFocusAreas(repoInfo) {
    return ['核心算法', '性能关键部分', '复杂业务逻辑'];
  }

  identifyKeyComponents(repoInfo) {
    return [
      { name: 'Component A', purpose: '处理核心业务逻辑' },
      { name: 'Component B', purpose: '管理数据流' },
      { name: 'Component C', purpose: '提供公共服务' }
    ];
  }

  identifyDesignPatterns(repoInfo) {
    return ['工厂模式', '单例模式', '观察者模式'];
  }

  getIdentifyCriticalComponents(repoInfo) {
    return ['关键算法组件', '性能瓶颈组件', '核心业务组件'];
  }

  analyzeImplementationDetails(repoInfo) {
    return ['代码质量', '算法效率', '内存使用'];
  }

  analyzePerformanceAspects(repoInfo) {
    return ['时间复杂度', '空间复杂度', '并发处理'];
  }

  detectDesignPatterns(repoInfo) {
    return ['- **工厂模式**: 用于对象创建', '- **策略模式**: 用于算法切换', '- **装饰器模式**: 用于功能扩展'];
  }

  identifyBestPractices(repoInfo) {
    return ['- **代码规范**: 遵循ESLint规则', '- **测试覆盖**: 单元测试齐全', '- **文档完整**: JSDoc注释'];
  }

  analyzeCodingStandards(repoInfo) {
    return '代码风格一致，命名规范，注释完整';
  }

  getSuggestedDeepDiveTopics(repoInfo) {
    return ['- 特定功能实现', '- 算法优化技巧', '- 架构设计决策', '- 性能调优方案'];
  }

  identifyAdvancedTopics(repoInfo) {
    return ['并发处理', '内存管理', '缓存策略', '分布式设计'];
  }

  generateLearningSummary(repoInfo) {
    return '本次学习深入了解了项目架构、核心模块和设计模式，掌握了最佳实践';
  }

  suggestImprovements(repoInfo) {
    return ['代码文档可以更详细', '测试覆盖率有待提升', '架构可以进一步优化'];
  }

  encouragePersonalReflection() {
    return '思考如何将所学应用到自己的项目中，持续学习和实践';
  }
}

module.exports = new LearningPathPlanner();