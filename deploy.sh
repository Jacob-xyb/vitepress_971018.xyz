#!/bin/bash

# VitePress 自动部署脚本
# 网站路径
SITE_PATH="/www/wwwroot/971018.xyz"
# 源码路径（可以和网站路径分开）
SOURCE_PATH="/www/wwwroot/971018.xyz/source"

# 记录日志
echo "========================================" >> $SITE_PATH/deploy.log
echo "部署开始时间: $(date '+%Y-%m-%d %H:%M:%S')" >> $SITE_PATH/deploy.log

# 进入源码目录
cd $SOURCE_PATH

# 拉取最新代码
echo "正在拉取最新代码..." >> $SITE_PATH/deploy.log
git pull origin master >> $SITE_PATH/deploy.log 2>&1

# 安装依赖
echo "正在安装依赖..." >> $SITE_PATH/deploy.log
npm install >> $SITE_PATH/deploy.log 2>&1

# 构建项目
echo "正在构建项目..." >> $SITE_PATH/deploy.log
npm run docs:build >> $SITE_PATH/deploy.log 2>&1

# 复制构建文件到网站目录
echo "正在部署文件..." >> $SITE_PATH/deploy.log
rm -rf $SITE_PATH/*.html $SITE_PATH/assets $SITE_PATH/api $SITE_PATH/guide
cp -r docs/.vitepress/dist/* $SITE_PATH/

echo "部署完成时间: $(date '+%Y-%m-%d %H:%M:%S')" >> $SITE_PATH/deploy.log
echo "========================================" >> $SITE_PATH/deploy.log
