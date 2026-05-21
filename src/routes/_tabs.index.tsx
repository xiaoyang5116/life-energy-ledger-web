import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_tabs/")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">推荐内容</h1>
      {/* 这里可以引入 features/home/components 中的业务组件 */}
    </div>
  )
}
