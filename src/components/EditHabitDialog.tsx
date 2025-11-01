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
import { FREQUENCIES, SECTIONS, type Frequencies, type Habit, type Sections } from '@/types';
import { CalendarInForm } from './CalendarInForm';
import React from 'react';

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
            <DialogDescription>
              Update your habit details and save the changes.
            </DialogDescription>
          </DialogHeader>
          <div className="mb-2 grid gap-4">
            <div className="grid gap-0">
              <label className="block text-sm font-medium">Habit Name</label>
              <input
                className="w-full rounded border p-2"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>

            <div className="mb-2">
              <label className="block text-sm font-medium">Frequency</label>
              <select
                className="w-full rounded border p-2"
                value={formData.frequency}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    frequency: e.target.value as Frequencies,
                  }))
                }
              >
                {FREQUENCIES.map((frequency) => (
                  <option key={frequency} value={frequency}>
                    {frequency}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-2">
              <label className="block text-sm font-medium">Section</label>
              <select
                className="w-full rounded border p-2"
                value={formData.section}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    section: e.target.value as Sections,
                  }))
                }
              >
                {SECTIONS.map((section) => (
                  <option key={section} value={section}>
                    {section}
                  </option>
                ))}
              </select>
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
          <DialogFooter>
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
