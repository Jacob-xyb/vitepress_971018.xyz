# 游戏租赁管理系统

## 功能说明

这是一个游戏租赁管理页面，用于实时查看和管理游戏租赁状态。

### 主要功能

#### 1. 游戏展示
- **封面图片**：显示游戏封面
- **游戏名称**：中文名和英文名
- **租金价格**：月租价格（￥xx/月）
- **押金**：租赁押金（￥xxx）
- **归还日期**：显示"上次归还"或"预计归还"日期
- **状态边框**：卡片边框颜色对应游戏状态（2px 粗）

#### 2. 状态指示器
使用彩色圆点和卡片边框实时显示游戏状态：
- 🟢 **绿色**：未出租（可租赁）
- 🟠 **橙色**：出租中
- 🔴 **红色**：已超时（需催还）

状态图例显示在页面顶部，右侧标注"价格仅供参考"。

#### 3. 筛选功能
- **状态筛选**：全部 / 未出租 / 出租中 / 已超时
- **平台筛选**：全部 / PS5 / NS / PC 等（自动从数据提取）
- **重置按钮**：一键清除所有筛选条件（无筛选时禁用）

#### 4. 自动排序
游戏按热度自动排序显示：
- 热度计算公式：`popularity + history.length × 10`
- 热度高的游戏优先显示

#### 5. 开发模式功能
仅在开发环境下可见（`import.meta.env.DEV === true`）：

##### 点击卡片查看详情
点击游戏卡片会弹出详情弹窗，包含：

**物品状态**
- 显示游戏的物品质量备注信息

**财务概览**
- **本金**：游戏购买成本
- **总收入**：累计租赁收入
- **净利润**：总收入 - 本金
- **回本进度**：可视化进度条显示回本百分比

**租赁历史**
- 历史租赁记录列表
- 包含日期、租借人、天数、收入等信息

## 文件结构

```
docs/rental/
├── index.md              # 主页面（Vue 组件 + 样式）
├── games-data.js         # 游戏数据
├── rental-config.js      # 配置（状态配置、平台颜色）
├── rental-utils.js       # 工具函数（计算、排序、状态判断）
└── README.md            # 本文档

docs/.vitepress/theme/components/
└── RentalCard.vue       # 游戏卡片组件

docs/public/gameover/
└── *.jpg                # 游戏封面图片
```

## 数据管理

### 游戏数据结构

文件位置：`docs/rental/games-data.js`

```javascript
{
  id: 1,                          // 游戏唯一标识
  title: '仁王3',                 // 游戏中文名
  titleEn: 'Nioh 3',              // 游戏英文名
  cover: '/gameover/仁王3-v.jpg', // 封面图片路径（相对于 public）
  platform: 'PS5',                // 游戏平台
  cost: 300,                      // 本金（购买成本）
  rentalPrice: 50,                // 月租金
  deposit: 100,                   // 押金
  note: '光盘无划痕，盒子完好',    // 物品状态备注
  popularity: 0,                  // 基础热度值（默认 0）
  
  // 租赁历史记录
  history: [
    { 
      date: '2025-01-15',         // 租赁日期
      renter: '张三',             // 租借人
      income: 50,                 // 收入
      returned: true,             // 是否已归还
      returnDate: '2025-01-22'    // 归还日期
    }
  ]
}
```

### 状态自动计算

游戏状态不需要手动设置，系统会根据 `history` 自动计算：

1. 如果 `history` 为空或所有记录都已归还 → `available`（未出租）
2. 如果最后一条记录 `returned: false`：
   - 检查 `returnDate` 是否超过今天 → `overdue`（已超时）
   - 否则 → `rented`（出租中）

### 添加新游戏

1. 打开 `docs/rental/games-data.js`
2. 在 `rentalGames` 数组中添加新的游戏对象
3. 确保游戏封面图片已放置在 `docs/public/gameover/` 目录
4. 设置基础属性（id、title、platform、cost、rentalPrice、deposit、note、popularity）
5. `history` 初始为空数组 `[]`

### 添加租赁记录

在游戏对象的 `history` 数组中添加新记录：

