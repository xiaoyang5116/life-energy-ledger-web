import { toDescriptionKey } from "@/features/ledger/descriptionKey"
import { toLifeEnergyHours } from "@/features/ledger/energy"
import type { RawTransaction } from "@/features/ledger/model"
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
