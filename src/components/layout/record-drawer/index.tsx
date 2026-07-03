import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"

import { useRecordForm } from "@/components/layout/record-drawer/use-record-form"
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
  const recordForm = useRecordForm({ onSubmitted: () => onOpenChange(false) })

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="pb-[env(safe-area-inset-bottom)]">
        {/* 头部 */}
        <DrawerHeader className="items-end pb-0">
          <DrawerTitle className="sr-only">记录一笔</DrawerTitle>
          {/* 日期选择器 */}
          <RecordDatePicker
            calendarOpen={recordForm.calendarOpen}
            setCalendarOpen={recordForm.setCalendarOpen}
            date={recordForm.date}
            setDate={recordForm.setDate}
          />
        </DrawerHeader>

        <div className="flex flex-col gap-4 px-4 pt-2">
          {/* 金额展示 */}
          <AmountDisplay displayAmount={recordForm.displayAmount} />

          {/* 生命能量胶囊 */}
          <EnergyBadge
            hasWage={recordForm.hasWage}
            onWageClick={recordForm.onWageClick}
            lifeEnergyHoursText={recordForm.lifeEnergyHoursText}
          />

          {/* 描述输入 + 相机（相机暂为占位） */}
          <DescriptionInput
            description={recordForm.description}
            handleDescription={recordForm.handleDescription}
          />

          {/* 快捷标签 + 幽灵账开关 */}
          <div className="flex items-center justify-between gap-2">
            <QuickTags handleQuickTag={recordForm.handleQuickTag} />
            <GhostToggle
              isGhost={recordForm.isGhost}
              toggleGhost={recordForm.toggleGhost}
            />
          </div>
        </div>

        {/* 数字键盘 */}
        <AmountKeypad
          handleDelete={recordForm.handleDelete}
          handleKeyPress={recordForm.handleKeyPress}
          handleConfirm={recordForm.handleConfirm}
          handleAgain={recordForm.handleAgain}
        />
      </DrawerContent>
    </Drawer>
  )
}
