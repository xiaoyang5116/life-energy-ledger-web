// 描述输入 + 相机占位

import { Camera } from "lucide-react"
import { Input } from "@/components/ui/input"

type DescriptionInputProps = {
  description: string
  onDescriptionChange: (description: string) => void
  isSubmitting: boolean
}

export function DescriptionInput({
  description,
  onDescriptionChange,
  isSubmitting,
}: DescriptionInputProps) {
  return (
    <div className="relative">
      <Input
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        disabled={isSubmitting}
        placeholder="这一笔钱变成了什么？"
        className="h-11 pr-11 text-base disabled:cursor-not-allowed disabled:opacity-50"
      />
      {/* TODO(交互): 相机识别，本期仅占位 */}
      <button
        type="button"
        disabled={isSubmitting}
        className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="拍照识别"
      >
        <Camera className="size-5" />
      </button>
    </div>
  )
}
