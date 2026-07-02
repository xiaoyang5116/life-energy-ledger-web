import { useState } from "react"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { CalendarIcon, Camera, Check, Delete, Hourglass } from "lucide-react"

type RecordDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// 快捷描述标签：点击后把文案填入描述输入框。
// 注意：这里只是描述文案的快捷填充，不是生命流向分类，不写入 categoryId。
const QUICK_TAGS = ["续命咖啡", "加班打车", "外卖"]

// 数字键盘按键，按网格从左到右、从上到下排列。
// "delete" 为删除键、"collapse" 为收起键，其余为数字/小数点。
// 顺序保证第 1 行为 1 2 3 ⌫，最后一行为 . 0 ⌄；右侧确认键单独定位。
const KEYPAD_KEYS = [
  "1",
  "2",
  "3",
  "delete",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "again",
  "0",
  ".",
  // "collapse",
] as const

export function RecordDrawer({ open, onOpenChange }: RecordDrawerProps) {
  const [date, setDate] = useState<Date>(new Date())

  // 金额用字符串存储，便于处理小数点、前导零等中间态；提交时再转为 number。
  const [amount, setAmount] = useState("")

  // 描述：这一笔钱变成了什么。
  const [description, setDescription] = useState("")

  // 幽灵账：遇到突发状况时先挂起、暂不正式记入。此处只做开关 UI 状态。
  const [isGhost, setIsGhost] = useState(false)

  const displayAmount = amount || "0"

  // TODO(交互): 生命能量 = amount / realHourlyWage（真实时薪来自 user_settings）。
  // 现仅占位展示，接入设置后替换为真实换算。
  const energyHoursText = "0.8"

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
  function handleConfirm() {}

  function handleQuickTag(tag: string) {
    // TODO(交互): 确认填充策略（覆盖 / 追加 / 生成 descriptionKey）
    setDescription(tag)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="pb-[env(safe-area-inset-bottom)]">
        <DrawerHeader className="pb-0">
          <DrawerTitle className="sr-only">记录一笔</DrawerTitle>
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex w-full items-center justify-end">
                <Button variant="outline" size="sm">
                  <CalendarIcon className="h-4 w-4" />
                  {date?.toLocaleDateString()}
                </Button>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                captionLayout="dropdown"
                selected={date}
                onSelect={setDate}
                className="[--cell-size:--spacing(10)]"
                required
              />
            </PopoverContent>
          </Popover>
        </DrawerHeader>

        <div className="flex flex-col gap-4 px-4 pt-2">
          {/* 金额展示 */}
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-2xl font-medium text-muted-foreground">
              ¥
            </span>
            <span className="text-6xl font-bold tabular-nums">
              {displayAmount}
            </span>
          </div>

          {/* 生命能量胶囊 */}
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
              <Hourglass className="size-3.5" />≈ {energyHoursText} 小时生命能量
            </span>
          </div>

          {/* 描述输入 + 相机（相机暂为占位） */}
          <div className="relative">
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="这一笔钱变成了什么？"
              className="h-11 pr-11 text-base"
            />
            {/* TODO(交互): 相机识别，本期仅占位 */}
            <button
              type="button"
              className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground"
              aria-label="拍照识别"
            >
              <Camera className="size-5" />
            </button>
          </div>

          {/* 快捷标签 + 幽灵账开关 */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              {QUICK_TAGS.map((tag) => (
                <Button
                  key={tag}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickTag(tag)}
                >
                  {tag}
                </Button>
              ))}
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={isGhost}
              onClick={() => setIsGhost((prev) => !prev)}
              className="flex shrink-0 items-center gap-2"
            >
              <span className="text-sm text-muted-foreground select-none">
                幽灵账
              </span>
              <span
                className={cn(
                  "relative h-6 w-10 rounded-full transition-colors",
                  isGhost ? "bg-primary" : "bg-muted"
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 left-0.5 size-5 rounded-full bg-background shadow-sm transition-transform",
                    isGhost && "translate-x-4"
                  )}
                />
              </span>
            </button>
          </div>
        </div>

        {/* 数字键盘 */}
        <div className="grid grid-cols-4 grid-rows-4 gap-2 p-3 select-none">
          {KEYPAD_KEYS.map((key) => {
            if (key === "delete") {
              return (
                <button
                  key={key}
                  type="button"
                  onClick={handleDelete}
                  className="flex h-14 items-center justify-center rounded-lg bg-muted active:bg-muted/70"
                  aria-label="删除"
                >
                  <Delete className="size-6" />
                </button>
              )
            }

            if (key === "again") {
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {}}
                  className="flex h-14 items-center justify-center rounded-lg bg-muted text-xl font-medium active:bg-muted/70"
                  aria-label="再记"
                >
                  再记
                </button>
              )
            }

            return (
              <button
                key={key}
                type="button"
                onClick={() => handleKeyPress(key)}
                className="flex h-14 items-center justify-center rounded-lg bg-muted text-2xl font-medium active:bg-muted/70"
              >
                {key}
              </button>
            )
          })}

          {/* 确认键：右侧竖向贯穿后三行 */}
          <button
            type="button"
            onClick={handleConfirm}
            className="col-start-4 row-span-3 row-start-2 flex flex-col items-center justify-center gap-1 rounded-lg bg-foreground text-background active:opacity-90"
          >
            <Check className="size-6" />
            <span className="text-sm">确认</span>
          </button>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
