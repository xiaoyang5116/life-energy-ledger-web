# AGENTS.md

本文件约束 AI 编程助手在 `life-energy-ledger-web` 中的工作方式。目标是交付正确代码，并在合适时机帮助作者通过真实开发学习技术、工程判断和最佳实践。

## 规则优先级

冲突时按此顺序执行（序号越小优先级越高）：

1. 安全与用户改动保护（不覆盖未提交改动、不执行破坏性命令、不主动 commit/push）
2. 产品 / 领域规则与术语（以 `docs` 为准）
3. 最小改动与现有架构（以 `docs/engineering/architecture.md` 与仓库现状为准）
4. 验证与完成后总结
5. 学习解释、提问教练、成长导向（不阻断已明确任务）

本仓库以本文件与 `docs` 为约定真相源。技术栈是 Vite，不是 Next.js；commit message 的 subject/body 使用简体中文。

## 项目背景

- 产品：FIRE Tracker，用“生命能量”理解现金流。
- 目标：支持极速录入、周末复盘、自动复盘，帮助用户看清生命流向。
- 技术栈：React、TypeScript、Vite、TanStack Router、TanStack Query、Tailwind CSS v4、shadcn/ui、lucide-react。

## 开始任务前

1. 先阅读本文件；如果目标目录有更近层级的 `AGENTS.md`，优先遵守更近层级说明。
2. 查看 `git status --short`，确认是否已有用户改动。
3. 阅读相关上下文，不要只看单个文件就修改。
4. 按任务类型阅读文档（不必每次读全套）：
   - 领域模型 / 统计逻辑 → `docs/engineering/domain-model.md`
   - 术语或 UI 文案 → `docs/product/terminology.md`
   - MVP 范围 / 页面流程 → `docs/product/mvp-scope.md`
   - 目录分层 / 依赖方向 → `docs/engineering/architecture.md`
   - 任务拆分 / 验收 → `docs/engineering/acceptance-plan.md`
   - 产品定位不清时 → `docs/README.md`，必要时再看 `docs/product/prd-v1.2-summary.md`
5. 说明准备做什么、为什么这么做；高风险或不确定操作要先说明判断依据。

## 需要先停下来确认的情况

出现以下情况时，先复述方案并征求确认，再改代码：

- 改 domain model、统计公式或持久化 schema
- 改路由信息架构或 Tab 语义
- 新增依赖，或预计改动超过约 3 个模块
- 需求不清，且无法从项目文件合理推断

## 协作方式

- 默认使用中文沟通和总结；代码标识符、命令、路径、库名和报错保持原文。
- 简单问题简洁回答，点出核心原因即可；复杂改动再展开原理、取舍和风险。
- 需求不清时，先问一两个具体问题；能从项目文件判断时，优先自行判断并说明假设。
- 如果需要新增依赖、调整数据模型、改变路由结构、迁移大量文件或扩大功能范围，先说明原因、收益、风险和替代方案。

## AI 开发流程

- 小任务可以直接实现，但仍要先读相关代码并保持最小改动。
- 复杂任务先不要写代码，先复述需求、列出最小实现方案、涉及文件、风险点和验证方式。
- 实现时按“理解上下文 -> 明确边界 -> 小步修改 -> 运行验证 -> 总结原理和取舍”的闭环工作。
- 不确定的技术点优先从项目文档、已有代码、官方文档或类型定义中确认，不凭空假设。
- 发现可复用的项目知识时，优先建议沉淀到 `docs` 或本文件，但不要擅自扩大文档范围。

## 提问质量教练（轻量）

- 问题已清楚时：直接处理，不要点评提问方式。
- 问题不够清楚时：指出最影响执行的缺口；简单任务只给一个关键澄清问题，复杂任务可补充“我理解的需求 / 建议补充的信息 / 更规范的提问示例”。
- 语气像结对编程教练，不批评用户，不为了规范而打断已明确任务。

## 成长导向（可选）

- 默认交付优先：总结里用 1–2 句点出关键原理或取舍即可。
- 仅在复杂任务、架构取舍、或用户明确要求时，再展开工程能力映射、职场/面试表达或作品集包装建议。
- 成长建议不得干扰当前任务交付。

## 修改原则

- 做最小改动，只改与当前任务直接相关的内容。
- 遵循现有目录结构、命名、组件风格和文档约定。
- 不随意重构无关代码，不批量格式化无关文件。
- 不覆盖、回滚或删除用户已有改动；如果目标文件已有未提交改动，先读懂再继续。
- 不执行破坏性命令，例如 `git reset --hard` 或删除文件，除非用户明确要求。
- 不为“更优雅”引入额外依赖或复杂抽象；只有重复逻辑已经影响理解、测试或扩展时，才提取新抽象。
- 保持代码可读性优先，避免聪明但难维护的写法。

## Git 提交

- 仅在用户明确要求时创建 commit；不要主动提交。
- commit message 的 subject 与 body 使用简体中文。
- 保留 Conventional Commits 的英文 type 与可选 scope，例如：`fix(record-drawer): 提高抽屉最大高度以适配录入表单`。
- subject 使用祈使语气，不以句号结尾；body 说明做了什么以及为什么，必要时可省略 how。
- 常用 type：`fix`、`feat`、`chore`、`docs`、`style`、`refactor`、`perf`、`test`。

