import { Tabbar, type TabItem } from "@/components/layout/tabbar"
import { createFileRoute, Outlet } from "@tanstack/react-router"
import { House, Settings, ChartNoAxesColumn } from "lucide-react"

export const Route = createFileRoute("/_tabs")({
  component: RouteComponent,
})

const tabs: TabItem[] = [
  { to: "/", label: "首页", icon: House },
  { to: "/neaten", label: "整理", icon: ChartNoAxesColumn },
  { to: "/setting", label: "设置", icon: Settings },
]

function RouteComponent() {
  return (
    <div className="relative min-h-svh bg-background pb-[calc(var(--tabbar-height)+env(safe-area-inset-bottom))] [--tabbar-height:60px]">
      {/* 顶部主内容视口 */}
      <main className="w-full px-4 py-3">
        <Outlet />
      </main>

      {/* 底部固定 Tabbar 外壳 */}
      <Tabbar items={tabs} />
    </div>
  )
}
