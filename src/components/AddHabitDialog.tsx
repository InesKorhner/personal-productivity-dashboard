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
import React from 'react';
import { CalendarInForm } from './CalendarInForm';
import { Plus } from 'lucide-react';

type AddHabitFormProps = {
  onSave: (habit: Habit) => void;
  onCancel?: () => void;
};

export function AddHabitDialog({ onSave }: AddHabitFormProps) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [frequency, setFrequency] = React.useState<Habit['frequency']>('Daily');
  const [section, setSection] = React.useState<Habit['section']>('Morning');
  const [startDate, setStartDate] = React.useState(
    new Date().toISOString().slice(0, 10),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ id: Date.now().toString(), name, frequency, section, startDate });
    setName('');
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
            <DialogDescription>
              Set up a new habit and start tracking your progress today.
            </DialogDescription>
          </DialogHeader>
          <div className="mb-2 grid gap-4">
            <div className="grid gap-0">
              <label className="block text-sm font-medium">Habit Name</label>
              <input
                className="w-full rounded border p-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="mb-2">
              <label className="block text-sm font-medium">Frequency</label>
              <select
                className="w-full rounded border p-2"
                value={frequency}
                onChange={(e) =>
                  setFrequency(e.target.value as Habit['frequency'])
                }
              >
                <option>Daily</option>
                <option>Weekly</option>
                <option>3x/week</option>
              </select>
            </div>

            <div className="mb-2">
              <label className="block text-sm font-medium">Section</label>
              <select
                className="w-full rounded border p-2"
                value={section}
                onChange={(e) => setSection(e.target.value as Habit['section'])}
              >
                <option>Morning</option>
                <option>Afternoon</option>
                <option>Evening</option>
                <option>Other</option>
              </select>
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

            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
