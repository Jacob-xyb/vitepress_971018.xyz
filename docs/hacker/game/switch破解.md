# Switch 破解教程

::: danger 免责声明
本教程仅供学习交流使用，破解设备可能违反用户协议并失去保修资格。请遵守当地法律法规，支持正版游戏。
:::

## 核心概念

### 固件与整合包的区别

- **系统固件**：Switch 的操作系统版本
- **整合包**：包含破解工具、插件、软件的集合包

**重要说明：**
- 整合包和系统固件是两个独立的概念
- 整合包向下兼容所有 Switch 型号和破解芯片
- 不建议随意添加插件，过多插件会影响系统稳定性

## Atmosphere 大气层破解

### 什么是 Atmosphere？

Atmosphere 是目前最流行的 Nintendo Switch 软破解方案，允许用户在不修改硬件的情况下运行自制软件和游戏。

### 准备工作

**硬件要求：**
- 可破解的 Nintendo Switch 主机（早期型号）
- 高速 SD 卡（建议 128GB 以上，推荐 U3 或 A2 规格）
- 读卡器（用于电脑操作）

**软件准备：**
- 最新版 [Atmosphere 固件包](https://github.com/Atmosphere-NX/Atmosphere/releases)
- 最新版 [Hekate 引导程序](https://github.com/CTCaer/hekate/releases)
- 注入工具（如 TegraRcmGUI）

### 激活步骤

#### 1. 准备 SD 卡

1. 将 SD 卡插入电脑
2. 下载并解压 Atmosphere 和 Hekate
3. 将所有文件复制到 SD 卡根目录
4. 安全弹出 SD 卡

#### 2. 进入 RCM 模式

1. 完全关闭 Switch 主机
2. 使用短接器或回形针短接右侧 Joy-Con 接口
3. 按住音量+ 键，同时按电源键
4. 屏幕保持黑屏即为成功进入 RCM 模式

#### 3. 注入 Payload

1. 使用 USB-C 线连接 Switch 和电脑
2. 打开注入工具（如 TegraRcmGUI）
3. 选择 Hekate payload 文件
4. 点击注入，等待主机启动

#### 4. 启动 Atmosphere

1. 在 Hekate 菜单中选择 "Launch"
2. 选择 "Atmosphere" 启动破解系统
3. 首次启动会进行初始化，请耐心等待

::: tip 提示
建议创建 emuMMC（虚拟系统），避免直接修改真实系统，降低封号风险。
:::

## 更新教程

### 更新顺序

::: warning 重要
严格按照 **先更新大气层整包 → 再更新固件** 的顺序操作，避免系统崩溃。
:::

### 更新大气层

#### 备份重要文件

在更新前，建议备份以下文件夹：
- `emuMMC` - 虚拟系统数据
- `nintendo` - 游戏存档
- `JKSV` 或 `Checkpoint` - 第三方存档工具数据
- `atmosphere/contents` - 金手指、汉化补丁、MOD

#### 更新步骤

1. **关机并取出 SD 卡**
   - 完全关闭 Switch
   - 取出 SD 卡插入电脑

2. **清理旧文件**
   
   ::: danger 注意
   不要直接覆盖！先删除旧文件，再复制新文件。
   :::
   
   保留以下文件夹：
   - `emuMMC`
   - `nintendo`
   - `JKSV` 或 `Checkpoint`（如果使用）
   - `atmosphere/contents`（提前备份）
   
   删除其他所有文件和文件夹

3. **复制新版本**
   - 下载最新的 Atmosphere 整合包
   - 解压后将所有文件复制到 SD 卡根目录
   - 如有备份的 `atmosphere/contents`，复制回去

4. **安全弹出并插回主机**

### 更新固件

#### 准备固件包

1. 下载对应版本的固件包（建议使用大气层专用固件）
2. 解压固件包
3. 将解压后的文件夹复制到 SD 卡根目录

::: warning 路径要求
固件包路径不能包含中文字符，否则可能无法识别！
:::

#### 使用 Daybreak 刷入固件

1. **启动 Atmosphere 系统**
   - 进入破解系统

2. **打开 Daybreak**
   - 进入相册，找到 Daybreak 程序
   - 点击打开

3. **选择固件包**
   - 选择 "Install"
   - 浏览并选择 SD 卡中的固件包文件夹
   - 等待验证通过

4. **配置刷机选项**
   
   **是否保留数据：**
   - ✅ **Preserve settings**（保留数据）- 保留已安装的游戏和存档
   - ❌ **Reset to factory settings**（恢复出厂）- 清空所有数据
   
   **文件系统驱动：**
   - ✅ 勾选 **Install FAT32 + exFAT**
   - 必须安装 exFAT 驱动，否则无法识别 exFAT 格式的 SD 卡

5. **开始刷入**
   - 确认所有选项无误
   - 点击 "Install" 开始刷入
   - 等待进度条完成（约 3-5 分钟）
   - 刷入完成后重启主机

::: tip 建议
- 首次刷机建议选择保留数据
- 刷机过程中保持主机电量充足（建议 50% 以上）
- 不要在刷机过程中断电或强制关机
:::

## 常见问题

### 无法进入 RCM 模式

**解决方案：**
- 确认主机已完全关机（长按电源键 12 秒）
- 检查短接位置是否正确
- 尝试更换短接工具

### 注入 Payload 失败

**解决方案：**
- 检查 USB 线是否支持数据传输
- 更换 USB 接口或电脑
- 重新下载 Payload 文件

### 更新后黑屏无法启动

**解决方案：**
- 重新注入 Hekate
- 检查 SD 卡文件是否完整
- 尝试重新解压并复制大气层文件

### 游戏无法启动

**解决方案：**
- 检查固件版本是否满足游戏要求
- 确认游戏文件完整性
- 清除游戏缓存后重试

## 参考资源

- [Atmosphere 官方 GitHub](https://github.com/Atmosphere-NX/Atmosphere)
- [Hekate 官方 GitHub](https://github.com/CTCaer/hekate)
- [Switch Homebrew Guide](https://switch.homebrew.guide/)

---

::: info 最后更新
本教程最后更新于 2026 年 2 月，请以最新官方文档为准。
:::



