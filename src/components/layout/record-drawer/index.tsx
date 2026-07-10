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
import { GhostToggle } from "@/components/layout/record-drawer/parts/ghost-toggle"
import { AmountKeypad } from "@/components/layout/record-drawer/parts/amount-keypad"
import { QuickTags } from "@/components/layout/record-drawer/parts/quick-tags"

type RecordDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RecordDrawer({ open, onOpenChange }: RecordDrawerProps) {
  const form = useRecordForm({
    onSubmitSuccess: () => onOpenChange(false),
  })

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        className="pb-[env(safe-area-inset-bottom)]"
        aria-busy={form.derived.isSubmitting}
      >
        <RecordDrawerView
          values={form.values}
          ui={form.ui}
          derived={form.derived}
          actions={form.actions}
        />
      </DrawerContent>
    </Drawer>
  )
}

function RecordDrawerView({
  values,
  ui,
  derived,
  actions,
}: UseRecordFormResult) {
  return (
    <>
      {/* 头部 */}
      <DrawerHeader className="items-end pb-0">
        <DrawerTitle className="sr-only">记录一笔</DrawerTitle>
        {/* 日期选择器 */}
        <RecordDatePicker
          isCalendarOpen={ui.isCalendarOpen}
          onCalendarOpenChange={actions.onCalendarOpenChange}
          date={values.date}
          onDateChange={actions.onDateChange}
          isSubmitting={derived.isSubmitting}
        />
      </DrawerHeader>

      <div className="flex flex-col gap-4 px-4 pt-2">
        {/* 金额展示 */}
        <AmountDisplay displayAmount={derived.displayAmount} />

        {/* 生命能量胶囊 */}
        <EnergyBadge
          hasRealHourlyWage={derived.hasRealHourlyWage}
          onRealHourlyWageClick={actions.onRealHourlyWageClick}
          lifeEnergyCaption={derived.lifeEnergyCaption}
        />

        {/* 描述输入 + 相机（相机暂为占位） */}
        <DescriptionInput
          description={values.description}
          onDescriptionChange={actions.onDescriptionChange}
          isSubmitting={derived.isSubmitting}
        />

        {/* 快捷标签 + 幽灵账开关 */}
        <div className="flex items-center justify-between gap-2">
          <QuickTags
            onQuickTagSelect={actions.onQuickTagSelect}
            isSubmitting={derived.isSubmitting}
          />
          <GhostToggle
            isGhost={values.isGhost}
            onGhostChange={actions.onGhostChange}
            isSubmitting={derived.isSubmitting}
          />
        </div>
      </div>

      {/* 数字键盘 */}
      <AmountKeypad
        onAmountKeyDelete={actions.onAmountKeyDelete}
        onAmountKeyInput={actions.onAmountKeyInput}
        onSubmit={actions.onSubmit}
        onSubmitAnother={actions.onSubmitAnother}
        isSubmitting={derived.isSubmitting}
      />
    </>
  )
}
