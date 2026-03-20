<!--
 * @Author: Jacob-xyb 949782197@qq.com
 * @Date: 2026-03-20 23:31:19
 * @LastEditors: Jacob-xyb 949782197@qq.com
 * @LastEditTime: 2026-03-20 23:31:31
 * @Description: Life is struggle.
-->
# Rust Tauri

## 基础指令

| 命令 | 作用 | 产物 |
|------|------|------|
| `npm run tauri dev` | 开发模式，热重载 | 无 exe，仅内存运行 |
| `npm run tauri build` | 生产构建 | 生成 `src-tauri/target/release/` 下的 exe |
| `cargo tauri build --no-bundle` | 不打包，仅编译 | 仅生成 exe，不生成安装包 |

::: tip 提示
使用 `npm run tauri dev` 开发时，无需每次重新编译，直接保存即可热重载。
:::

::: warning 注意
`cargo tauri build --no-bundle` 仅生成 exe 可执行文件，不包含安装包，适用于快速验证。
:::
