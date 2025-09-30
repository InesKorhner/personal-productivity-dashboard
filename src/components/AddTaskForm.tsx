import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function AddTaskForm() {
  return (
    <div className="m-8 flex w-full max-w-3xl items-center gap-7">
      <Input
        type="text"
        placeholder="Add Task"
        className="flex-grow min-w-0 px-4 py-2" 
      />
      <Button type="submit" variant="outline">
        Submit
      </Button>
    </div>
  );
}
