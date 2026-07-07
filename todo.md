# FIRE Tracker Todo

> **当前优先级（S1 垂直切片）**：接通录入持久化 → 提交反馈 → 手动验证「记一笔后刷新仍在」。

## 已完成

- [x] 搭建 React + TypeScript + Vite 基础项目
- [x] 接入 TanStack Router、TanStack Query、Tailwind CSS v4、shadcn/ui 基础组件
- [x] 建立底部 Tab 布局：首页、整理、设置
- [x] 定义现金流记录、生命流向、自动复盘规则、用户设置等领域类型
- [x] 抽离本地数据存储层，统一管理设置、现金流记录、生命流向分类、自动复盘规则（`storage.ts` + Query hooks）
- [x] 补齐默认生命流向分类数据（14 类，内置 `direction` / `statEffect`）
- [x] 完成设置页真实时薪基础表单
- [x] 让设置页保存结构对齐 `UserSettings`，包含 `realHourlyWage`、创建时间和更新时间
- [x] 支持设置参数本地保存与真实时薪即时计算
- [x] 实现「记录一笔」入口（浮动按钮 + RecordDrawer）
- [x] 实现极速录入 UI：日期、描述、金额、数字键盘、快捷标签
- [x] 录入阶段不选择支出 / 收入
- [x] 金额解析纯函数（`amount.ts`），提交时按正数处理
- [x] 根据真实时薪计算 `energyHours`（`energy.ts`，录入时实时预览）
- [x] 生成 `descriptionKey`（`descriptionKey.ts`，`createRawTransaction` 已调用）
- [x] `createRawTransaction` 纯函数（固定 `reviewStatus: "unreviewed"`）

## 进行中

- [ ] 接通 `useSaveTransactions`，确认后真正写入 localStorage
- [ ] 提交成功 toast 反馈与「再记」清空表单
- [ ] 幽灵账业务语义（UI 开关已有，挂起逻辑未实现）

## P0：MVP 核心闭环

- [ ] 创建现金流记录并持久化，未命中规则时进入 `unreviewed`
- [ ] 实现自动复盘匹配（`auto-review.ts`：命中规则 → `auto_reviewed` / 金额异常 → `suggested`）
- [ ] 实现原始现金流记录列表（调试用或设置页入口均可）
- [ ] 将整理页改为待复盘页
- [ ] 待复盘页按 `descriptionKey` 分组展示
- [ ] 分组展示笔数、总金额、总生命能量
- [ ] 实现首次复盘：选择生命流向并写入复盘判断
- [ ] 根据生命流向自动带出 `direction` 和 `statEffect`
- [ ] 只在 `statEffect = "consume"` 时要求三项复盘判断
- [ ] 确认复盘后创建或更新 `AutoReviewRule`
- [ ] 相同描述再次录入时自动复盘
- [ ] 实现统计纯函数（`stats.ts`，基于 `statEffect`）
- [ ] 首页展示本月生命消耗、自由积累、收入补充、待复盘数量等基础概览

## P1：体验与统计增强

- [ ] 金额异常时进入 `suggested`，提示用户确认
- [ ] 自动复盘规则记录使用次数、平均金额、最近使用时间
- [ ] 支持用户确认或重新判断 `suggested` 分组
- [ ] 增加满足感、价值观一致性、工作依赖成本统计
- [ ] 增加收入补充、退款抵消、储能解冻统计
- [ ] 设置页增加生命流向管理入口
- [ ] 设置页增加自动复盘规则管理入口
- [ ] 增加数据导出能力
- [ ] PWA 添加到主屏幕
- [ ] 优化移动端空状态、成功反馈和底部安全区体验

## 质量与验证

- [ ] 为金额解析、真实时薪计算、`descriptionKey` 生成补充单元测试
- [ ] 为统计逻辑补充测试，确保基于 `statEffect` 而不是金额正负号
- [ ] 跑通 `pnpm typecheck`
- [ ] 跑通 `pnpm lint`
- [ ] 手动验证首次进入、设置保存、记录一笔、待复盘、自动复盘、首页统计闭环
