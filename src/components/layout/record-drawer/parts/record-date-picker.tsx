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
}

export function RecordDatePicker({
  calendarOpen,
  setCalendarOpen,
  date,
  setDate,
}: RecordDatePickerProps) {
  return (
    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="lg" className="text-muted-foreground">
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
