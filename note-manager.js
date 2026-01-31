/**
 * 学习笔记管理器
 * 负责管理学习笔记的存储和检索
 */

const fs = require('fs').promises;
const path = require('path');
const { mkdir, writeFile, readFile, readdir } = require('fs').promises;

class NoteManager {
  constructor() {
    this.notesDir = path.join(process.cwd(), 'learning-notes');
  }

  /**
   * 初始化笔记目录
   */
  async initialize() {
    try {
      await mkdir(this.notesDir, { recursive: true });
      console.log(`✅ 笔记目录已创建: ${this.notesDir}`);
    } catch (error) {
      console.error('❌ 笔记目录创建失败:', error);
      throw error;
    }
  }

  /**
   * 保存笔记
   */
  async saveNote(repoName, note) {
    try {
      // 创建仓库专用的笔记目录
      const repoDir = path.join(this.notesDir, this.sanitizeFileName(repoName));
      await mkdir(repoDir, { recursive: true });

      // 生成笔记文件名
      const fileName = `${this.generateNoteFileName(note)}.md`;
      const filePath = path.join(repoDir, fileName);

      // 准备笔记内容
      const content = this.formatNoteContent(note);

      // 写入文件
      await writeFile(filePath, content, 'utf8');

      console.log(`✅ 笔记已保存: ${filePath}`);

      return {
        success: true,
        filePath,
        fileName
      };
    } catch (error) {
      console.error('❌ 笔记保存失败:', error);
      throw error;
    }
  }

  /**
   * 获取特定仓库的所有笔记
   */
  async getNotes(repoName) {
    try {
      const repoDir = path.join(this.notesDir, this.sanitizeFileName(repoName));
      
      if (!(await this.exists(repoDir))) {
        return [];
      }

      const files = await readdir(repoDir);
      const noteFiles = files.filter(file => file.endsWith('.md'));

      const notes = [];
      for (const file of noteFiles) {
        const filePath = path.join(repoDir, file);
        const content = await readFile(filePath, 'utf8');
        
        notes.push({
          fileName: file,
          filePath,
          content,
          lastModified: (await fs.stat(filePath)).mtime
        });
      }

      // 按修改时间排序
      notes.sort((a, b) => b.lastModified - a.lastModified);

      return notes;
    } catch (error) {
      console.error('❌ 笔记读取失败:', error);
      return [];
    }
  }

  /**
   * 获取仓库列表
   */
  async getRepoList() {
    try {
      if (!(await this.exists(this.notesDir))) {
        return [];
      }

      const items = await readdir(this.notesDir);
      const repos = [];

      for (const item of items) {
        const itemPath = path.join(this.notesDir, item);
        const stat = await fs.stat(itemPath);
        
        if (stat.isDirectory()) {
          const noteFiles = await readdir(itemPath);
          const notesCount = noteFiles.filter(f => f.endsWith('.md')).length;
          
          repos.push({
            name: item,
            path: itemPath,
            notesCount,
            lastUpdated: stat.mtime
          });
        }
      }

      return repos;
    } catch (error) {
      console.error('❌ 仓库列表获取失败:', error);
      return [];
    }
  }

  /**
   * 搜索笔记
   */
  async searchNotes(query, repoName = null) {
    try {
      const repos = repoName ? [repoName] : (await this.getRepoList()).map(r => r.name);
      const results = [];

      for (const repo of repos) {
        const notes = await this.getNotes(repo);
        
        for (const note of notes) {
          if (note.content.toLowerCase().includes(query.toLowerCase())) {
            results.push({
              repo,
              ...note,
              snippet: this.extractSnippet(note.content, query)
            });
          }
        }
      }

      return results;
    } catch (error) {
      console.error('❌ 笔记搜索失败:', error);
      return [];
    }
  }

  /**
   * 删除笔记
   */
  async deleteNote(repoName, fileName) {
    try {
      const repoDir = path.join(this.notesDir, this.sanitizeFileName(repoName));
      const filePath = path.join(repoDir, fileName);

      if (await this.exists(filePath)) {
        await fs.unlink(filePath);
        console.log(`✅ 笔记已删除: ${filePath}`);
        return { success: true };
      } else {
        return { success: false, error: '笔记文件不存在' };
      }
    } catch (error) {
      console.error('❌ 笔记删除失败:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 导出仓库笔记
   */
  async exportRepoNotes(repoName, format = 'markdown') {
    try {
      const notes = await this.getNotes(repoName);
      const repoDir = path.join(this.notesDir, this.sanitizeFileName(repoName));

      if (notes.length === 0) {
        throw new Error('该仓库没有笔记');
      }

      const exportDir = path.join(repoDir, 'exports');
      await mkdir(exportDir, { recursive: true });

      const exportFileName = `${repoName}_notes_export_${new Date().toISOString().split('T')[0]}`;
      let exportFilePath;

      switch (format.toLowerCase()) {
        case 'markdown':
        case 'md':
          exportFilePath = path.join(exportDir, `${exportFileName}.md`);
          const markdownContent = this.combineNotesToMarkdown(notes);
          await writeFile(exportFilePath, markdownContent, 'utf8');
          break;
          
        case 'json':
          exportFilePath = path.join(exportDir, `${exportFileName}.json`);
          const jsonContent = JSON.stringify(notes, null, 2);
          await writeFile(exportFilePath, jsonContent, 'utf8');
          break;
          
        default:
          throw new Error('不支持的导出格式');
      }

      return {
        success: true,
        exportPath: exportFilePath,
        format,
        noteCount: notes.length
      };
    } catch (error) {
      console.error('❌ 笔记导出失败:', error);
      throw error;
    }
  }

  // 辅助方法
  sanitizeFileName(name) {
    return name.replace(/[^a-zA-Z0-9-_]/g, '_');
  }

  generateNoteFileName(note) {
    const timestamp = new Date(note.timestamp).toISOString().replace(/[:.]/g, '-');
    const prefix = note.type === 'qa' ? 'QA' : 'NOTE';
    const id = note.id ? note.id.substring(0, 8) : 'unknown';
    
    return `${prefix}_${timestamp}_${id}`;
  }

  formatNoteContent(note) {
    let content = `# ${note.type === 'qa' ? 'Q&A 记录' : '学习笔记'}\n\n`;
    
    content += `**时间**: ${new Date(note.timestamp).toLocaleString('zh-CN')}\n\n`;

    if (note.type === 'qa') {
      content += `## 问题\n\n${note.question}\n\n`;
      content += `## 回答\n\n${note.answer}\n\n`;
      if (note.relatedFiles && note.relatedFiles.length > 0) {
        content += `## 相关文件\n\n`;
        content += note.relatedFiles.map(file => `- ${file}`).join('\n');
        content += '\n\n';
      }
    } else {
      content += `## 内容\n\n${note.content}\n\n`;
    }

    content += `---\n*此笔记由 GitHub 源码学习助手自动生成*\n`;

    return content;
  }

  combineNotesToMarkdown(notes) {
    let combinedContent = '# 源码学习笔记汇总\n\n';
    
    for (const note of notes) {
      combinedContent += note.content;
      combinedContent += '\n\n---\n\n';
    }

    return combinedContent;
  }

  extractSnippet(content, query) {
    const lowerContent = content.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerContent.indexOf(lowerQuery);
    
    if (index === -1) return '';

    const start = Math.max(0, index - 50);
    const end = Math.min(content.length, index + query.length + 50);
    const snippet = content.substring(start, end);
    
    return snippet.trim();
  }

  async exists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = new NoteManager();