```javascript
history: [
  // 已归还的记录
  { 
    date: '2025-01-15', 
    renter: '张三', 
    income: 50, 
    returned: true, 
    returnDate: '2025-01-22' 
  },
  // 当前租赁（未归还）
  { 
    date: '2025-02-05', 
    renter: '王五', 
    income: 60, 
    returned: false, 
    returnDate: '2025-02-12' 
  }
]
```

**注意**：
- 最后一条记录如果 `returned: false`，游戏会显示为"出租中"或"已超时"
- `returnDate` 用于判断是否超时和显示归还日期
- 天数会自动根据 `date` 和 `returnDate` 计算

### 调整游戏热度

修改游戏的 `popularity` 值可以调整基础热度：
- 热度计算：`popularity + history.length × 10`
- 例如：`popularity: 20` 的游戏会比 `popularity: 0` 的游戏排序更靠前

## 配置说明

### 状态配置

文件位置：`docs/rental/rental-config.js`

```javascript
export const statusConfig = {
  available: { 
    label: '未出租', 
    color: '#10b981',                    // 绿色
    bgColor: 'rgba(16, 185, 129, 0.1)' 
  },
  rented: { 
    label: '出租中', 
    color: '#f59e0b',                    // 橙色
    bgColor: 'rgba(245, 158, 11, 0.1)' 
  },
  overdue: { 
    label: '已超时', 
    color: '#ef4444',                    // 红色
    bgColor: 'rgba(239, 68, 68, 0.1)' 
  }
}
```

### 平台颜色配置

```javascript
export const getPlatformColor = (platform) => {
  // PS 系列 → 蓝色
  // NS 系列 → 红色
  // PC 系列 → 灰色
}
```

## 工具函数

文件位置：`docs/rental/rental-utils.js`

- `calculateDays(startDate, endDate)` - 计算租赁天数
- `getGameStatus(game)` - 自动计算游戏状态
- `getTotalIncome(game)` - 计算总收入
- `getNetProfit(game)` - 计算净利润
- `getRecoveryRate(game)` - 计算回本进度
- `calculatePopularity(game)` - 计算游戏热度
- `sortGamesByPopularity(games)` - 按热度排序

## 开发模式

### 自动判断
开发模式会自动根据环境变量判断：
- 本地开发（`npm run dev`）：自动开启，可点击卡片查看详情
- 生产构建（`npm run build`）：自动关闭，卡片不可点击

### 手动控制
如需手动控制，修改 `docs/rental/index.md` 中的：
```javascript
const isDev = ref(true)  // 强制开启
const isDev = ref(false) // 强制关闭
```

## 样式定制

### 主页面样式
位置：`docs/rental/index.md` 的 `<style scoped>` 标签

可调整：
- 筛选器样式
- 状态图例样式
- 游戏网格布局
- 响应式断点

### 卡片组件样式
位置：`docs/.vitepress/theme/components/RentalCard.vue` 的 `<style scoped>` 标签

可调整：
- 卡片布局和尺寸
- 边框粗细（当前 2px）
- 悬停效果
- 弹窗样式
- 状态点动画

## 注意事项

1. **图片路径**：封面图片需放在 `docs/public/` 目录下，引用时使用 `/` 开头的绝对路径
2. **状态自动化**：游戏状态完全自动计算，不需要手动维护 `status` 字段
3. **数据同步**：当前为静态数据，如需实时更新需接入后端 API
4. **权限控制**：开发模式仅通过环境变量控制，生产环境需要更严格的权限验证
5. **日期格式**：所有日期使用 `YYYY-MM-DD` 格式
6. **热度排序**：游戏会自动按热度降序排列，无需手动排序
7. **筛选保持**：筛选条件会保持在内存中，刷新页面后重置

## 未来扩展

- [ ] 接入后端 API 实现数据持久化
- [ ] 添加用户认证和权限管理
- [ ] 实现租赁记录的增删改功能
- [ ] 添加数据统计和图表展示
- [ ] 支持批量导入导出数据
- [ ] 添加消息通知功能（超时提醒）
- [ ] 支持多语言切换
