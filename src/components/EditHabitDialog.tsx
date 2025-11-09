import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { type Habit, type Sections } from '@/types';
import { CalendarInForm } from './CalendarInForm';
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

type EditHabitDialogProps = {
  habit: Habit;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (habit: Habit) => void;
};

export function EditHabitDialog({
  habit,
  open,
  onOpenChange,
  onSave,
}: EditHabitDialogProps) {
  // Initialize form data from habit props
  // The component will remount when habit.id changes (via key prop)
  const [formData, setFormData] = React.useState({
    name: habit.name,
    frequency: habit.frequency,
    section: habit.section,
    startDate: habit.startDate,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...habit,
      ...formData,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Habit</DialogTitle>
            <DialogDescription className="mb-3">
              Update your habit details and save the changes.
            </DialogDescription>
          </DialogHeader>
          <div className="mb-2 grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="habit-name">Habit Name</Label>
              <input
                className="border-input bg-background placeholder:text-muted-foreground flex h-9 w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>
            <div className="mb-2 flex flex-col items-start space-x-2">
              <label className="mb-2 block text-sm font-medium">
                Frequency
              </label>
              <div className="relative w-full">
                <Slider
                  value={[formData.frequency]}
                  min={1}
                  max={7}
                  step={1}
                  onValueChange={(value: number[]) =>
                    setFormData((prev) => ({ ...prev, frequency: value[0] }))
                  }
                />
                <div className="absolute top-1/2 left-0 flex h-0.5 w-full -translate-y-1/2 justify-between">
                  {Array.from({ length: 7 }, (_, i) => (
                    <span key={i} className="block h-1 w-0.5 bg-gray-400" />
                  ))}
                </div>
              </div>
              <span className="mt-2 text-sm">
                {formData.frequency} times per week
              </span>
            </div>

            <div className="mb-1 flex flex-col gap-3">
              <Label className="mt-1 px-1">Section</Label>
              <Select
                value={formData.section}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    section: value as Sections,
                  }))
                }
              >
                <SelectTrigger className="w-full [&_svg]:opacity-100">
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Morning">Morning</SelectItem>
                  <SelectItem value="Afternoon">Afternoon</SelectItem>
                  <SelectItem value="Evening">Evening</SelectItem>
                  <SelectItem value="Other">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <CalendarInForm
              value={new Date(formData.startDate)}
              onChange={(date) =>
                setFormData((prev) => ({
                  ...prev,
                  startDate: date.toISOString().slice(0, 10),
                }))
              }
              label="Start Date"
            />
          </div>
          <DialogFooter className="mt-5">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            <Button type="submit" className="bg-[#4772FA]">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
