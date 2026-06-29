/** 计算真实时薪的参数 */
export type TCalculateRealHourlyWageArgs = {
  monthlyAfterTaxIncome: number
  monthlyCommuteCost: number
  workHoursPerDay: number
  workDaysPerMonth: number
  commuteHoursPerDay: number
}

/** 计算真实时薪表单字段类型 */
export type TCalculateRealHourlyWageFormFields = Record<
  keyof TCalculateRealHourlyWageArgs,
  string
>

/** 计算真实时薪 */
export function calculateRealHourlyWage(
  input: TCalculateRealHourlyWageArgs
): number | null {
  const monthlyWorkHours = input.workHoursPerDay * input.workDaysPerMonth
  const monthlyCommuteHours = input.commuteHoursPerDay * input.workDaysPerMonth
  const availableIncome = input.monthlyAfterTaxIncome - input.monthlyCommuteCost
  const totalWorkRelatedHours = monthlyWorkHours + monthlyCommuteHours

  if (availableIncome <= 0 || totalWorkRelatedHours <= 0) {
    return null
  }

  return availableIncome / totalWorkRelatedHours
}

/**
 * 解析字符串为非负数。
 * - 如果转换结果是有限数字，则返回其与0的较大值（即负数会变0）。
 * - 输入非法或无法转为有限数字，则返回0。
 */
export function parseNonNegativeNumber(value: string) {
  const parsedValue = Number(value)

  return Number.isFinite(parsedValue) ? Math.max(parsedValue, 0) : 0
}

/** 将表单值转换为计算真实时薪的参数 */
export function toCalculateRealHourlyWageArgs(
  formValues: TCalculateRealHourlyWageFormFields
): TCalculateRealHourlyWageArgs {
  return {
    monthlyAfterTaxIncome: parseNonNegativeNumber(
      formValues.monthlyAfterTaxIncome
    ),
    monthlyCommuteCost: parseNonNegativeNumber(formValues.monthlyCommuteCost),
    workHoursPerDay: parseNonNegativeNumber(formValues.workHoursPerDay),
    workDaysPerMonth: parseNonNegativeNumber(formValues.workDaysPerMonth),
    commuteHoursPerDay: parseNonNegativeNumber(formValues.commuteHoursPerDay),
  }
}

/** 将计算真实时薪的参数转换为表单值 */
export function toCalculateRealHourlyWageFormFields(
  args: TCalculateRealHourlyWageArgs
): TCalculateRealHourlyWageFormFields {
  return {
    monthlyAfterTaxIncome: String(args.monthlyAfterTaxIncome),
    monthlyCommuteCost: String(args.monthlyCommuteCost),
    workHoursPerDay: String(args.workHoursPerDay),
    workDaysPerMonth: String(args.workDaysPerMonth),
    commuteHoursPerDay: String(args.commuteHoursPerDay),
  }
}

/** 计算真实时薪表单默认值 */
export const calculateRealHourlyWageFormDefaultValues: TCalculateRealHourlyWageFormFields =
  {
    monthlyAfterTaxIncome: "",
    monthlyCommuteCost: "",
    workHoursPerDay: "",
    workDaysPerMonth: "",
    commuteHoursPerDay: "",
  }
