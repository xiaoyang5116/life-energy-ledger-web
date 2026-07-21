import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useTransactions } from "@/features/ledger/queries"
import {
  getPendingReviewTransactions,
  processUnreviewedTransactions,
} from "@/features/ledger/transaction"
import { createFileRoute } from "@tanstack/react-router"
import { ReviewPop } from "@/components/review/review-pop"

export const Route = createFileRoute("/_tabs/review")({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: transactions, isLoading } = useTransactions()
  const [reviewPopOpen, setReviewPopOpen] = useState(false)

  if (isLoading) {
    return <div className="p-6 text-sm text-muted-foreground">加载中…</div>
  }

  const pendingReview = getPendingReviewTransactions(transactions)
  const pendingReviewGroups = processUnreviewedTransactions(pendingReview)

  const handleStartReview = () => {
    setReviewPopOpen(true)
  }

  const handleGroupClick = () => {}

  return (
    <div className="flex flex-col">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight">待复盘</h1>
        <Button
          type="button"
          disabled={pendingReviewGroups.length === 0}
          onClick={handleStartReview}
        >
          开始复盘
        </Button>
      </div>

      <ReviewPop
        open={reviewPopOpen}
        onOpenChange={(open) => setReviewPopOpen(open)}
        pendingReviewGroups={pendingReviewGroups}
      />

      {pendingReviewGroups.length === 0 ? (
        <p className="text-sm text-muted-foreground">暂无待复盘记录</p>
      ) : (
        <>
          <p className="mb-2 text-sm text-muted-foreground">
            共 {pendingReviewGroups.length} 笔记录待复盘
          </p>
          <div className="flex flex-col gap-3">
            {pendingReviewGroups.map((group) => (
              <Card
                key={group.descriptionKey}
                role="button"
                tabIndex={0}
                className="cursor-pointer transition-colors hover:bg-muted/40"
                onClick={() => handleGroupClick()}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    handleGroupClick()
                  }
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="truncate text-base font-semibold">
                      {group.description}
                    </span>
                    {group.count > 1 ? (
                      <span className="text-sm text-muted-foreground">
                        共 {group.count} 笔
                      </span>
                    ) : null}
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-0.5">
                    <span className="text-base font-medium">
                      ¥{group.totalAmount.toFixed(2)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ≈ {group.totalLifeEnergyHours.toFixed(1)}h 生命能量
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
