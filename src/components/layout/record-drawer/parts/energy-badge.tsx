// 生命能量胶囊

import { Hourglass } from "lucide-react"

type EnergyBadgeProps = {
  hasRealHourlyWage: boolean
  onRealHourlyWageClick: () => void
  lifeEnergyCaption: string
}

export function EnergyBadge({
  hasRealHourlyWage,
  onRealHourlyWageClick,
  lifeEnergyCaption,
}: EnergyBadgeProps) {
  return (
    <div className="flex justify-center">
      <span
        onClick={!hasRealHourlyWage ? onRealHourlyWageClick : undefined}
        className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground"
      >
        <Hourglass className="size-3.5" />≈ {lifeEnergyCaption}
      </span>
    </div>
  )
}
