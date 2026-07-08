// 快捷标签

import { Button } from "@/components/ui/button"
import { QUICK_TAGS } from "@/components/layout/record-drawer/constants"

type QuickTagsProps = {
  handleQuickTag: (tag: string) => void
  isAppending: boolean
}

export function QuickTags({ handleQuickTag, isAppending }: QuickTagsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {QUICK_TAGS.map((tag) => (
        <Button
          key={tag}
          variant="outline"
          size="sm"
          disabled={isAppending}
          onClick={() => handleQuickTag(tag)}
          className="disabled:cursor-not-allowed disabled:opacity-50"
        >
          {tag}
        </Button>
      ))}
    </div>
  )
}
