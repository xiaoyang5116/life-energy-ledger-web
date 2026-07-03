# 领域模型与统计规则

本文档是实现准绳。若产品文档与这里的字段命名冲突，工程实现优先遵守本文件，并同步回产品文档。

## 1. 核心原则

FIRE Tracker 的模型分为两层：

1. 事实层：记录用户输入的原始现金流事实。
2. 复盘层：通过生命流向解释这笔现金流如何影响生命能量。

关键约束：

- `amount` 始终为正数，只表达用户输入的金额事实。
- 现金流方向不靠金额正负号判断，而由 `direction` 判断。
- 统计归属不靠分类名称判断，而由 `statEffect` 判断。
- 用户界面不暴露 `direction` 和 `statEffect`。
- 旧版 PRD 中的 `nature` 对应 `direction`，`effect` 对应 `statEffect`。

## 2. 原始记录

```ts
type RawTransaction = {
  id: string
  date: string
  amount: number
  realHourlyWage: number
  energyHours: number
  description: string
  descriptionKey: string
  reviewStatus: ReviewStatus
  createdAt: string
  updatedAt: string
}
```

字段含义：

| 字段                      | 含义                                 |
| ------------------------- | ------------------------------------ |
| `id`                      | 记录 ID                              |
| `date`                    | 发生日期，用于按天、月统计           |
| `amount`                  | 用户输入金额，统一为正数             |
| `realHourlyWage`          | 记录创建时的真实时薪快照，保证历史 `energyHours` 可追溯且不被后续时薪调整改写 |
| `energyHours`             | 金额按真实时薪换算出的生命能量       |
| `description`             | 用户输入的原始描述                   |
| `descriptionKey`          | 标准化后的描述，用于匹配自动复盘规则 |
| `reviewStatus`            | 复盘状态                             |
| `createdAt` / `updatedAt` | 创建和更新时间                       |

说明：`descriptionKey` 和 `reviewStatus` 虽然不属于用户原始输入，但属于记录创建时即可生成的系统事实，因此放入基础记录。

## 3. 已复盘记录

```ts
type ReviewedTransaction = RawTransaction & {
  categoryId: string
  direction: TransactionDirection
  statEffect: TransactionStatEffect
  satisfactionScore: ReviewScore | null
  valueAlignmentScore: ReviewScore | null
  freedomImpactScore: ReviewScore | null
  reviewNote?: string
  reviewedAt: string
}
```

字段含义：

| 字段                  | 含义                               |
| --------------------- | ---------------------------------- |
| `categoryId`          | 生命流向分类 ID                    |
| `direction`           | 现金流方向                         |
| `statEffect`          | 统计影响                           |
| `satisfactionScore`   | 满足感判断                         |
| `valueAlignmentScore` | 价值观一致性判断                   |
| `freedomImpactScore`  | 自由影响判断                       |
| `reviewNote`          | 可选复盘备注                       |
| `reviewedAt`          | 最近一次人工确认或系统自动复盘时间 |

## 4. 枚举

```ts
type TransactionDirection = "expense" | "income" | "transfer" | "neutral"

type TransactionStatEffect =
  | "consume"
  | "energy_gain"
  | "freedom_increase"
  | "freedom_decrease"
  | "expense_reversal"
  | "ignore"

type ReviewScore = -1 | 0 | 1

type ReviewStatus = "unreviewed" | "suggested" | "auto_reviewed" | "reviewed"
```

## 5. `direction` 与 `statEffect`

`direction` 回答现金流方向：

| 值         | 含义                     | 用户可见表达 |
| ---------- | ------------------------ | ------------ |
| `expense`  | 金额流出                 | 支出类现金流 |
| `income`   | 金额流入                 | 收入类现金流 |
| `transfer` | 资产内部转移             | 转移         |
| `neutral`  | 暂不判断或不进入核心统计 | 未判断       |

`statEffect` 回答统计影响：

| 值                 | 含义                    | 用户可见表达 |
| ------------------ | ----------------------- | ------------ |
| `consume`          | 计入生命消耗            | 生命消耗     |
| `energy_gain`      | 计入收入带来的生命能量  | 收入补充     |
| `freedom_increase` | 计入自由积累            | 自由积累     |
| `freedom_decrease` | 从自由积累中解冻 / 扣减 | 储能解冻     |
| `expense_reversal` | 抵消之前的消费          | 退款抵消     |
| `ignore`           | 不进入核心统计          | 暂不统计     |

## 6. 生命流向分类

```ts
type LifeFlowCategory = {
  id: string
  name: string
  description: string
  direction: TransactionDirection
  statEffect: TransactionStatEffect
  icon?: string
  colorCode?: string
  sortOrder: number
  isDefault: boolean
}
```

默认分类：

| ID                 | 名称     | direction | statEffect         | 说明                             |
| ------------------ | -------- | --------- | ------------------ | -------------------------------- |
| `survival`         | 生存维持 | `expense` | `consume`          | 维持基本生活                     |
| `work_cost`        | 工作代价 | `expense` | `consume`          | 为了工作产生的成本               |
| `health`           | 身体维护 | `expense` | `consume`          | 让身体保持可持续                 |
| `joy`              | 精神回血 | `expense` | `consume`          | 恢复情绪和能量                   |
| `relationship`     | 关系连接 | `expense` | `consume`          | 与重要的人建立连接               |
| `growth`           | 成长复利 | `expense` | `consume`          | 让未来更好的投入                 |
| `freedom`          | 自由积累 | `expense` | `freedom_increase` | 把当下资源投入未来自由           |
| `numbness`         | 逃避麻木 | `expense` | `consume`          | 情绪性、冲动性、无意识消费       |
| `accident`         | 意外事件 | `expense` | `consume`          | 非计划突发支出                   |
| `salary`           | 工资收入 | `income`  | `energy_gain`      | 主业收入                         |
| `side_income`      | 副业收入 | `income`  | `energy_gain`      | 主业外收入                       |
| `refund`           | 退款返还 | `income`  | `expense_reversal` | 购物退款、订单取消退款、报销返还 |
| `freedom_withdraw` | 储能解冻 | `income`  | `freedom_decrease` | 从储蓄或投资中取出               |
| `unknown`          | 未判断   | `neutral` | `ignore`           | 新场景、新现金流                 |

