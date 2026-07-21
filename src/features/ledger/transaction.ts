import { toDescriptionKey } from "@/features/ledger/descriptionKey"
import { toLifeEnergyHours } from "@/features/ledger/energy"
import type { RawTransaction, Transaction } from "@/features/ledger/model"
import { createId, toDateYYYYMMDD } from "@/lib/utils"

type CreateRawTransactionInput = {
  date: Date
  amount: number
  description: string
  realHourlyWage: number
}

export function createRawTransaction(
  input: CreateRawTransactionInput,
  now: Date
): RawTransaction {
  return {
    id: createId(),
    date: toDateYYYYMMDD(input.date),
    amount: input.amount,
    realHourlyWage: input.realHourlyWage,
    energyHours: toLifeEnergyHours(input.amount, input.realHourlyWage),
    description: input.description,
    descriptionKey: toDescriptionKey(input.description),
    reviewStatus: "unreviewed",
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  }
}

// 获取 待复盘 交易记录
export function getPendingReviewTransactions(
  transactions: Transaction[]
): Transaction[] {
  // 未匹配到自动复盘规则 或 金额异常 的交易记录
  return transactions.filter(
    (transaction) =>
      transaction.reviewStatus === "unreviewed" ||
      transaction.reviewStatus === "suggested"
  )
}

export type UnreviewedGroup = {
  descriptionKey: string
  description: string
  count: number
  totalAmount: number
  totalLifeEnergyHours: number
  transactions: Transaction[]
}

/** 按 descriptionKey 聚合待复盘记录 */
export function processUnreviewedTransactions(
  unreviewedTransactions: Transaction[]
): UnreviewedGroup[] {
  const unreviewedTransactionsList: UnreviewedGroup[] = []

  for (const transaction of unreviewedTransactions) {
    const index = unreviewedTransactionsList.findIndex(
      (item) => item.descriptionKey === transaction.descriptionKey
    )
    if (index === -1) {
      unreviewedTransactionsList.push({
        descriptionKey: transaction.descriptionKey,
        description: transaction.description,
        count: 1,
        totalAmount: transaction.amount,
        totalLifeEnergyHours: transaction.energyHours,
        transactions: [transaction],
      })
    } else {
      unreviewedTransactionsList[index].count += 1
      unreviewedTransactionsList[index].totalAmount += transaction.amount
      unreviewedTransactionsList[index].totalLifeEnergyHours +=
        transaction.energyHours
      unreviewedTransactionsList[index].transactions.push(transaction)
    }
  }

  return unreviewedTransactionsList
}
