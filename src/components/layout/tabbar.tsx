import { cn } from "@/lib/utils"
import { Link } from "@tanstack/react-router"
import type { LucideIcon } from "lucide-react"

export type TabItem = {
  to: string
  label: string
  icon: LucideIcon
}

type TabbarProps = {
  items: TabItem[]
}

export function Tabbar({ items }: TabbarProps) {
  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 border-t border-border bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md">
      <div className="flex h-(--tabbar-height) items-center">
        {items.map((tab) => (
          <Link
            key={tab.to}
            to={tab.to}
            activeOptions={{ exact: true }}
            replace
            className="flex h-full flex-1 flex-col items-center justify-center gap-1 text-muted-foreground transition-colors"
          >
            {({ isActive }) => (
              <>
                <tab.icon
                  className={cn(
                    "h-5 w-5 transition-transform duration-200",
                    isActive
                      ? "scale-110 stroke-[2.5] text-primary"
                      : "text-muted-foreground"
                  )}
                />
                <span
                  className={cn(
                    "text-xs font-medium",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {tab.label}
                </span>
              </>
            )}
          </Link>
        ))}
      </div>
    </nav>
  )
}
