import { useState } from "react"

export type UseRecordFormOptions = {
  onSubmitted?: () => void // 提交成功后（如关闭 Drawer / 再记）
}

export function useRecordForm({ onSubmitted }: UseRecordFormOptions) {
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

  const displayAmount = amount || "0"

  // TODO(交互): 生命能量 = amount / realHourlyWage（真实时薪来自 user_settings）。
  // 现仅占位展示，接入设置后替换为真实换算。
  const lifeEnergyHoursText = "0.8"

  function handleKeyPress(key: string) {
    // TODO(交互): 补充输入校验
    // - 只允许一个小数点
    // - 小数最多 2 位
    // - 禁止 "0" 后再接数字（如 08 非法），但允许 "0."
    setAmount((prev) => prev + key)
  }

  function handleDelete() {
    setAmount((prev) => prev.slice(0, -1))
  }

  // TODO(交互): 提交记录
  // - 生成 RawTransaction（date / amount / description + 系统字段）
  // - 计算 energyHours、descriptionKey、reviewStatus
  // - isGhost 为 true 时按“挂起/暂不记入”处理
  // - 金额为空或为 0 时禁止提交
  function handleConfirm() {
    onSubmitted?.()
  }

  function handleQuickTag(tag: string) {
    // TODO(交互): 确认填充策略（覆盖 / 追加 / 生成 descriptionKey）
    setDescription(tag)
  }

  return {
    date,
    setDate,
    calendarOpen,
    setCalendarOpen,
    displayAmount, // amount || "0"
    description,
    setDescription,
    isGhost,
    toggleGhost,
    lifeEnergyHoursText, // 暂时占位 "0.8"，未来接真实时薪
    // canSubmit, // amount 非空且 > 0，供确认键 disabled 用
    handleKeyPress,
    handleDelete,
    handleConfirm,
    handleQuickTag,
  }
}
