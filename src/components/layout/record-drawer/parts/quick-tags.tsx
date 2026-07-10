// 快捷标签

import { Button } from "@/components/ui/button"
import { QUICK_TAGS } from "@/components/layout/record-drawer/constants"

type QuickTagsProps = {
  onQuickTagSelect: (tag: string) => void
  isSubmitting: boolean
}

export function QuickTags({ onQuickTagSelect, isSubmitting }: QuickTagsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {QUICK_TAGS.map((tag) => (
        <Button
          key={tag}
          variant="outline"
          size="sm"
          disabled={isSubmitting}
          onClick={() => onQuickTagSelect(tag)}
          className="disabled:cursor-not-allowed disabled:opacity-50"
        >
          {tag}
        </Button>
      ))}
    </div>
  )
}
