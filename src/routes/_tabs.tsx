import { createFileRoute, Link, Outlet } from "@tanstack/react-router"
import { House, Settings, ChartNoAxesColumn } from "lucide-react"

export const Route = createFileRoute("/_tabs")({
  component: RouteComponent,
})

function RouteComponent() {
  const tabs = [
    { to: "/", label: "首页", icon: House },
    { to: "/neaten", label: "整理", icon: ChartNoAxesColumn },
    { to: "/setting", label: "设置", icon: Settings },
  ] as const

  return (
    <div className="relative min-h-dvh bg-background pb-[calc(60px+env(safe-area-inset-bottom))]">
      {/* 顶部主内容视口 */}
      <main className="w-full px-4 py-3">
        <Outlet />
      </main>

      {/* 底部固定 Tabbar 外壳 */}
      <nav className="fixed right-0 bottom-0 left-0 z-50 border-t border-border bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md">
        <div className="flex h-15 items-center justify-around">
          {tabs.map((tab) => (
            <Link
              key={tab.to}
              to={tab.to}
              // hash-routing 或 exact 匹配模式，TanStack 默认能完美处理 active 状态
              activeOptions={{ exact: true }}
              className="flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors"
            >
              {/* 利用回调渲染函数，当该路由激活时自动变换样式 */}
              {({ isActive }) => (
                <>
                  <tab.icon
                    className={`h-5 w-5 transition-transform duration-200 ${
                      isActive
                        ? "scale-110 stroke-[2.5] text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                  <span
                    className={`text-xs font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}
                  >
                    {tab.label}
                  </span>
                </>
              )}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}
