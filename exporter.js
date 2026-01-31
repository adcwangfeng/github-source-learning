/**
 * 笔记导出器
 * 负责将学习笔记转换为不同格式的文章
 */

const fs = require('fs').promises;
const path = require('path');

class Exporter {
  constructor() {
    this.supportedFormats = [
      'markdown',
      'blog-md',
      'article',
      'technical-post',
      'summary',
      'json',
      'newsletter',
      'presentation'
    ];
  }

  /**
   * 导出笔记到指定格式
   */
  async export(notes, repoInfo, format = 'markdown') {
    if (!this.supportedFormats.includes(format)) {
      throw new Error(`不支持的导出格式: ${format}. 支持的格式: ${this.supportedFormats.join(', ')}`);
    }

    const content = await this.generateContent(notes, repoInfo, format);
    const fileName = this.generateFileName(repoInfo, format);
    const filePath = path.join(process.cwd(), 'exports', fileName);

    // 确保导出目录存在
    await fs.mkdir(path.dirname(filePath), { recursive: true });

    // 写入文件
    await fs.writeFile(filePath, content, 'utf8');

    return {
      filePath,
      format,
      fileName,
      contentLength: content.length
    };
  }

  /**
   * 生成内容
   */
  async generateContent(notes, repoInfo, format) {
    switch (format) {
      case 'markdown':
        return this.toMarkdown(notes, repoInfo);
      case 'blog-md':
        return this.toBlogMarkdown(notes, repoInfo);
      case 'article':
        return this.toArticle(notes, repoInfo);
      case 'technical-post':
        return this.toTechnicalPost(notes, repoInfo);
      case 'summary':
        return this.toSummary(notes, repoInfo);
      case 'json':
        return this.toJSON(notes, repoInfo);
      case 'newsletter':
        return this.toNewsletter(notes, repoInfo);
      case 'presentation':
        return this.toPresentation(notes, repoInfo);
      default:
        return this.toMarkdown(notes, repoInfo);
    }
  }

  /**
   * 转换为Markdown格式
   */
  toMarkdown(notes, repoInfo) {
    let md = `# ${repoInfo.name} 源码学习笔记\n\n`;
    md += `> 仓库: [${repoInfo.url}](${repoInfo.url})\n\n`;
    md += `**描述**: ${repoInfo.description || '暂无描述'}\n\n`;
    md += `**统计数据**: ${repoInfo.stats.totalFiles} 个文件, ${repoInfo.stats.totalLines} 行代码, 主要语言: ${repoInfo.primaryLanguage}\n\n`;

    for (const note of notes) {
      md += note.content;
      md += '\n\n---\n\n';
    }

    return md;
  }

  /**
   * 转换为博客Markdown格式
   */
  toBlogMarkdown(notes, repoInfo) {
    const frontmatter = `---
title: "${repoInfo.name} 源码解读与架构分析"
date: "${new Date().toISOString().split('T')[0]}"
tags: ["源码分析", "架构设计", "${repoInfo.primaryLanguage}", "GitHub"]
categories: ["技术分享", "源码解读"]
description: "深入分析 ${repoInfo.name} 项目的架构设计、核心模块和技术实现"
---

`;

    let content = frontmatter;
    content += `# ${repoInfo.name} 源码解读与架构分析\n\n`;
    content += `本文是对 [${repoInfo.name}](${repoInfo.url}) 项目的深度源码分析，带你了解其架构设计、核心实现和最佳实践。\n\n`;

    content += `## 项目概况\n\n`;
    content += `- **仓库地址**: [${repoInfo.url}](${repoInfo.url})\n`;
    content += `- **项目描述**: ${repoInfo.description || '暂无描述'}\n`;
    content += `- **Star数**: ${repoInfo.stars.toLocaleString()}\n`;
    content += `- **文件数量**: ${repoInfo.stats.totalFiles}\n`;
    content += `- **代码行数**: ${repoInfo.stats.totalLines.toLocaleString()}\n`;
    content += `- **主要语言**: ${repoInfo.primaryLanguage}\n\n`;

    content += `## 学习历程\n\n`;
    content += `通过对该项目的深入学习，我总结了以下要点：\n\n`;

    for (const note of notes) {
      content += note.content;
      content += '\n\n';
    }

    content += `\n## 总结与思考\n\n`;
    content += `通过对 ${repoInfo.name} 项目的学习，我对 ${repoInfo.primaryLanguage} 项目架构有了更深的理解，特别是在以下几个方面：\n\n`;
    content += `- 架构设计理念\n`;
    content += `- 模块化组织方式\n`;
    content += `- 设计模式应用\n`;
    content += `- 最佳实践运用\n\n`;
    content += `这些经验对我今后的项目开发具有重要的参考价值。\n\n`;

    return content;
  }

