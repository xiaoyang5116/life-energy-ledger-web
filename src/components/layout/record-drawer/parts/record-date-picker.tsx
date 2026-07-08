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
  calendarOpen: boolean
  setCalendarOpen: (open: boolean) => void
  date: Date
  setDate: (date: Date) => void
  isAppending: boolean
}

export function RecordDatePicker({
  calendarOpen,
  setCalendarOpen,
  date,
  setDate,
  isAppending,
}: RecordDatePickerProps) {
  return (
    <Popover
      open={calendarOpen}
      onOpenChange={(open) => {
        if (isAppending) return
        setCalendarOpen(open)
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          disabled={isAppending}
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
            if (isAppending) return
            setDate(nextDate)
            setCalendarOpen(false)
          }}
          className="[--cell-size:--spacing(10)]"
          required
        />
      </PopoverContent>
    </Popover>
  )
}
