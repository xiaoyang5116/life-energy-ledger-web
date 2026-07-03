// 描述输入 + 相机占位

import { Camera } from "lucide-react"
import { Input } from "@/components/ui/input"

export function DescriptionInput({
  description,
  handleDescription,
}: {
  description: string
  handleDescription: (prev: string) => void
}) {
  return (
    <div className="relative">
      <Input
        value={description}
        onChange={(e) => handleDescription(e.target.value)}
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
  )
}
