/**
 * GitHub仓库解析器
 * 负责解析GitHub仓库的结构和内容
 */

const axios = require('axios');
const path = require('path');

class GithubParser {
  constructor() {
    this.githubApiUrl = 'https://api.github.com';
    this.token = process.env.GITHUB_TOKEN;
  }

  /**
   * 解析GitHub仓库
   */
  async parseRepository(githubUrl) {
    try {
      const repoInfo = this.extractRepoInfo(githubUrl);
      
      // 获取仓库基本信息
      const repoDetails = await this.getRepositoryDetails(repoInfo.owner, repoInfo.repo);
      
      // 获取仓库内容结构
      const tree = await this.getRepositoryTree(repoInfo.owner, repoInfo.repo, repoInfo.ref);
      
      // 分析仓库统计信息
      const stats = await this.analyzeRepositoryStats(tree.tree);
      
      // 获取README
      const readme = await this.getReadme(repoInfo.owner, repoInfo.repo, repoInfo.ref);
      
      // 获取主要编程语言
      const languages = await this.getLanguages(repoInfo.owner, repoInfo.repo);
      
      return {
        url: githubUrl,
        owner: repoInfo.owner,
        repo: repoInfo.repo,
        ref: repoInfo.ref,
        name: repoDetails.name,
        description: repoDetails.description,
        stars: repoDetails.stargazers_count,
        forks: repoDetails.forks_count,
        language: repoDetails.language,
        primaryLanguage: Object.keys(languages)[0] || 'Unknown',
        languages: languages,
        stats: stats,
        readme: readme,
        updatedAt: repoDetails.updated_at,
        createdAt: repoDetails.created_at,
        hasWiki: repoDetails.has_wiki,
        hasIssues: repoDetails.has_issues,
        hasProjects: repoDetails.has_projects
      };
    } catch (error) {
      console.error('❌ GitHub仓库解析失败:', error);
      throw error;
    }
  }

  /**
   * 从URL提取仓库信息
   */
  extractRepoInfo(url) {
    const regex = /github\.com\/([^\/]+)\/([^\/]+)(?:\/tree\/([^\/]+))?/;
    const match = url.match(regex);
    
    if (!match) {
      throw new Error('Invalid GitHub URL format');
    }
    
    return {
      owner: match[1],
      repo: match[2],
      ref: match[3] || 'main' // 默认使用main分支
    };
  }

  /**
   * 获取仓库详情
   */
  async getRepositoryDetails(owner, repo) {
    const response = await axios.get(`${this.githubApiUrl}/repos/${owner}/${repo}`, {
      headers: {
        'Authorization': this.token ? `token ${this.token}` : '',
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    return response.data;
  }

  /**
   * 获取仓库文件树
   */
  async getRepositoryTree(owner, repo, ref = 'main') {
    const response = await axios.get(`${this.githubApiUrl}/repos/${owner}/${repo}/git/trees/${ref}?recursive=1`, {
      headers: {
        'Authorization': this.token ? `token ${this.token}` : '',
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    return response.data;
  }

  /**
   * 获取README文件
   */
  async getReadme(owner, repo, ref = 'main') {
    try {
      const response = await axios.get(`${this.githubApiUrl}/repos/${owner}/${repo}/contents/README.md`, {
        headers: {
          'Authorization': this.token ? `token ${this.token}` : '',
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      
      if (response.data && response.data.content) {
        const content = Buffer.from(response.data.content, 'base64').toString('utf8');
        return content;
      }
    } catch (error) {
      // README可能不存在
      console.warn('⚠️ README.md not found');
    }
    
    return '';
  }

  /**
   * 获取仓库编程语言
   */
  async getLanguages(owner, repo) {
    try {
      const response = await axios.get(`${this.githubApiUrl}/repos/${owner}/${repo}/languages`, {
        headers: {
          'Authorization': this.token ? `token ${this.token}` : '',
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.warn('⚠️ Languages info not available');
      return {};
    }
  }

  /**
   * 分析仓库统计信息
   */
  async analyzeRepositoryStats(tree) {
    const stats = {
      totalFiles: 0,
      totalDirectories: 0,
      totalLines: 0,
      fileTypes: {},
      directories: new Set(),
      largestFiles: [],
      mainLanguages: []
    };

    const fileAnalysis = [];
    
    for (const item of tree) {
      if (item.type === 'blob') {
        stats.totalFiles++;
        
        // 统计文件类型
        const ext = path.extname(item.path).toLowerCase();
        if (ext) {
          stats.fileTypes[ext] = (stats.fileTypes[ext] || 0) + 1;
        }
        
        // 记录目录
        const dir = path.dirname(item.path);
        if (dir !== '.') {
          stats.directories.add(dir);
        }
        
        // 模拟行数统计（实际需要下载文件内容）
        const sizeEstimate = Math.floor(item.size / 50); // 估算行数
        stats.totalLines += sizeEstimate;
        
        fileAnalysis.push({
          path: item.path,
          size: item.size,
          estimatedLines: sizeEstimate,
          extension: ext
        });
      } else if (item.type === 'tree') {
        stats.totalDirectories++;
      }
    }

    // 找出最大的文件
    stats.largestFiles = fileAnalysis
      .sort((a, b) => b.size - a.size)
      .slice(0, 10)
      .map(file => ({
        path: file.path,
        size: file.size,
        estimatedLines: file.estimatedLines
      }));

    // 找出主要编程语言
    const sortedFileTypes = Object.entries(stats.fileTypes)
      .sort(([,a], [,b]) => b - a);
    
    stats.mainLanguages = sortedFileTypes.slice(0, 5).map(([ext, count]) => ({ ext, count }));

    stats.directories = Array.from(stats.directories);
    
    return stats;
  }
}

module.exports = new GithubParser();