  /**
   * 转换为技术文章格式
   */
  toArticle(notes, repoInfo) {
    let article = `# ${repoInfo.name} 技术深度解析\n\n`;
    article += `**发布时间**: ${new Date().toLocaleDateString('zh-CN')}\n`;
    article += `**作者**: GitHub源码学习助手\n\n`;

    article += `## 项目背景\n\n`;
    article += `${repoInfo.description || '暂无描述'}\n\n`;

    article += `## 技术栈分析\n\n`;
    article += `- **主要语言**: ${repoInfo.primaryLanguage}\n`;
    article += `- **文件统计**: ${repoInfo.stats.totalFiles} 个文件\n`;
    article += `- **代码量**: ${repoInfo.stats.totalLines.toLocaleString()} 行\n\n`;

    article += `## 架构设计解读\n\n`;
    
    for (const note of notes) {
      article += note.content;
      article += '\n\n';
    }

    article += `## 核心亮点\n\n`;
    article += `1. 优秀的架构设计\n`;
    article += `2. 清晰的代码组织\n`;
    article += `3. 完善的最佳实践\n\n`;

    article += `## 学习建议\n\n`;
    article += `对于想学习此类项目的开发者，建议：\n`;
    article += `- 从整体架构入手\n`;
    article += `- 关注设计模式应用\n`;
    article += `- 重视代码质量意识\n\n`;

    return article;
  }

  /**
   * 转换为技术帖子格式
   */
  toTechnicalPost(notes, repoInfo) {
    let post = `# 【源码解读】${repoInfo.name} - 深度解析\n\n`;
    post += `[GitHub项目地址](${repoInfo.url})\n\n`;

    post += `## 项目概览\n\n`;
    post += `**项目名称**: ${repoInfo.name}\n`;
    post += `**项目描述**: ${repoInfo.description || '暂无描述'}\n`;
    post += `**Star/Fork**: ${repoInfo.stars}/${repoInfo.forks}\n`;
    post += `**技术栈**: ${repoInfo.primaryLanguage}\n\n`;

    post += `## 学习收获\n\n`;
    post += `通过深入学习这个项目，我获得了以下收获：\n\n`;

    for (const note of notes) {
      post += note.content;
      post += '\n\n';
    }

    post += `## 推荐理由\n\n`;
    post += `如果你对 ${repoInfo.primaryLanguage} 或 ${repoInfo.primaryLanguage} 项目架构感兴趣，强烈推荐学习这个项目：\n\n`;
    post += `- 代码质量高\n`;
    post += `- 架构设计优秀\n`;
    post += `- 最佳实践丰富\n\n`;

    post += `## 总结\n\n`;
    post += `通过对 ${repoInfo.name} 的学习，不仅提升了我的 ${repoInfo.primaryLanguage} 技能，更重要的是学会了如何设计高质量的项目架构。\n\n`;

    return post;
  }

  /**
   * 转换为摘要格式
   */
  toSummary(notes, repoInfo) {
    let summary = `# ${repoInfo.name} 学习总结\n\n`;
    summary += `**学习时间**: ${new Date().toLocaleString('zh-CN')}\n\n`;

    summary += `## 项目信息\n\n`;
    summary += `- **名称**: ${repoInfo.name}\n`;
    summary += `- **描述**: ${repoInfo.description || '暂无描述'}\n`;
    summary += `- **规模**: ${repoInfo.stats.totalFiles} 文件, ${repoInfo.stats.totalLines} 行代码\n`;
    summary += `- **语言**: ${repoInfo.primaryLanguage}\n\n`;

    summary += `## 关键发现\n\n`;
    const keyInsights = this.extractKeyInsights(notes);
    keyInsights.forEach(insight => {
      summary += `- ${insight}\n`;
    });
    summary += '\n';

    summary += `## 技术亮点\n\n`;
    const techHighlights = this.extractTechHighlights(notes);
    techHighlights.forEach(highlight => {
      summary += `- ${highlight}\n`;
    });
    summary += '\n';

    summary += `## 学习心得\n\n`;
    summary += this.generateLearningReflection(notes, repoInfo);

    return summary;
  }

