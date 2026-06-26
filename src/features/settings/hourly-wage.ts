export type SettingsFormValues = {
  monthlyAfterTaxIncome: string
  monthlyCommuteCost: string
  workHoursPerDay: string
  workDaysPerMonth: string
  commuteHoursPerDay: string
}

/** 真实时薪输入参数 */
export type RealHourlyWageInput = {
  monthlyAfterTaxIncome: number
  monthlyCommuteCost: number
  workHoursPerDay: number
  workDaysPerMonth: number
  commuteHoursPerDay: number
}

/**
 * 计算真实时薪。
 * - 如果税后月工资减去月通勤成本小于等于0，或者月工作时间加上月通勤时间小于等于0，则返回null。
 * - 否则返回真实时薪。
 */
export function calculateRealHourlyWage(
  input: RealHourlyWageInput
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

/**
 * 将表单值转换为真实时薪输入参数。
 * - 如果转换结果是有限数字，则返回其与0的较大值（即负数会变0）。
 * - 输入非法或无法转为有限数字，则返回0。
 */
export function toRealHourlyWageInput(
  formValues: SettingsFormValues
): RealHourlyWageInput {
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