MVP 中不允许用户修改分类的 `id`、`direction`、`statEffect`。用户可以修改展示名称、图标、颜色和个人表达别名。

## 7. 自动复盘规则

```ts
type AutoReviewRule = {
  id: string
  descriptionKey: string
  categoryId: string
  direction: TransactionDirection
  statEffect: TransactionStatEffect
  satisfactionScore: ReviewScore | null
  valueAlignmentScore: ReviewScore | null
  freedomImpactScore: ReviewScore | null
  useCount: number
  averageAmount: number
  autoApply: boolean
  lastUsedAt: string
  createdAt: string
  updatedAt: string
}
```

`direction` 和 `statEffect` 可以从生命流向分类推导，但仍建议在规则和记录中冗余保存。原因是历史稳定性：如果用户未来调整分类展示名或分类配置，旧记录统计不应被意外改写。

自动复盘流程：

1. 用户创建现金流记录。
2. 系统计算 `energyHours`。
3. 系统生成 `descriptionKey`。
4. 查找匹配的 `AutoReviewRule`。
5. 未命中规则时，状态为 `unreviewed`。
6. 命中规则且金额正常时，状态为 `auto_reviewed`。
7. 命中规则但金额异常时，状态为 `suggested`。

金额异常规则：

```text
本次金额 > 历史平均金额 × 3
```

UI 文案不需要暴露阈值，只需提示“这次金额和平时差异较大，需要确认”。

## 8. 复盘状态转换

```text
新描述 -> unreviewed
命中规则且金额正常 -> auto_reviewed
命中规则但金额异常 -> suggested
用户确认 unreviewed -> reviewed，并创建规则
用户确认 suggested -> reviewed，并更新规则
用户修改 auto_reviewed -> reviewed，并更新规则
```

状态含义：

| 状态            | 含义                               | 是否进入待复盘页 |
| --------------- | ---------------------------------- | ---------------- |
| `unreviewed`    | 完全没有判断过，需要用户第一次复盘 | 是               |
| `suggested`     | 系统有建议，但需要用户确认         | 是               |
| `auto_reviewed` | 系统已根据历史规则自动复盘         | 否               |
| `reviewed`      | 用户亲自确认过                     | 否               |

## 9. 复盘判断规则

只有 `statEffect = 'consume'` 的记录必须填写三项判断：

- `satisfactionScore`
- `valueAlignmentScore`
- `freedomImpactScore`

`statEffect = 'freedom_increase'` 的记录建议填写 `valueAlignmentScore`，可默认 `1`。

以下类型可跳过三项判断：

- `energy_gain`
- `expense_reversal`
- `freedom_decrease`
- `ignore`

## 10. 统计规则

统计必须基于 `statEffect`。

| 指标             | 条件                                                    |
| ---------------- | ------------------------------------------------------- |
| 本月生命消耗     | `statEffect === 'consume'`                              |
| 满足感分析       | `statEffect === 'consume'`                              |
| 价值观一致性分析 | `statEffect in ['consume', 'freedom_increase']`         |
| 工作依赖成本     | `statEffect === 'consume' && freedomImpactScore === -1` |
| 自由积累         | `statEffect === 'freedom_increase'`                     |
| 储能解冻         | `statEffect === 'freedom_decrease'`                     |
| 收入补充         | `statEffect === 'energy_gain'`                          |
| 退款抵消         | `statEffect === 'expense_reversal'`                     |

注意：收入补充不等于可消费额度，退款抵消不等于收入，自由积累不等于投资净值。

## 11. 数据表草案

```sql
CREATE TABLE transactions (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  amount REAL NOT NULL,
  real_hourly_wage REAL NOT NULL,
  energy_hours REAL NOT NULL,
  description TEXT NOT NULL,
  description_key TEXT NOT NULL,
  category_id TEXT,
  direction TEXT,
  stat_effect TEXT,
  satisfaction_score INTEGER,
  value_alignment_score INTEGER,
  freedom_impact_score INTEGER,
  review_note TEXT,
  review_status TEXT NOT NULL DEFAULT 'unreviewed',
  reviewed_at TEXT,
  happened_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE life_flow_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  direction TEXT NOT NULL,
  stat_effect TEXT NOT NULL,
  icon TEXT,
  color_code TEXT,
  sort_order INTEGER DEFAULT 0,
  is_default INTEGER DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE auto_review_rules (
  id TEXT PRIMARY KEY,
  description_key TEXT NOT NULL UNIQUE,
  category_id TEXT NOT NULL,
  direction TEXT NOT NULL,
  stat_effect TEXT NOT NULL,
  satisfaction_score INTEGER,
  value_alignment_score INTEGER,
  freedom_impact_score INTEGER,
  use_count INTEGER DEFAULT 1,
  average_amount REAL DEFAULT 0,
  auto_apply INTEGER DEFAULT 1,
  last_used_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE user_settings (
  id TEXT PRIMARY KEY,
  monthly_after_tax_income REAL NOT NULL,
  monthly_commute_cost REAL NOT NULL,
  work_hours_per_day REAL NOT NULL,
  work_days_per_month REAL NOT NULL,
  commute_hours_per_day REAL NOT NULL,
  real_hourly_wage REAL NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```