## 产品与领域规则

- `docs/engineering/domain-model.md` 是领域模型和统计规则的实现准绳。
- `amount` 始终为正数，只表达用户输入的金额事实。
- 现金流方向由 `direction` 判断，统计归属由 `statEffect` 判断；不要靠金额正负号或分类名称推断。
- UI 不暴露 `direction`、`statEffect`、`categoryId`、`reviewStatus` 等内部字段名。
- “现金流记录”不等于“消费记录”。只有 `direction = "expense"` 且 `statEffect = "consume"` 时，才按消费语义表达。
- “生命流向”不是传统账目分类，而是用户理解生命能量流向的方式。
- 复盘默认按 `descriptionKey` 分组，不是逐笔分类。
- MVP 阶段不要主动扩展复杂财务功能，如复式记账、多账户资产管理、多币种、复杂预算、专业投资收益分析等。

## 术语与文案

- 优先遵守 `docs/product/terminology.md`。
- 推荐用户可见表达：记录一笔、待复盘、生命流向、生命能量、本月生命消耗、本月自由积累、收入补充、退款抵消、储能解冻。
- 避免在 UI 中出现：`direction`、`statEffect`、`categoryId`、`reviewStatus`、统计语义、资产内部转移、数据事实层。

## 前端约定

分层与依赖方向以 `docs/engineering/architecture.md` 为准，摘要如下：

- 路由使用 TanStack Router，页面放在 `src/routes`；页面保持薄：取数、组合组件、处理导航。
- 业务逻辑放在 `src/features/<domain>`（如 `ledger`、`settings`）：领域纯函数、`storage`、TanStack Query hooks。
- 依赖单向：`routes → features → lib`；`features` 不 import `routes`；纯逻辑文件不 import React。
- `src/routeTree.gen.ts` 是生成文件，不要手动编辑；由 Vite 开发/构建时的 TanStack Router 插件更新。
- UI 基础组件放在 `src/components/ui`，优先沿用 shadcn/ui 风格；跨页面业务组件可放在 `src/components`。
- 通用工具放在 `src/lib`，已有 `cn` 用于合并 `className`。
- 持久化经 feature 内 `storage` 收口；跨页面数据同步优先用 TanStack Query invalidate，而不是页面间手传状态。
- 图标优先使用 `lucide-react`；样式优先使用 Tailwind CSS 工具类和项目 CSS 变量。
- 导入路径可使用 `@/` 别名。
- 移动端体验很重要，新增页面要注意底部 Tabbar、安全区和小屏幕可用性。

## 代码风格

与仓库现有代码保持一致，优先可读性，不为了聪明写法牺牲可维护性：

- 能早返回时用 early return，减少深层嵌套。
- 样式优先用 Tailwind 工具类与项目 CSS 变量；条件 class 用 `cn()`，不要引入与项目无关的 class 写法。
- 命名要表达业务含义；事件处理函数使用 `handle` 前缀（如 `handleClick`、`handleKeyDown`）。
- 交互元素补充必要可访问性：有意义的 `aria-label`、键盘可操作时处理键盘事件；不要为装饰性元素堆砌无意义的 a11y 属性。
- `function` 与 `const fn = () =>` 跟随当前文件既有风格，不强制统一。
- 分号、引号等格式跟随仓库现有代码与格式化配置，不要按外部模板改成另一套。
- 不留 TODO、占位实现或半截功能；改动范围内要完整可用。
- 不知道或没有正确答时，直接说明，不猜测。

## 代码质量

- TypeScript 类型要表达真实业务含义，不要用 `any` 绕过问题。
- 业务枚举、字段名和状态流转要与领域文档一致。
- 组件职责要清晰：展示组件负责 UI，领域判断放在 `features` 的纯函数或 hooks 中，不要写进路由页面。
- 表单、金额、日期、统计等逻辑要处理边界条件。
- 用户可见文案使用自然语言，不暴露内部实现。
- 注释只用于解释业务规则或复杂逻辑，不解释显而易见的代码。
- 当前以 `pnpm typecheck` 与手工验收为主；纯函数（金额、`descriptionKey`、统计等）优先保持可测，有测试框架后再补自动化测试约定。

## 命令与验证

本项目使用 `pnpm-lock.yaml`，优先使用 `pnpm`。

- 开发：`pnpm dev`
- 类型检查：`pnpm typecheck`
- 代码检查：`pnpm lint`
- 格式化：`pnpm format`
- 构建：`pnpm build`
- 预览：`pnpm preview`

验证选择：

- 只改文档：检查文本即可，通常无需构建。
- 改 TypeScript 类型或业务逻辑：至少运行 `pnpm typecheck`。
- 改组件、路由或样式：优先运行 `pnpm typecheck`，必要时运行 `pnpm lint` 或 `pnpm build`。
- 改用户界面：尽量启动本地页面并检查关键视图。
- 验证失败时，说明失败命令、关键原因、是否可能由本次改动引起；若因环境、依赖或权限无法验证，要明确说明。

## 完成后总结

用中文简要说明：改了什么、为什么这样改、关键原理或设计思路、执行了哪些验证、是否还有风险或下一步建议。没有运行验证命令时，要说明原因。
