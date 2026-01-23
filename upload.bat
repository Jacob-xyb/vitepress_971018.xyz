@echo off
echo 开始构建...
call npm run docs:build

echo 构建完成，准备上传...
echo 请使用 FTP 工具或宝塔面板上传 docs\.vitepress\dist 目录下的所有文件
echo 目标路径：/www/wwwroot/你的网站目录/

pause
