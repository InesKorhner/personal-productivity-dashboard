'use client';

import { useState, type MouseEvent } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DatePickerButtonProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  disabled?: boolean;
  showClearButton?: boolean;
  className?: string;
}

export default function DatePickerButton({
  value,
  onChange,
  disabled = false,
  showClearButton = true,
  className,
}: DatePickerButtonProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (date: Date | undefined) => {
    onChange(date);
    setOpen(false);
  };

  const handleClear = (e: MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
  };

  return (
    <div className={cn('flex items-center', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              'hover:bg-accent h-full rounded-none border-0',
              value && 'bg-accent',
            )}
            disabled={disabled}
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleSelect}
            captionLayout="dropdown"
          />
        </PopoverContent>
      </Popover>

      {value && showClearButton && (
        <div className="flex items-center gap-1 border-l px-2">
          <span className="text-muted-foreground text-xs">
            {format(value, 'MMM d')}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="hover:bg-destructive/10 h-6 w-6 rounded-full"
            onClick={handleClear}
            disabled={disabled}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
}
