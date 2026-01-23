#!/bin/bash

# VitePress 自动部署脚本
# 使用方法：将此文件上传到服务器网站根目录，并修改路径

SITE_PATH="/www/wwwroot/docs.example.com"  # 修改为你的网站路径

cd $SITE_PATH

# 拉取最新代码
echo "正在拉取最新代码..."
git pull origin main

# 安装依赖
echo "正在安装依赖..."
npm install

# 构建项目
echo "正在构建项目..."
npm run docs:build

# 复制构建文件到根目录
echo "正在部署文件..."
cp -r docs/.vitepress/dist/* $SITE_PATH/

# 清理
echo "清理临时文件..."
# 可选：删除源码文件，只保留构建后的文件
# rm -rf docs node_modules package.json

echo "部署完成！时间：$(date '+%Y-%m-%d %H:%M:%S')"
