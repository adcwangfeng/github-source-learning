#!/bin/bash

# GitHub源码学习助手安装脚本
echo "🔧 安装GitHub源码学习助手..."

# 检查Node.js环境
echo "📋 检查Node.js环境..."
if ! [ -x "$(command -v node)" ]; then
  echo "❌ 错误: node 未安装" >&2
  exit 1
else
  echo "✅ Node.js 已安装: $(node --version)"
fi

# 检查npm
if ! [ -x "$(command -v npm)" ]; then
  echo "❌ 错误: npm 未安装" >&2
  exit 1
else
  echo "✅ npm 已安装: $(npm --version)"
fi

# 检查git
if ! [ -x "$(command -v git)" ]; then
  echo "⚠️ 警告: git 未安装，某些功能可能受限" >&2
else
  echo "✅ Git 已安装: $(git --version)"
fi

# 创建必要的目录
echo "📁 创建目录结构..."
mkdir -p /Users/wangfeng/.openclaw/skills/github-source-learning

# 检查并创建package.json（如果不存在）
if [ ! -f "package.json" ]; then
    echo "📦 创建package.json..."
    cat > package.json << EOF
{
  "name": "openclaw-github-source-learning",
  "version": "1.0.0",
  "description": "OpenClaw skill for interactive GitHub source code learning and analysis",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [
    "openclaw",
    "github",
    "source-code",
    "learning",
    "analysis",
    "education"
  ],
  "author": "OpenClaw User",
  "license": "MIT",
  "dependencies": {
    "axios": "^1.0.0"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/adcwangfeng/github-source-learning.git"
  },
  "bugs": {
    "url": "https://github.com/adcwangfeng/github-source-learning/issues"
  },
  "homepage": "https://github.com/adcwangfeng/github-source-learning#readme"
}
EOF
fi

# 安装依赖
echo "📦 安装依赖..."
npm install

# 验证安装
echo "🔍 验证系统功能..."
node -e "
try {
  const GithubSourceLearningAssistant = require('./index.js');
  const assistant = new GithubSourceLearningAssistant();
  console.log('✅ GitHub源码学习助手验证通过');
  console.log('💡 技能已准备就绪，可以开始源码学习之旅');
} catch (error) {
  console.error('❌ 验证失败:', error.message);
  process.exit(1);
}
"

# 设置权限
echo "🔒 设置文件权限..."
chmod +x install.sh

echo ""
echo "🎉 GitHub源码学习助手安装完成！"
echo ""
echo "📚 系统功能："
echo "   - GitHub仓库结构分析"
echo "   - 交互式源码学习路径"
echo "   - 学习笔记管理"
echo "   - 问答式学习辅助"
echo "   - 多格式笔记导出"
echo "   - 专业学习目录管理"
echo ""
echo "💡 使用方法："
echo "   1. 导入技能到OpenClaw"
echo "   2. 提供GitHub仓库URL开始学习"
echo "   3. 按照学习路径逐步深入"
echo "   4. 保存学习笔记并导出分享"
echo ""
echo "🚀 技能已准备就绪，可以开始GitHub源码学习！"