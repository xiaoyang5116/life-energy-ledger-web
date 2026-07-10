import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"

import { appendAmountKey, deleteAmountKey } from "@/features/ledger/amount"
import { toLifeEnergyHours } from "@/features/ledger/energy"
import { useUserSettings } from "@/features/settings/queries"
import { createRawTransaction } from "@/features/ledger/transaction"
import { useAppendTransactions } from "@/features/ledger/queries"
import { validateRecordInput } from "@/components/layout/record-drawer/validate-record-input"

export type UseRecordFormOptions = {
  onClose: () => void
}

export type UseRecordFormResult = {
  date: Date
  description: string
  isCalendarOpen: boolean
  displayAmount: string
  hasRealHourlyWage: boolean
  isSubmitting: boolean
  lifeEnergyCaption: string
  setDate: (date: Date) => void
  setIsCalendarOpen: (open: boolean) => void
  setDescription: (description: string) => void
  reset: () => void
  handleQuickTagSelect: (tag: string) => void
  handleAmountKeyInput: (key: string) => void
  handleAmountKeyDelete: () => void
  handleSubmit: () => void
  handleSubmitAnother: () => void
  handleRealHourlyWageClick: () => void
}

export const useRecordForm = ({
  onClose,
}: UseRecordFormOptions): UseRecordFormResult => {
  const navigate = useNavigate()
  const userSettings = useUserSettings()

  const realHourlyWage = userSettings.data?.realHourlyWage ?? 0
  const hasRealHourlyWage = realHourlyWage > 0

  const { mutate: appendTransactionsMutate, isPending: isSubmitting } =
    useAppendTransactions()

  const [date, setDate] = useState<Date>(() => new Date())
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  // 金额用字符串存储，便于处理小数点、前导零等中间态；提交时再转为 number。
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")

  const displayAmount = amount || "0"
  const amountValue = Number(displayAmount)

  const lifeEnergyCaption = hasRealHourlyWage
    ? `${toLifeEnergyHours(amountValue, realHourlyWage).toFixed(1)} 小时生命能量`
    : "点击此处设置真实时薪后可预估生命能量"

  const reset = () => {
    setAmount("")
    setDescription("")
    setDate(new Date())
    setIsCalendarOpen(false)
  }

  const handleGoToSettings = () => {
    reset()
    onClose()
    navigate({ to: "/setting" })
  }

  const handleRealHourlyWageClick = () => {
    handleGoToSettings()
  }

  const handleQuickTagSelect = (tag: string) => {
    setDescription(tag)
  }

  const handleAmountKeyInput = (key: string) => {
    setAmount((prev) => appendAmountKey(prev, key))
  }

  const handleAmountKeyDelete = () => {
    setAmount((prev) => deleteAmountKey(prev))
  }

  const submit = (mode: "close" | "again") => {
    const validation = validateRecordInput({
      hasRealHourlyWage,
      amountValue,
      description,
    })

    if (!validation.ok) {
      if (validation.error === "请先设置真实时薪") {
        toast.error(validation.error, {
          position: "top-center",
          action: {
            label: "去设置",
            onClick: handleGoToSettings,
          },
        })
        return
      }

      toast.error(validation.error, {
        position: "top-center",
      })
      return
    }

    if (isSubmitting) return

    const now = new Date()
    const rawTransaction = createRawTransaction(
      {
        date,
        amount: amountValue,
        description: description.trim(),
        realHourlyWage,
      },
      now
    )

    appendTransactionsMutate(rawTransaction, {
      onSuccess: () => {
        toast.success(
          `记录成功: ${rawTransaction.description} ${rawTransaction.amount}`,
          {
            position: "top-center",
          }
        )

        reset()

        if (mode === "close") {
          onClose()
        }
      },
      onError: (error) => {
        console.error(error)
        toast.error("记录失败", {
          position: "top-center",
        })
      },
    })
  }

  const handleSubmitAnother = () => {
    submit("again")
  }

  const handleSubmit = () => {
    submit("close")
  }

  return {
    date,
    description,
    isCalendarOpen,
    displayAmount,
    hasRealHourlyWage,
    isSubmitting,
    lifeEnergyCaption,
    setDate,
    setIsCalendarOpen,
    setDescription,
    reset,
    handleQuickTagSelect,
    handleAmountKeyInput,
    handleAmountKeyDelete,
    handleSubmit,
    handleSubmitAnother,
    handleRealHourlyWageClick,
  }
}
