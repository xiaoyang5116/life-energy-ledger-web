import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"

import {
  useRecordForm,
  type UseRecordFormResult,
} from "@/components/layout/record-drawer/use-record-form"
import { RecordDatePicker } from "@/components/layout/record-drawer/parts/record-date-picker"
import { AmountDisplay } from "@/components/layout/record-drawer/parts/amount-display"
import { EnergyBadge } from "@/components/layout/record-drawer/parts/energy-badge"
import { DescriptionInput } from "@/components/layout/record-drawer/parts/description-input"
import { AmountKeypad } from "@/components/layout/record-drawer/parts/amount-keypad"
import { QuickTags } from "@/components/layout/record-drawer/parts/quick-tags"

type RecordDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const RecordDrawer = ({ open, onOpenChange }: RecordDrawerProps) => {
  const form = useRecordForm({
    onClose: () => onOpenChange(false),
  })

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      form.reset()
    }
    onOpenChange(nextOpen)
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent
        className="pb-[env(safe-area-inset-bottom)] data-[vaul-drawer-direction=bottom]:max-h-dvh"
        aria-busy={form.isSubmitting}
      >
        <RecordDrawerView {...form} />
      </DrawerContent>
    </Drawer>
  )
}

const RecordDrawerView = ({
  date,
  description,
  isCalendarOpen,
  displayAmount,
  hasRealHourlyWage,
  isSubmitting,
  lifeEnergyCaption,
  setDate,
  setIsCalendarOpen,
  setDescription,
  handleQuickTagSelect,
  handleAmountKeyInput,
  handleAmountKeyDelete,
  handleSubmit,
  handleSubmitAnother,
  handleRealHourlyWageClick,
}: UseRecordFormResult) => {
  return (
    <>
      <DrawerHeader className="items-end pb-0">
        <DrawerTitle className="sr-only">记录一笔</DrawerTitle>
        <RecordDatePicker
          isCalendarOpen={isCalendarOpen}
          onCalendarOpenChange={setIsCalendarOpen}
          date={date}
          onDateChange={setDate}
          isSubmitting={isSubmitting}
        />
      </DrawerHeader>

      <div className="flex flex-col gap-4 px-4 pt-2">
        <AmountDisplay displayAmount={displayAmount} />

        <EnergyBadge
          hasRealHourlyWage={hasRealHourlyWage}
          onRealHourlyWageClick={handleRealHourlyWageClick}
          lifeEnergyCaption={lifeEnergyCaption}
        />

        <DescriptionInput
          description={description}
          onDescriptionChange={setDescription}
          isSubmitting={isSubmitting}
        />

        <QuickTags
          onQuickTagSelect={handleQuickTagSelect}
          isSubmitting={isSubmitting}
        />
      </div>

      <AmountKeypad
        onAmountKeyDelete={handleAmountKeyDelete}
        onAmountKeyInput={handleAmountKeyInput}
        onSubmit={handleSubmit}
        onSubmitAnother={handleSubmitAnother}
        isSubmitting={isSubmitting}
      />
    </>
  )
}
