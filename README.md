# GitHub源码学习助手

根据GitHub链接和代码仓库，提供由浅入深、从架构到细节的交互式源码学习和设计思想分析，并支持将学习笔记转换成不同平台的文章。

## 功能特性

### 源码分析
- **仓库解析**: 自动解析GitHub仓库结构和内容
- **架构分析**: 深入分析项目整体架构设计
- **模块分解**: 逐步分解各个功能模块
- **组件详解**: 详细分析关键组件实现

### 学习路径
- **层次化学习**: 从架构到细节的渐进式学习路径
- **交互式问答**: 通过问答互动加深理解
- **进度跟踪**: 完整的学习进度管理
- **知识点梳理**: 系统化的知识整理

### 笔记管理
- **专业目录**: 为每个仓库创建专属学习笔记目录
- **智能分类**: 自动分类不同类型的学习笔记
- **全文检索**: 支持笔记内容搜索和查找
- **版本控制**: 学习笔记的版本管理

### 内容导出
- **多格式支持**: 支持多种输出格式（Markdown、Blog、Article等）
- **自动转换**: 一键将学习笔记转换为专业文章
- **平台适配**: 针对不同平台优化输出格式
- **质量保证**: 保持内容的准确性和专业性

## 安装

### 使用npx安装
```bash
npx skills add https://github.com/adcwangfeng/github-source-learning
```

### 手动安装
```bash
git clone https://github.com/adcwangfeng/github-source-learning.git
cd github-source-learning
npm install
```

## 配置

此技能需要GitHub API访问权限以获取仓库信息。建议配置GitHub Token以获得更高的API限制：

```bash
export GITHUB_TOKEN=your_github_token_here
```

## 使用方法

### 基础用法
```javascript
const GithubSourceLearningAssistant = require('openclaw-github-source-learning');

// 初始化助手
const assistant = new GithubSourceLearningAssistant();

// 开始学习一个GitHub仓库
const result = await assistant.startLearning('https://github.com/owner/repo');
console.log(result.message);

// 获取下一步学习内容
const nextStep = await assistant.getNextStep(result.sessionId);
console.log(nextStep.message);

// 添加学习笔记
await assistant.addNote(result.sessionId, '学习心得和发现...');

// 问答交互
const answer = await assistant.askQuestion(result.sessionId, '这个项目用了什么设计模式？');

// 导出学习笔记
const exportResult = await assistant.exportNotes(result.sessionId, 'blog-md');
console.log(exportResult.message);
```

### 命令示例
- `开始学习 https://github.com/owner/repo` - 开始分析指定仓库
- `下一步` - 获取下一个学习步骤
- `记录笔记 这个项目使用了工厂模式...` - 添加学习笔记
- `问 项目的核心模块是什么？` - 问答交互
- `导出笔记` - 导出学习成果为文章

## 文件结构

```
github-source-learning/
├── index.js                 # 主入口文件
├── github-parser.js         # GitHub仓库解析器
├── learning-path.js         # 学习路径规划器
├── note-manager.js          # 学习笔记管理器
├── exporter.js              # 笔记导出转换器
├── qa-helper.js             # 问答交互助手
├── utils.js                 # 工具函数
├── config.json              # 配置文件
├── SKILL.md                 # 技能描述
├── README.md                # 项目文档
├── install.sh               # 安装脚本
└── package.json             # npm包配置
```

## 示例

### 学习一个项目
```
用户: "帮我分析 https://github.com/vuejs/vue 的架构设计"
系统: "仓库分析完成！vue项目包含1200个文件，50000行代码。让我们从架构层面开始学习吧！"
```

### 添加学习笔记
```
用户: "记录：Vue采用了响应式设计模式"
系统: "笔记已保存到vue项目的学习目录中"
```

### 导出学习成果
```
用户: "将我的vue项目学习笔记导出为博客文章"
系统: "笔记已导出为blog-md格式: exports/vue_learning_notes_20240131.md"
```

## 安全考虑

- 所有敏感数据本地存储
- GitHub Token安全处理
- 输入验证和清理
- 防止路径遍历攻击

## 贡献

欢迎贡献！请提交Pull Request或开Issue。

## 许可证

MIT License