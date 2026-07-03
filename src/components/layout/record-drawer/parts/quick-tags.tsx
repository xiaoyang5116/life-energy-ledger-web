// 快捷标签

import { Button } from "@/components/ui/button"
import { QUICK_TAGS } from "@/components/layout/record-drawer/constants"

type QuickTagsProps = {
  handleQuickTag: (tag: string) => void
}

export function QuickTags({ handleQuickTag }: QuickTagsProps) {
  return (
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
  )
}