  /**
   * 转换为JSON格式
   */
  toJSON(notes, repoInfo) {
    const exportData = {
      repoInfo: {
        name: repoInfo.name,
        url: repoInfo.url,
        description: repoInfo.description,
        stats: repoInfo.stats,
        primaryLanguage: repoInfo.primaryLanguage,
        stars: repoInfo.stars,
        forks: repoInfo.forks,
        updatedAt: repoInfo.updatedAt
      },
      learningNotes: notes,
      exportTime: new Date().toISOString(),
      totalNotes: notes.length
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * 转换为新闻简报格式
   */
  toNewsletter(notes, repoInfo) {
    let newsletter = `# 技术简报 | ${repoInfo.name} 源码解读\n\n`;
    newsletter += `*发布于 ${new Date().toLocaleDateString('zh-CN')}*\n\n`;

    newsletter += `## 📚 今日学习\n\n`;
    newsletter += `今天深入学习了 [${repoInfo.name}](${repoInfo.url}) 项目，这是一个 ${repoInfo.description || '优秀的开源项目'}。\n\n`;

    newsletter += `### 📊 项目数据\n\n`;
    newsletter += `- **文件数量**: ${repoInfo.stats.totalFiles}\n`;
    newsletter += `- **代码行数**: ${repoInfo.stats.totalLines.toLocaleString()}\n`;
    newsletter += `- **主要语言**: ${repoInfo.primaryLanguage}\n`;
    newsletter += `- **社区热度**: ${repoInfo.stars} ⭐\n\n`;

    newsletter += `## 🎯 学习重点\n\n`;
    const keyPoints = this.extractKeyInsights(notes).slice(0, 5);
    keyPoints.forEach(point => {
      newsletter += `- ${point}\n`;
    });
    newsletter += '\n';

    newsletter += `## 💡 技术洞察\n\n`;
    for (const note of notes.slice(0, 3)) { // 只选取前3个要点
      newsletter += `**${note.fileName}**:\n`;
      const lines = note.content.split('\n').slice(0, 5);
      newsletter += lines.join('\n') + '\n\n';
    }

    newsletter += `## 📝 总结\n\n`;
    newsletter += `通过对 ${repoInfo.name} 的学习，我深刻体会到了优秀项目架构的重要性。值得借鉴的地方包括：${this.extractKeyInsights(notes).slice(0, 3).join('、')}。\n\n`;

    return newsletter;
  }

  /**
   * 转换为演示文稿格式
   */
  toPresentation(notes, repoInfo) {
    let presentation = `# ${repoInfo.name}\n`;
    presentation += `## 源码学习与架构分析\n\n`;
    presentation += `### 项目概述\n\n`;
    presentation += `- **项目名称**: ${repoInfo.name}\n`;
    presentation += `- **项目描述**: ${repoInfo.description || '暂无描述'}\n`;
    presentation += `- **主要语言**: ${repoInfo.primaryLanguage}\n`;
    presentation += `- **项目规模**: ${repoInfo.stats.totalFiles} 文件\n\n`;

    presentation += `### 学习历程\n\n`;
    presentation += '通过以下步骤深入学习：\n\n';
    presentation += '- 项目概览分析\n';
    presentation += '- 架构设计解读\n';
    presentation += '- 模块功能剖析\n';
    presentation += '- 代码实现研究\n\n';

    presentation += `### 关键发现\n\n`;
    const keyInsights = this.extractKeyInsights(notes).slice(0, 5);
    keyInsights.forEach(insight => {
      presentation += `- ${insight}\n`;
    });
    presentation += '\n';

    presentation += `### 技术亮点\n\n`;
    const techHighlights = this.extractTechHighlights(notes).slice(0, 5);
    techHighlights.forEach(highlight => {
      presentation += `- ${highlight}\n`;
    });
    presentation += '\n';

    presentation += `### 学习总结\n\n`;
    presentation += `本次学习收获：\n`;
    presentation += `- 深入理解了${repoInfo.primaryLanguage}项目架构\n`;
    presentation += `- 学习了优秀的设计模式应用\n`;
    presentation += `- 掌握了最佳实践方法\n\n`;

    return presentation;
  }

  /**
   * 获取支持的格式列表
   */
  getSupportedFormats() {
    return [...this.supportedFormats];
  }

  /**
   * 生成文件名
   */
  generateFileName(repoInfo, format) {
    const cleanName = repoInfo.name.replace(/[^a-zA-Z0-9-_]/g, '_');
    const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
    
    const extensions = {
      'markdown': '.md',
      'blog-md': '.md',
      'article': '.md',
      'technical-post': '.md',
      'summary': '.md',
      'json': '.json',
      'newsletter': '.md',
      'presentation': '.md'
    };

    return `${cleanName}_${format}_${timestamp}${extensions[format] || '.txt'}`;
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
    });
    
    if (insights.length === 0) {
      insights.push('项目整体架构设计', '代码组织方式', '技术选型思路');
    }
    
    return [...new Set(insights)]; // 去重
  }

  extractTechHighlights(notes) {
    const highlights = [];
    notes.forEach(note => {
      if (note.content.includes('工厂')) highlights.push('工厂模式实现');
      if (note.content.includes('单例')) highlights.push('单例模式应用');
      if (note.content.includes('策略')) highlights.push('策略模式运用');
      if (note.content.includes('观察者')) highlights.push('观察者模式实现');
    });
    
    if (highlights.length === 0) {
      highlights.push('良好的代码结构', '清晰的模块划分', '规范的命名约定');
    }
    
    return [...new Set(highlights)]; // 去重
  }

  generateLearningReflection(notes, repoInfo) {
    return `通过学习 ${repoInfo.name} 项目，我深刻认识到优秀项目架构的重要性。该项目在 ${repoInfo.primaryLanguage} 项目开发方面提供了很好的参考，特别是在架构设计、代码组织和最佳实践方面。这些经验对我今后的开发工作具有重要的指导意义。`;
  }
}

module.exports = new Exporter();