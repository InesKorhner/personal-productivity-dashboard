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
import { SECTIONS } from '@/types';

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
  const [formData, setFormData] = React.useState({
    name: habit.name,
    frequency: habit.frequency,
    section: habit.section,
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
            <DialogDescription className="mb-4">
              Update your habit details and save the changes.
            </DialogDescription>
          </DialogHeader>
          <div className="mb-6 grid gap-4">
            <div className="grid gap-4">
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
            <div className="flex flex-col items-start space-x-2">
              <label className="text-foreground mb-2 block text-sm font-medium">
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
                    <span
                      key={i}
                      className="bg-muted-foreground/40 block h-1 w-0.5"
                    />
                  ))}
                </div>
              </div>
              <span className="text-muted-foreground mt-2 text-sm">
                {formData.frequency} times per week
              </span>
            </div>

            <div className="flex flex-col gap-4">
              <Label className="px-1">Section</Label>
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
                  {SECTIONS.map((sectionValue) => (
                    <SelectItem key={sectionValue} value={sectionValue}>
                      {sectionValue}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
