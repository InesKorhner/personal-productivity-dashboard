import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './ui/select';

export function AddTaskForm() {
  return (
    <div className="m-8 flex w-full max-w-3xl items-center gap-7">
      <Input
        type="text"
        placeholder="Add Task"
        className="min-w-0 flex-grow px-4 py-2"
      />

      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel></SelectLabel>
            <SelectItem value="apple">Work</SelectItem>
            <SelectItem value="banana">Study</SelectItem>
            <SelectItem value="blueberry">Exercise</SelectItem>
            <SelectItem value="grapes">Other</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button type="submit" variant="outline">
        Submit
      </Button>
    </div>
  );
}
