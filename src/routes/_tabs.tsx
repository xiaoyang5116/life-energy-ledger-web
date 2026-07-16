import { useState } from "react"

import { FloatingBubble } from "@/components/layout/floating-bubble"
import { Tabbar, type TabItem } from "@/components/layout/tabbar"
import { Button } from "@/components/ui/button"
import { createFileRoute, Outlet } from "@tanstack/react-router"
import { House, Settings, ChartNoAxesColumn, Plus } from "lucide-react"
import { RecordDrawer } from "@/components/layout/record-drawer"

export const Route = createFileRoute("/_tabs")({
  component: RouteComponent,
})

const tabs: TabItem[] = [
  { to: "/", label: "首页", icon: House },
  { to: "/review", label: "待复盘", icon: ChartNoAxesColumn },
  { to: "/setting", label: "设置", icon: Settings },
]

function RouteComponent() {
  const [recordDrawerOpen, setRecordDrawerOpen] = useState(false)

  return (
    <div className="relative min-h-svh bg-background pb-[calc(var(--tabbar-height)+env(safe-area-inset-bottom))] [--tabbar-height:60px]">
      {/* 顶部主内容视口 */}
      <main className="w-full px-4 py-3">
        <Outlet />
      </main>

      {/* 底部固定 Tabbar 外壳 */}
      <Tabbar items={tabs} />

      <FloatingBubble
        bottomInset={90}
        defaultOffsetY={30}
        onClick={() => setRecordDrawerOpen(true)}
      >
        <Button
          variant="default"
          className="pointer-events-none flex size-full items-center justify-center rounded-full"
        >
          <Plus className="size-8" />
        </Button>
      </FloatingBubble>

      <RecordDrawer
        open={recordDrawerOpen}
        onOpenChange={setRecordDrawerOpen}
      />
    </div>
  )
}
