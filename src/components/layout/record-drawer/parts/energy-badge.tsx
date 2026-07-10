import { Hourglass } from "lucide-react"

type EnergyBadgeProps = {
  hasRealHourlyWage: boolean
  onRealHourlyWageClick: () => void
  lifeEnergyCaption: string
}

export const EnergyBadge = ({
  hasRealHourlyWage,
  onRealHourlyWageClick,
  lifeEnergyCaption,
}: EnergyBadgeProps) => {
  const content = (
    <>
      <Hourglass className="size-3.5" />≈ {lifeEnergyCaption}
    </>
  )

  if (!hasRealHourlyWage) {
    return (
      <div className="flex justify-center">
        <button
          type="button"
          onClick={onRealHourlyWageClick}
          aria-label="去设置真实时薪"
          className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground"
        >
          {content}
        </button>
      </div>
    )
  }

  return (
    <div className="flex justify-center">
      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
        {content}
      </span>
    </div>
  )
}
