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
import type { Habit, Sections } from '@/types';
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
import { SECTIONS } from '@/types';
import { toast } from 'sonner';

type AddHabitFormProps = {
  onSave: (
    habitData: Omit<Habit, 'id' | 'checkIns' | 'startDate'>,
  ) => Promise<boolean>;
  onCancel?: () => void;
};

export function AddHabitDialog({ onSave }: AddHabitFormProps) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [frequencyCount, setFrequencyCount] = React.useState<number>(1);
  const [section, setSection] = React.useState<Habit['section']>('Others');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await onSave({
      name,
      frequency: frequencyCount,
      section,
    });

    if (success) {
      setName('');
      setFrequencyCount(1);
      setSection('Others');
      setOpen(false);
    } else {
      toast.error('Failed to add habit');
    }
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
            <DialogDescription className="mb-3">
              Set up a new habit and start tracking your progress today.
            </DialogDescription>
          </DialogHeader>
          <div className="mb-2 grid gap-4">
            <div className="grid gap-3">
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
              <label className="text-foreground mb-2 block text-sm font-medium">
                Frequency
              </label>
              <div className="relative w-full">
                <Slider
                  value={[frequencyCount]}
                  min={1}
                  max={7}
                  step={1}
                  onValueChange={(value: number[]) =>
                    setFrequencyCount(value[0])
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
                {frequencyCount} times per week
              </span>
            </div>

            <div className="mb-2 flex flex-col gap-3">
              <Label className="mt-2 mb-1 px-1">Section</Label>
              <Select
                value={section}
                onValueChange={(value) => setSection(value as Sections)}
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

            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
