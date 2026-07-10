export type RecordInputValidation =
  | { ok: true }
  | { ok: false; error: string }

type ValidateRecordInputParams = {
  hasRealHourlyWage: boolean
  amountValue: number
  description: string
}

export const validateRecordInput = ({
  hasRealHourlyWage,
  amountValue,
  description,
}: ValidateRecordInputParams): RecordInputValidation => {
  if (!hasRealHourlyWage) {
    return { ok: false, error: "请先设置真实时薪" }
  }

  if (amountValue <= 0) {
    return { ok: false, error: "请输入金额" }
  }

  if (description.trim() === "") {
    return { ok: false, error: "请输入描述" }
  }

  return { ok: true }
}
