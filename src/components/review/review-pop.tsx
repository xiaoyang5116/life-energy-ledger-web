import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { UnreviewedGroup } from "@/features/ledger/transaction"

type ReviewPopProps = {
  open: boolean
  pendingReviewGroups: UnreviewedGroup[]
  onOpenChange: (open: boolean) => void
}

export function ReviewPop({
  open,
  onOpenChange,
  pendingReviewGroups,
}: ReviewPopProps) {
  const currentPendingReviewGroup = pendingReviewGroups[0]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{currentPendingReviewGroup.description}</DialogTitle>
          <DialogDescription>
            {currentPendingReviewGroup.count} 条记录，共{" "}
            {currentPendingReviewGroup.totalAmount} 元，共{" "}
            {currentPendingReviewGroup.totalLifeEnergyHours} 小时
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
