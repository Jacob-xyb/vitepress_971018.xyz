# npm

## npm 执行流程

以 `vitepress` 为例：

**npm run 的执行流程：**

1. `npm run docs:dev` → npm 在 package.json 的 `scripts` 中查找名为 `docs:dev` 的脚本
2. 找到后，执行该脚本的值：`vitepress dev docs --host 0.0.0.0 --port 5173`
3. npm 会直接在 shell 中运行这个命令（不是再次调用 npm run）

**关键区别：**

```bash
# 正确 ✓
npm run docs:dev
# ↓ npm 执行
# vitepress dev docs --host 0.0.0.0 --port 5173
 
# 错误 ✗
npm run "vitepress dev docs"
# ↓ npm 尝试查找
# scripts["vitepress dev docs"]  ← 这个脚本不存在！
```

**为什么你的命令失败：**

当你运行 `npm run "vitepress dev docs"` 时，npm 会：
1. 在 scripts 对象中查找键名为 `"vitepress dev docs"` 的脚本
2. 找不到这个脚本（因为实际的键名是 `docs:dev`）
3. 报错：脚本不存在

**简单类比：**

```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

- `npm run start` → 执行 `node server.js` ✓
- `npm run "node server.js"` → 查找名为 "node server.js" 的脚本 → 找不到 ✗

所以 `npm run` 后面跟的是**脚本名称**（scripts 的键），而不是要执行的命令本身。

# npx

## npx 是什么：

`npx` 是 npm 5.2+ 自带的包执行器（package runner），专门用来执行 npm 包中的命令。

**npx 的查找顺序：**

```bash
npx vitepress dev docs
```

1. **首先**在本地 `node_modules/.bin/` 中查找 `vitepress`
2. **如果找不到**，临时下载并执行（执行完删除）
3. **如果找到**，直接执行本地版本

# 常见问题

## npm 和 npx 执行的区别

**三种方式的对比：**

```bash
# ❌ 直接执行 - 失败
vitepress dev docs
# 只在系统全局 PATH 中查找
# 找不到 → 报错

# ✓ 使用 npx - 成功
npx vitepress dev docs
# 1. 先查找 node_modules/.bin/vitepress
# 2. 找到了 → 执行

# ✓ 使用 npm run - 成功
npm run docs:dev
# npm 自动将 node_modules/.bin 加入 PATH
# 然后执行脚本内容
```

**实际执行路径：**

```bash
# 这三个命令本质上执行的是同一个文件：
npx vitepress dev docs
# ↓
node_modules/.bin/vitepress dev docs
# ↓
node node_modules/vitepress/bin/vitepress.js dev docs
```

**npx 的优势：**

1. **不需要全局安装** - 使用本地项目依赖
2. **不需要写完整路径** - 自动查找 node_modules/.bin
3. **可以临时执行** - 即使没安装也能用（会临时下载）
4. **版本隔离** - 每个项目用自己的版本

**总结：**

- `vitepress` 命令找不到 → 因为不在系统 PATH 中
- `npx vitepress` 可以 → npx 会自动查找 node_modules/.bin
- `npm run docs:dev` 可以 → npm run 也会自动处理路径

所以 `npx` 和 `npm run` 都解决了同一个问题：**让你能够执行本地安装的包命令**。