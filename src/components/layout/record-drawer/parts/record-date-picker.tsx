// 日期 Popover

import { CalendarIcon } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"

type RecordDatePickerProps = {
  date: Date
  isSubmitting: boolean
  isCalendarOpen: boolean
  onDateChange: (date: Date) => void
  onCalendarOpenChange: (open: boolean) => void
}

export function RecordDatePicker({
  date,
  isSubmitting,
  isCalendarOpen,
  onDateChange,
  onCalendarOpenChange,
}: RecordDatePickerProps) {
  return (
    <Popover
      open={isCalendarOpen}
      onOpenChange={(open) => {
        if (isSubmitting) return
        onCalendarOpenChange(open)
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          disabled={isSubmitting}
          className="text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CalendarIcon className="h-4 w-4" />
          {date?.toLocaleDateString()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" collisionPadding={16}>
        <Calendar
          mode="single"
          captionLayout="dropdown"
          selected={date}
          onSelect={(nextDate) => {
            if (isSubmitting) return
            onDateChange(nextDate)
            onCalendarOpenChange(false)
          }}
          className="[--cell-size:--spacing(10)]"
          required
        />
      </PopoverContent>
    </Popover>
  )
}
