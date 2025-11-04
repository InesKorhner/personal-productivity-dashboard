import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { Habit } from '@/types';
import { CalendarInForm } from './CalendarInForm';
import { Plus } from 'lucide-react';
import React from 'react';
import { Slider } from './ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Label } from './ui/label';

type AddHabitFormProps = {
  onSave: (habit: Habit) => void;
  onCancel?: () => void;
};

export function AddHabitDialog({ onSave }: AddHabitFormProps) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [frequencyCount, setFrequencyCount] = React.useState<number>(1);
  const [section, setSection] = React.useState<Habit['section']>('Morning');
  const [startDate, setStartDate] = React.useState(
    new Date().toISOString().slice(0, 10),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: `${Date.now()}-${Math.random()}`,
      name,
      frequency: frequencyCount,
      section,
      startDate,
      checkIns: [],
    });
    setName('');
    setFrequencyCount(1);
    setSection('Morning');
    setStartDate(new Date().toISOString().slice(0, 10));
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="h-4 w-4" />
          Add Habit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Habit</DialogTitle>
            <DialogDescription className="">
              Set up a new habit and start tracking your progress today.
            </DialogDescription>
          </DialogHeader>
          <div className="mb-2 grid gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="habit-name">Habit Name</Label>
              <input
                id="habit-name"
                className="border-input bg-background placeholder:text-muted-foreground flex h-9 w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col items-start space-x-2">
              <label className="mb-2 block text-sm font-medium">
                Frequency
              </label>
              <div className="relative w-full">
                <Slider
                  value={[frequencyCount]} // trenutna vrednost slider-a
                  min={1}
                  max={7}
                  step={1}
                  onValueChange={(value: number[]) =>
                    setFrequencyCount(value[0])
                  }
                  className="relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col"
                />
                <div className="absolute top-1/2 left-0 flex h-0.5 w-full -translate-y-1/2 justify-between">
                  {Array.from({ length: 7 }, (_, i) => (
                    <span key={i} className="block h-1 w-0.5 bg-gray-400" />
                  ))}
                </div>
              </div>
              <span className="mt-2 text-sm">
                {frequencyCount} times per week
              </span>
            </div>

            <div className="mb-2">
              <label className="mt-2 block text-sm font-medium">Section</label>

              <Select
                value={section}
                onValueChange={(value) => setSection(value as Habit['section'])}
              >
                <SelectTrigger className="mt-2 w-[380px]">
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Morning">Morning</SelectItem>
                  <SelectItem value="Afternoon">Afternoon</SelectItem>
                  <SelectItem value="Evening">Evening</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <CalendarInForm
              value={new Date(startDate)}
              onChange={(date) => setStartDate(date.toISOString().slice(0, 10))}
              label="Start Date"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            <Button type="submit" className="bg-[#4772FA]">
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
