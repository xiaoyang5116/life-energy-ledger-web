// 金额展示

type AmountDisplayProps = {
  displayAmount: string
}

export function AmountDisplay({ displayAmount }: AmountDisplayProps) {
  return (
    <div className="flex items-baseline justify-center gap-1">
      <span className="text-2xl font-medium text-muted-foreground">¥</span>
      <span className="text-6xl font-bold tabular-nums">{displayAmount}</span>
    </div>
  )
}
