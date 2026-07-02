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

type RecordDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RecordDrawer({ open, onOpenChange }: RecordDrawerProps) {
  const {
    displayAmount,
    description,
    date,
    setDate,
    calendarOpen,
    setCalendarOpen,
    setDescription,
    isGhost,
    toggleGhost,
    lifeEnergyHoursText,
    handleKeyPress,
    handleDelete,
    handleConfirm,
    handleQuickTag,
  } = useRecordForm()
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="pb-[env(safe-area-inset-bottom)]">
        <DrawerHeader className="items-end pb-0">
          <DrawerTitle className="sr-only">记录一笔</DrawerTitle>
          <RecordDatePicker
            calendarOpen={calendarOpen}
            setCalendarOpen={setCalendarOpen}
            date={date}
            setDate={setDate}
          />
        </DrawerHeader>

        <div className="flex flex-col gap-4 px-4 pt-2">
          {/* 金额展示 */}
          <AmountDisplay displayAmount={displayAmount} />

          {/* 生命能量胶囊 */}
          <EnergyBadge lifeEnergyHoursText={lifeEnergyHoursText} />

          {/* 描述输入 + 相机（相机暂为占位） */}
          <DescriptionInput
            description={description}
            setDescription={setDescription}
          />

          {/* 快捷标签 + 幽灵账开关 */}
          <GhostToggle
            isGhost={isGhost}
            toggleGhost={toggleGhost}
            handleQuickTag={handleQuickTag}
          />
        </div>

        {/* 数字键盘 */}
        <AmountKeypad
          handleDelete={handleDelete}
          handleKeyPress={handleKeyPress}
          handleConfirm={handleConfirm}
        />
      </DrawerContent>
    </Drawer>
  )
}
