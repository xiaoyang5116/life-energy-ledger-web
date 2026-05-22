/**
 * 现金流方向。
 * 只表达钱的流入、流出、转移或暂不判断，不用于决定统计归属。
 */
export type TransactionDirection = "expense" | "income" | "transfer" | "neutral"

/**
 * 统计影响。
 * 首页统计和复盘分析必须基于这个字段，而不是金额正负号或分类名称。
 */
export type TransactionStatEffect =
  | "consume"
  | "energy_gain"
  | "freedom_increase"
  | "freedom_decrease"
  | "expense_reversal"
  | "ignore"

/** 复盘判断：-1 偏负向，0 中性，1 偏正向。 */
export type ReviewScore = -1 | 0 | 1

/** 复盘状态，决定记录是否进入待复盘页。 */
export type ReviewStatus =
  | "unreviewed"
  | "suggested"
  | "auto_reviewed"
  | "reviewed"

/**
 * 原始现金流记录。
 * 表示用户输入的一笔金额事实，不等同于消费记录。
 */
export type RawTransaction = {
  /** 记录 ID */
  id: string
  /** 发生日期，用于按天、月统计 */
  date: string
  /** 用户输入金额，始终保存为正数 */
  amount: number
  /** 金额按真实时薪换算出的生命能量小时数 */
  energyHours: number
  /** 用户输入的原始描述 */
  description: string
  /** 标准化后的描述，用于匹配自动复盘规则 */
  descriptionKey: string
  /** 当前复盘状态 */
  reviewStatus: ReviewStatus
  /** 创建时间 */
  createdAt: string
  /** 更新时间 */
  updatedAt: string
}

/**
 * 已复盘现金流记录。
 * 在原始事实上补充生命流向、统计影响和复盘判断。
 */
export type ReviewedTransaction = RawTransaction & {
  /** 生命流向分类 ID */
  categoryId: string
  /** 现金流方向 */
  direction: TransactionDirection
  /** 统计影响 */
  statEffect: TransactionStatEffect
  /** 满足感判断 */
  satisfactionScore: ReviewScore | null
  /** 价值观一致性判断 */
  valueAlignmentScore: ReviewScore | null
  /** 自由影响判断 */
  freedomImpactScore: ReviewScore | null
  /** 可选复盘备注 */
  reviewNote?: string
  /** 最近一次人工确认或系统自动复盘时间 */
  reviewedAt: string
}

/** 现金流记录：可能尚未复盘，也可能已经完成复盘。 */
export type Transaction = RawTransaction | ReviewedTransaction

/**
 * 生命流向分类。
 * 它不是传统账目分类，而是用户理解生命能量流向的方式。
 */
export type LifeFlowCategory = {
  /** 分类 ID，MVP 阶段不允许用户修改 */
  id: string
  /** 用户可见名称 */
  name: string
  /** 分类说明 */
  description: string
  /** 分类内置的现金流方向 */
  direction: TransactionDirection
  /** 分类内置的统计影响 */
  statEffect: TransactionStatEffect
  /** 可选图标标识 */
  icon?: string
  /** 可选颜色标识 */
  colorCode?: string
  /** 展示排序 */
  sortOrder: number
  /** 是否为系统默认分类 */
  isDefault: boolean
}

/**
 * 自动复盘规则。
 * 用相同 descriptionKey 复用历史复盘判断，降低重复整理成本。
 */
export type AutoReviewRule = {
  /** 规则 ID */
  id: string
  /** 标准化描述，作为规则匹配键 */
  descriptionKey: string
  /** 命中的生命流向分类 ID */
  categoryId: string
  /** 冗余保存现金流方向，保证历史统计稳定 */
  direction: TransactionDirection
  /** 冗余保存统计影响，保证历史统计稳定 */
  statEffect: TransactionStatEffect
  /** 满足感判断 */
  satisfactionScore: ReviewScore | null
  /** 价值观一致性判断 */
  valueAlignmentScore: ReviewScore | null
  /** 自由影响判断 */
  freedomImpactScore: ReviewScore | null
  /** 规则使用次数 */
  useCount: number
  /** 历史平均金额，用于判断本次金额是否异常 */
  averageAmount: number
  /** 是否自动应用该规则 */
  autoApply: boolean
  /** 最近使用时间 */
  lastUsedAt: string
  /** 创建时间 */
  createdAt: string
  /** 更新时间 */
  updatedAt: string
}

/** 用户设置，用于计算真实时薪和生命能量。 */
export type UserSettings = {
  /** 设置 ID */
  id: string
  /** 税后月工资 */
  monthlyAfterTaxIncome: number
  /** 月通勤成本 */
  monthlyCommuteCost: number
  /** 每日工作小时 */
  workHoursPerDay: number
  /** 每月工作天数 */
  workDaysPerMonth: number
  /** 每日通勤小时 */
  commuteHoursPerDay: number
  /** 真实时薪 */
  realHourlyWage: number
  /** 创建时间 */
  createdAt: string
  /** 更新时间 */
  updatedAt: string
}
