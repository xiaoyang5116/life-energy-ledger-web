import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"

import { appendAmountKey, deleteAmountKey } from "@/features/ledger/amount"
import { toEnergyHours } from "@/features/ledger/energy"
import { useUserSettings } from "@/features/settings/queries"
import { createRawTransaction } from "@/features/ledger/transaction"
import { useAppendTransactions } from "@/features/ledger/queries"

export type UseRecordFormOptions = {
  onSubmitted: () => void // 提交成功后（如关闭 Drawer / 再记）
}

export function useRecordForm({ onSubmitted }: UseRecordFormOptions) {
  const userSettings = useUserSettings()
  const realHourlyWage = userSettings.data?.realHourlyWage ?? 0
  const hasWage = realHourlyWage > 0

  const { mutate: appendTransactionsMutate, isPending: isAppending } =
    useAppendTransactions()
  const navigate = useNavigate()

  const [date, setDate] = useState<Date>(new Date())

  // 控制日期选择弹层的开关，便于选完日期后自动收起。
  const [calendarOpen, setCalendarOpen] = useState(false)

  // 金额用字符串存储，便于处理小数点、前导零等中间态；提交时再转为 number。
  const [amount, setAmount] = useState("")

  // 描述：这一笔钱变成了什么。
  const [description, setDescription] = useState("")

  // 幽灵账：遇到突发状况时先挂起、暂不正式记入。此处只做开关 UI 状态。
  const [isGhost, setIsGhost] = useState(false)
  const toggleGhost = () => setIsGhost((prev) => !prev)

  const displayAmount = amount || "0" // 金额字符串
  const numericAmount = Number(displayAmount) // 金额数值

  // 生命能量小时数
  const lifeEnergyHoursText: string = hasWage
    ? `${toEnergyHours(Number(amount), realHourlyWage).toFixed(1)} 小时生命能量`
    : "点击此处设置真实时薪后可预估生命能量"

  function onWageClick() {
    onSubmitted()
    navigate({ to: "/setting" })
  }

  function submit(mode: "close" | "again") {
    if (!hasWage) {
      toast.error("请先设置真实时薪", {
        position: "top-center",
        action: {
          label: "去设置",
          onClick: () => navigate({ to: "/setting" }),
        },
      })

      return
    }

    if (numericAmount <= 0) {
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

    if (isAppending) return

    const now = new Date()
    const rawTransaction = createRawTransaction(
      {
        date: date,
        amount: numericAmount,
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
          onSubmitted()
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

  function handleKeyPress(key: string) {
    setAmount((prev) => appendAmountKey(prev, key))
  }

  function handleDelete() {
    setAmount((prev) => deleteAmountKey(prev))
  }

  function reset() {
    setAmount("")
    setDescription("")
    setIsGhost(false)
    setDate(new Date())
    setCalendarOpen(false)
  }

  function handleAgain() {
    submit("again")
  }

  function handleConfirm() {
    submit("close")
  }

  function handleDescription(prev: string) {
    setDescription(prev)
  }

  function handleQuickTag(tag: string) {
    // TODO(交互): 确认填充策略（覆盖 / 追加 / 生成 descriptionKey）
    setDescription(tag)
  }

  return {
    hasWage,
    isAppending,
    onWageClick,
    date,
    setDate,
    calendarOpen,
    setCalendarOpen,
    displayAmount, // amount || "0"
    description,
    isGhost,
    toggleGhost,
    lifeEnergyHoursText,
    handleKeyPress,
    handleDelete,
    handleAgain,
    handleConfirm,
    handleDescription,
    handleQuickTag,
  }
}
