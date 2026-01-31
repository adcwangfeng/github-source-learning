---
name: GitHub源码学习助手
description: 根据GitHub链接和代码仓库，提供由浅入深、从架构到细节的交互式源码学习和设计思想分析，并支持将学习笔记转换成不同平台的文章及自动化社交媒体推送
dependencies:
  - node.js
  - git
  - github-api
  - twitter-api-v2
---

# GitHub源码学习助手

## Description
根据GitHub链接和代码仓库，提供由浅入深、从架构到细节的交互式源码学习和设计思想分析，并支持将学习笔记转换成不同平台的文章。

## Capabilities
- 解析GitHub仓库结构和代码组织
- 提供层次化的源码学习路径（架构→模块→组件→函数）
- 交互式问答辅助理解源码设计思想
- 生成详细的学习笔记和分析报告
- 创建专业目录存储学习笔记
- 支持将笔记转换为博客文章、技术分享等内容
- 提供代码质量分析和最佳实践建议

## Usage
- 输入GitHub仓库URL开始学习
- 按照引导逐步深入理解源码
- 通过问答互动澄清疑惑
- 保存学习笔记到专属目录
- 导出笔记为不同格式的文章

## Example Usage Scenarios
- **源码阅读**: 深入理解开源项目的架构设计
- **技术学习**: 通过优秀项目学习编程模式和架构思想
- **知识整理**: 系统化整理源码学习成果
- **技术分享**: 将学习心得转化为分享文章

## Example Commands
- "帮我分析这个GitHub仓库的架构设计"
- "从整体架构开始，逐步解释这个项目的实现"
- "深入分析某个模块的具体实现"
- "总结这个项目的设计模式和最佳实践"
- "将我的学习笔记转换为技术博客"

## Files
- `index.js`: 主入口文件
- `github-parser.js`: GitHub仓库解析器
- `learning-path.js`: 学习路径规划器
- `note-manager.js`: 学习笔记管理器
- `exporter.js`: 笔记导出转换器
- `qa-helper.js`: 问答交互助手
- `config.json`: 配置文件
- `utils.js`: 工具函数

## Dependencies
- Node.js >= 14.0.0
- Git client
- GitHub API access

## Configuration
The skill requires GitHub API access for repository analysis.