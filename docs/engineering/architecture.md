# 前端架构设计

本文档约束 MVP 阶段的前端分层、目录结构和依赖方向。领域模型与统计规则以 `domain-model.md` 为准，本文只回答“代码放在哪里、谁可以依赖谁”。

## 1. 架构总览

这是一个纯前端、本地数据的移动优先应用。整体分为五层：

```text
路由页面层 (src/routes)
    │ 调 hooks 取数据、组合组件、处理导航
    ▼
特性层 (src/features)
    ├── 领域规则：纯函数，换算、匹配、统计
    └── 数据访问：storage 收口 + TanStack Query hooks
    ▼
持久化 (localStorage)

UI 基础组件 (src/components/ui) 被路由页面层和特性层组件复用
通用工具 (src/lib) 被所有层复用
```

核心思想：页面只负责编排，业务规则放在纯函数里，数据读写收敛到一处。

## 2. 目录结构

```text
src/
├── routes/                     # 路由页面层
│   ├── _tabs.tsx               # 底部 Tabbar 布局（挂载浮动入口 + RecordDrawer）
│   ├── _tabs.index.tsx         # 首页：自由仪表盘
│   ├── _tabs.review.tsx        # 待复盘页
│   └── _tabs.setting.tsx       # 设置页
├── features/
│   ├── ledger/
│   │   ├── model.ts            # 领域类型
│   │   ├── lifeFlowCategories.ts       # 默认生命流向分类常量
│   │   ├── description-key.ts  # descriptionKey 标准化
│   │   ├── auto-review.ts      # 自动复盘规则匹配 + 金额异常判断
│   │   ├── stats.ts            # 基于 statEffect 的统计纯函数
│   │   ├── storage.ts          # 本地持久化的唯一读写入口
│   │   └── queries.ts          # TanStack Query hooks
│   └── settings/
│       └── hourly-wage.ts      # 真实时薪计算纯函数
├── components/
│   ├── ui/                     # shadcn/ui 基础组件
│   ├── layout/
│   │   └── record-drawer/      # 极速录入抽屉（日期 / 金额 / 描述）
│   └── ...                     # 跨页面复用的业务组件
└── lib/
    └── utils.ts                # 通用工具
```

说明：

- 文件按需创建，不预建空文件；当某个 feature 文件职责过重时再拆分。
- `UserSettings` 类型暂时与其他领域类型一起放在 `ledger/model.ts`，设置功能变复杂后再拆到 `features/settings`。

## 3. 各层设计要点

### 3.1 领域规则层：纯函数优先

`energyHours` 换算、`descriptionKey` 生成、自动复盘匹配、金额异常判断、首页统计等领域规则，全部写成无副作用的纯函数：输入数据返回结果，不碰存储、不碰 React。

原因：

- `domain-model.md` 已定义精确规则（统计必须基于 `statEffect`），纯函数让规则可以单独测试和验证。
- UI 调整不影响规则正确性，规则演进也不需要改组件。

### 3.2 数据层：storage 收口 + TanStack Query 分发

- 持久化使用 `localStorage`，`storage.ts` 是唯一读写入口，存储结构带版本号字段，方便将来迁移到 IndexedDB 或后端。
- 用 TanStack Query 包装读写：查询类 hooks（如 `useTransactions`）负责取数，变更类 hooks（如 `useCreateTransaction`）在写入后 invalidate 对应查询。

虽然 MVP 没有网络请求，仍使用 Query 的原因：

- 解决“录入抽屉写入后，首页和待复盘页自动刷新”的跨页面状态同步问题。
- 未来接后端 API 时，hooks 签名不变，页面层零改动。

### 3.3 路由页面层：薄页面

`routes/` 下的组件只做三件事：调 hooks 取数据、组合 feature 组件、处理导航。

页面里不应出现 `statEffect === 'consume'` 这类领域判断，它们属于 `stats.ts` 等领域规则文件。

极速录入由底部抽屉（`RecordDrawer`）承载，挂在 `_tabs` 布局内，从任意 Tab 的浮动入口打开。目标仍是约 3 秒记一笔，不做成常驻 Tab；抽屉形态便于全局唤起，避免为录入单独跳转全屏路由。

### 3.4 类型设计：让非法状态不可表示

- `Transaction = RawTransaction | ReviewedTransaction` 联合类型保证“未复盘的记录不存在 `categoryId`”。
- 访问复盘字段前用类型守卫收窄（如 `isReviewed(tx): tx is ReviewedTransaction`），不使用非空断言绕过。

## 4. 依赖方向约束

```text
routes → features → lib
```

- 依赖永远单向：`features` 不能 import `routes` 的任何内容。
- `model.ts`、`stats.ts` 等纯逻辑文件不能 import React。
- `components/ui` 只承载展示组件，不包含领域逻辑。

这条约束保证核心逻辑可以被独立测试和迁移。

## 5. 与开发计划的对应

实现顺序从依赖最底层往上，详细拆分见 `acceptance-plan.md`：

1. 设置初始化 + 真实时薪计算（其他一切的前提）
2. `storage.ts` + `queries.ts` 数据层
3. 极速录入抽屉（含 `energyHours`、`descriptionKey` 生成）
4. 待复盘页（按 `descriptionKey` 分组 + 第一次复盘 + 生成规则）
5. 自动复盘匹配
6. 首页统计
