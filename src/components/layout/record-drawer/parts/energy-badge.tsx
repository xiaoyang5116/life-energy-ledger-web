// 生命能量胶囊

import { Hourglass } from "lucide-react"

export function EnergyBadge({
  lifeEnergyHoursText,
}: {
  lifeEnergyHoursText: string
}) {
  return (
    <div className="flex justify-center">
      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
        <Hourglass className="size-3.5" />≈ {lifeEnergyHoursText}
      </span>
    </div>
  )
}
