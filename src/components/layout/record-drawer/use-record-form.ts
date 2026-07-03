import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"

import { appendAmountKey, deleteAmountKey } from "@/features/ledger/amount"
import { toEnergyHours } from "@/features/ledger/energy"
import { useUserSettings } from "@/features/settings/queries"
import { createRawTransaction } from "@/features/ledger/transaction"
import { useSaveTransactions } from "@/features/ledger/queries"

export type UseRecordFormOptions = {
  onSubmitted: () => void // 提交成功后（如关闭 Drawer / 再记）
}

export function useRecordForm({ onSubmitted }: UseRecordFormOptions) {
  const userSettings = useUserSettings()
  const realHourlyWage = userSettings.data?.realHourlyWage ?? 0
  const hasWage = realHourlyWage > 0

  const { mutate: saveTransactionsMutate } = useSaveTransactions()
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

  const canSubmit = numericAmount > 0 && hasWage // 是否可提交

  // 生命能量小时数
  const lifeEnergyHoursText: string = hasWage
    ? `${toEnergyHours(Number(amount), realHourlyWage).toFixed(1)} 小时生命能量`
    : "点击此处设置真实时薪后可预估生命能量"

  function onWageClick() {
    onSubmitted()
    navigate({ to: "/setting" })
  }

  function submit() {
    // if (!hasWage) { 弹 toast 引导去设置; return false }
    if (!hasWage) {
      toast.error("请先设置真实时薪", {
        position: "top-center",
        action: {
          label: "去设置",
          onClick: () => navigate({ to: "/setting" }),
        },
      })
    }
    // if (numericAmount <= 0) return false（金额为 0 时静默拦下）
    if (numericAmount <= 0) {
      return
    }

    // createRawTransaction
    const now = new Date()
    const rawTransaction = createRawTransaction(
      {
        date: date,
        amount: Number(amount),
        description,
        realHourlyWage: userSettings.data?.realHourlyWage ?? 0,
      },
      now
    )
    console.log("rawTransaction", rawTransaction)
  }

  function handleKeyPress(key: string) {
    setAmount((prev) => appendAmountKey(prev, key))
  }

  function handleDelete() {
    setAmount((prev) => deleteAmountKey(prev))
  }

  function handleAgain() {}

  // TODO(交互): 提交记录
  // - 生成 RawTransaction（date / amount / description + 系统字段）
  // - 计算 energyHours、descriptionKey、reviewStatus
  // - isGhost 为 true 时按“挂起/暂不记入”处理
  // - 金额为空或为 0 时禁止提交
  function handleConfirm() {
    submit()
    // onSubmitted()
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
    onWageClick,
    date,
    setDate,
    calendarOpen,
    setCalendarOpen,
    displayAmount, // amount || "0"
    description,
    // setDescription,
    isGhost,
    toggleGhost,
    lifeEnergyHoursText,
    // canSubmit, // amount 非空且 > 0，供确认键 disabled 用
    handleKeyPress,
    handleDelete,
    handleAgain,
    handleConfirm,
    handleDescription,
    handleQuickTag,
  }
}
