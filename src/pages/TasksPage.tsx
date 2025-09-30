import { AddTaskForm } from '@/components/AddTaskForm';
import { TaskList } from '@/components/TaskList';
import type { Task } from '@/types';
import { useState } from 'react';



export default function TasksPage () {
    const [tasks, setTasks] = useState<Task[]>([])
    return (
        <div>
            <AddTaskForm onAddTask={(newTask) => setTasks([...tasks, newTask])}/>
            <TaskList tasks={tasks}/>
        </div>
    )
}