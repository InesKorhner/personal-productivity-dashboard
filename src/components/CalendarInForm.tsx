'use client';

import * as React from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { endOfDay, format, startOfDay } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';

type CalendarInFormProps = {
  value: Date | undefined;
  onChange: (date: Date) => void;
  label?: string;
  id?: string;
  disableFuture?: boolean;
};

export function CalendarInForm({
  value,
  onChange,
  label = 'Select date',
  id = 'date',
  disableFuture = false,
}: CalendarInFormProps) {
  const [open, setOpen] = React.useState(false);

  const today = React.useMemo(() => endOfDay(new Date()), []);

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor={id} className="px-1">
        {label}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={id}
            className="w-48 justify-between font-normal"
          >
            {value ? format(value, 'MMM d, yyyy') : 'Select date'}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            captionLayout="dropdown"
            disabled={disableFuture ? (date) => date > today : undefined}
            onSelect={(selectedDate) => {
              if (selectedDate) {
                // Use startOfDay to ensure local date without time
                const localDate = startOfDay(selectedDate);
                onChange(localDate);
              }
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
