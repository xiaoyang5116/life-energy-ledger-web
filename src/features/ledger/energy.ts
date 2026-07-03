/**
 * 计算生命能量小时数
 * @param amount 金额
 * @param realHourlyWage 真实时薪
 * @returns 生命能量小时数
 */
export function toEnergyHours(amount: number, realHourlyWage: number): number {
  if (amount <= 0 || realHourlyWage <= 0) {
    return 0
  }
  return amount / realHourlyWage
}
