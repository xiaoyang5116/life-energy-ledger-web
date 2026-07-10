// 数字键盘 + 确认键

import { Check, Delete, Loader2 } from "lucide-react"
import { KEYPAD_KEYS } from "@/components/layout/record-drawer/constants"

type AmountKeypadProps = {
  isSubmitting: boolean
  onAmountKeyDelete: () => void
  onAmountKeyInput: (key: string) => void
  onSubmitAnother: () => void
  onSubmit: () => void
}

export function AmountKeypad({
  isSubmitting,
  onAmountKeyDelete,
  onAmountKeyInput,
  onSubmitAnother,
  onSubmit,
}: AmountKeypadProps) {
  return (
    <div className="grid grid-cols-4 grid-rows-4 gap-2 p-3 select-none [--keypad-height:52px]">
      {KEYPAD_KEYS.map((key) => {
        if (key === "delete") {
          return (
            <button
              key={key}
              type="button"
              onClick={onAmountKeyDelete}
              disabled={isSubmitting}
              className="flex h-(--keypad-height) items-center justify-center rounded-lg bg-muted active:bg-muted/70 disabled:cursor-not-allowed disabled:opacity-50"
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
              disabled={isSubmitting}
              onClick={onSubmitAnother}
              className="flex h-(--keypad-height) items-center justify-center rounded-lg bg-muted text-base font-medium active:bg-muted/70 disabled:cursor-not-allowed disabled:opacity-50"
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
            disabled={isSubmitting}
            onClick={() => onAmountKeyInput(key)}
            className="flex h-(--keypad-height) items-center justify-center rounded-lg bg-muted text-xl font-medium active:bg-muted/70 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {key}
          </button>
        )
      })}

      {/* 确认键：右侧竖向贯穿后三行 */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitting}
        className="col-start-4 row-span-3 row-start-2 flex flex-col items-center justify-center gap-1 rounded-lg bg-foreground text-background active:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <Loader2 className="size-6 animate-spin" />
        ) : (
          <Check className="size-6" />
        )}
        <span className="text-sm">{isSubmitting ? "保存中" : "确认"}</span>
      </button>
    </div>
  )
}
