'use client'

import * as React from 'react'
import { ChevronDownIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Label } from '@/components/ui/label'

type CalendarInFormProps = {
  value: Date | undefined
  onChange: (date: Date) => void
  label?: string
  id?: string
}

export function CalendarInForm({
  value,
  onChange,
  label = 'Select date',
  id = 'date',
}: CalendarInFormProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor={id} className="px-1 mb-0.5">
        {label}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={id}
            className="w-48 justify-between font-normal"
          >
            {value ? value.toLocaleDateString() : 'Select date'}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            captionLayout="dropdown"
            onSelect={(selectedDate) => {
              if (selectedDate) onChange(selectedDate)
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

