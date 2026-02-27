# Windows 11 启用 SVG 文件预览

## 问题描述

Windows 11 25H2 虽然声称原生支持 SVG 预览，但实际使用中资源管理器无法显示 SVG 缩略图。

## 解决方案

### 方法 1：SVG Explorer Extension（推荐）

这是最稳定可靠的方案。

#### 下载安装

1. 访问 GitHub 发布页面：
   ```
   https://github.com/tibold/svg-explorer-extension/releases
   ```

2. 下载最新版本的安装包（通常是 `SvgSee-x64.msi` 或 `SvgSee-x86.msi`）
   - 64位系统选择 x64 版本
   - 32位系统选择 x86 版本

3. 双击安装包，按提示完成安装

4. 重启资源管理器或重启电脑

#### 验证效果

1. 打开包含 SVG 文件的文件夹
2. 切换视图为"大图标"或"超大图标"
3. SVG 文件应该显示预览缩略图

### 方法 2：注册表修改（备选方案）

如果不想安装第三方软件，可以尝试修改注册表。

#### 创建注册表文件

创建一个 `enable-svg-preview.reg` 文件，内容如下：

```reg
Windows Registry Editor Version 5.00

[HKEY_CLASSES_ROOT\.svg]
@="svgfile"
"Content Type"="image/svg+xml"
"PerceivedType"="image"

[HKEY_CLASSES_ROOT\.svg\ShellEx\{BB2E617C-0920-11d1-9A0B-00C04FC2D6C1}]
@="{C7657C4A-9F68-40fa-A4DF-96BC08EB3551}"

[HKEY_CLASSES_ROOT\svgfile]
@="SVG Image"

[HKEY_CLASSES_ROOT\svgfile\DefaultIcon]
@="%SystemRoot%\\System32\\imageres.dll,-122"

[HKEY_CLASSES_ROOT\svgfile\shell\open\command]
@="\"C:\\Program Files\\Internet Explorer\\iexplore.exe\" %1"
```

#### 导入注册表

1. 双击 `.reg` 文件
2. 确认导入
3. 重启资源管理器

#### 重启资源管理器

按 `Ctrl + Shift + Esc` 打开任务管理器，找到"Windows 资源管理器"，右键选择"重新启动"。

### 方法 3：使用 PowerShell 脚本

创建一个 PowerShell 脚本自动配置：

```powershell
# 需要管理员权限运行

# 设置 SVG 文件关联
$svgPath = "HKCR:\.svg"
if (!(Test-Path $svgPath)) {
    New-Item -Path $svgPath -Force
}
Set-ItemProperty -Path $svgPath -Name "(Default)" -Value "svgfile"
Set-ItemProperty -Path $svgPath -Name "Content Type" -Value "image/svg+xml"
Set-ItemProperty -Path $svgPath -Name "PerceivedType" -Value "image"

# 设置缩略图处理器
$shellExPath = "HKCR:\.svg\ShellEx\{BB2E617C-0920-11d1-9A0B-00C04FC2D6C1}"
if (!(Test-Path $shellExPath)) {
    New-Item -Path $shellExPath -Force
}
Set-ItemProperty -Path $shellExPath -Name "(Default)" -Value "{C7657C4A-9F68-40fa-A4DF-96BC08EB3551}"

Write-Host "SVG 预览配置完成，请重启资源管理器" -ForegroundColor Green
```

## 故障排除

### 预览仍然不显示

1. 确认已切换到"大图标"或"超大图标"视图
2. 清除缩略图缓存：
   ```powershell
   # 以管理员身份运行
   taskkill /f /im explorer.exe
   del /f /s /q /a %LocalAppData%\Microsoft\Windows\Explorer\thumbcache_*.db
   start explorer.exe
   ```

3. 检查文件夹选项：
   - 打开"文件资源管理器选项"
   - 切换到"查看"选项卡
   - 确保"始终显示图标，从不显示缩略图"未勾选

### SVG 文件图标显示为空白

可能是文件关联问题，尝试：
1. 右键 SVG 文件 → 打开方式 → 选择默认应用
2. 选择浏览器（Chrome/Edge）作为默认打开方式

## 推荐方案

对于 Windows 11 25H2 用户，强烈推荐使用 **方法 1（SVG Explorer Extension）**，这是最稳定且无需手动配置的方案。

## 相关链接

- [SVG Explorer Extension GitHub](https://github.com/tibold/svg-explorer-extension)
- [Microsoft 官方 SVG 支持文档](https://learn.microsoft.com/en-us/windows/apps/design/style/iconography/app-icon-design)
