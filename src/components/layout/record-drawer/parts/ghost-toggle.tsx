// 幽灵账开关

import { QUICK_TAGS } from "@/components/layout/record-drawer/constants"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function GhostToggle({
  isGhost,
  toggleGhost,
  handleQuickTag,
}: {
  isGhost: boolean
  toggleGhost: React.Dispatch<React.SetStateAction<boolean>>
  handleQuickTag: (tag: string) => void
}) {
  return (
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
        onClick={() => toggleGhost((prev) => !prev)}
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
  )
}
