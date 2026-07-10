import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"

import { appendAmountKey, deleteAmountKey } from "@/features/ledger/amount"
import { toLifeEnergyHours } from "@/features/ledger/energy"
import { useUserSettings } from "@/features/settings/queries"
import { createRawTransaction } from "@/features/ledger/transaction"
import { useAppendTransactions } from "@/features/ledger/queries"

export type UseRecordFormOptions = {
  onSubmitSuccess: () => void // 提交成功且需要关闭录入时
}

export type UseRecordFormResult = {
  values: {
    date: Date
    amount: string // 用户正在编辑的金额草稿（字符串）
    description: string
    isGhost: boolean
  }
  ui: {
    isCalendarOpen: boolean
  }
  derived: {
    displayAmount: string // amount || "0"，专供展示
    amountValue: number // Number(displayAmount)，供校验/提交
    hasRealHourlyWage: boolean
    isSubmitting: boolean
    lifeEnergyCaption: string
  }
  actions: {
    onDateChange: (date: Date) => void
    onCalendarOpenChange: (open: boolean) => void
    onAmountKeyInput: (key: string) => void
    onAmountKeyDelete: () => void
    onDescriptionChange: (description: string) => void
    onGhostChange: (isGhost: boolean) => void
    onQuickTagSelect: (tag: string) => void
    onSubmit: () => void
    onSubmitAnother: () => void
    onRealHourlyWageClick: () => void
  }
}

export function useRecordForm({
  onSubmitSuccess,
}: UseRecordFormOptions): UseRecordFormResult {
  const navigate = useNavigate()
  const userSettings = useUserSettings()

  const realHourlyWage = userSettings.data?.realHourlyWage ?? 0
  const hasRealHourlyWage = realHourlyWage > 0

  const { mutate: appendTransactionsMutate, isPending: isSubmitting } =
    useAppendTransactions()

  // 日期
  const [date, setDate] = useState<Date>(new Date())
  // 控制日期选择弹层的开关，便于选完日期后自动收起。
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  // 金额用字符串存储，便于处理小数点、前导零等中间态；提交时再转为 number。
  const [amount, setAmount] = useState("")
  // 描述：这一笔钱变成了什么。
  const [description, setDescription] = useState("")
  // 幽灵账：遇到突发状况时先挂起、暂不正式记入。此处只做开关 UI 状态。
  const [isGhost, setIsGhost] = useState(false)

  const displayAmount = amount || "0" // 金额字符串
  const amountValue = Number(displayAmount) // 金额数值

  // 生命能量小时数文案
  const lifeEnergyCaption: string = hasRealHourlyWage
    ? `${toLifeEnergyHours(amountValue, realHourlyWage).toFixed(1)} 小时生命能量`
    : "点击此处设置真实时薪后可预估生命能量"

  function onCalendarOpenChange(open: boolean) {
    setIsCalendarOpen(open)
  }

  function onDateChange(nextDate: Date) {
    setDate(nextDate)
  }

  function onGhostChange(nextIsGhost: boolean) {
    setIsGhost(nextIsGhost)
  }

  function onRealHourlyWageClick() {
    onSubmitSuccess()
    navigate({ to: "/setting" })
  }

  function onDescriptionChange(nextDescription: string) {
    setDescription(nextDescription)
  }

  function onQuickTagSelect(tag: string) {
    setDescription(tag)
  }

  function reset() {
    setAmount("")
    setDescription("")
    setIsGhost(false)
    setDate(new Date())
    setIsCalendarOpen(false)
  }

  function submit(mode: "close" | "again") {
    if (!hasRealHourlyWage) {
      toast.error("请先设置真实时薪", {
        position: "top-center",
        action: {
          label: "去设置",
          onClick: () => navigate({ to: "/setting" }),
        },
      })

      return
    }

    if (amountValue <= 0) {
      toast.error("请输入金额", {
        position: "top-center",
      })
      return
    }

    if (description.trim() === "") {
      toast.error("请输入描述", {
        position: "top-center",
      })
      return
    }

    if (isSubmitting) return

    const now = new Date()
    const rawTransaction = createRawTransaction(
      {
        date: date,
        amount: amountValue,
        description: description.trim(),
        realHourlyWage: userSettings.data?.realHourlyWage ?? 0,
      },
      now
    )

    appendTransactionsMutate(rawTransaction, {
      onSuccess: () => {
        toast.success(
          "记录成功: " +
            rawTransaction.description +
            " " +
            rawTransaction.amount,
          {
            position: "top-center",
          }
        )

        if (mode === "close") {
          reset()
          onSubmitSuccess()
        } else if (mode === "again") {
          reset()
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

  function onAmountKeyInput(key: string) {
    setAmount((prev) => appendAmountKey(prev, key))
  }

  function onAmountKeyDelete() {
    setAmount((prev) => deleteAmountKey(prev))
  }

  function onSubmitAnother() {
    submit("again")
  }

  function onSubmit() {
    submit("close")
  }

  return {
    values: {
      date,
      amount,
      description,
      isGhost,
    },
    ui: {
      isCalendarOpen,
    },
    derived: {
      displayAmount,
      amountValue,
      hasRealHourlyWage,
      isSubmitting,
      lifeEnergyCaption,
    },
    actions: {
      onDateChange,
      onCalendarOpenChange,
      onRealHourlyWageClick,
      onDescriptionChange,
      onGhostChange,
      onQuickTagSelect,
      onAmountKeyInput,
      onAmountKeyDelete,
      onSubmitAnother,
      onSubmit,
    },
  }
}
