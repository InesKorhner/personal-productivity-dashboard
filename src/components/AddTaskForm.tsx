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
import { useState } from 'react';
import type { Task } from '@/types';

interface AddTaskFormProps {
    onAddTask: (task: Task) => void
}

export function AddTaskForm({onAddTask}: AddTaskFormProps) {
    const [inputValue, setInputValue] = useState('')
    const [category, setCategory] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!inputValue || !category) return
        onAddTask({id: Date.now().toString(), text: inputValue, category, completed: false})
        setInputValue('')
        setCategory('')
    }
  return (
    <form
      onSubmit={handleSubmit}
      className="m-8 flex w-full max-w-3xl items-center gap-7"
    >
      <Input
        type="text"
        placeholder="Add Task"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="min-w-0 flex-grow px-4 py-2"
      />

      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Category</SelectLabel>
            <SelectItem value="work">Work</SelectItem>
            <SelectItem value="study">Study</SelectItem>
            <SelectItem value="exercise">Exercise</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <Button type="submit">Submit</Button>
    </form>
  );
  ;
}
