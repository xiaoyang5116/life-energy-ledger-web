// 幽灵账开关

import { cn } from "@/lib/utils"

type GhostToggleProps = {
  isGhost: boolean
  toggleGhost: () => void
}

export function GhostToggle({ isGhost, toggleGhost }: GhostToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isGhost}
      onClick={toggleGhost}
      className="flex shrink-0 items-center gap-2"
    >
      <span className="text-sm text-muted-foreground select-none">幽灵账</span>
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
  )
}
