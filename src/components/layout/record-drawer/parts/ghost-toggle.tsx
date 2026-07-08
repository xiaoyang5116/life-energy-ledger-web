// 幽灵账开关

import { cn } from "@/lib/utils"

type GhostToggleProps = {
  isGhost: boolean
  toggleGhost: () => void
  isAppending: boolean
}

export function GhostToggle({
  isGhost,
  toggleGhost,
  isAppending,
}: GhostToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isGhost}
      aria-disabled={isAppending}
      disabled={isAppending}
      onClick={toggleGhost}
      className="flex shrink-0 items-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
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
