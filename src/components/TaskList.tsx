"use client";

import { Task } from "../types/task";
import TaskItem from "./TaskItem";

type TaskListProps = {
  tasks: Task[];
  openedMemoId: string | null;
  onToggleCompleted: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onSelect:(id:string) => void;
};

export default function TaskList (props: TaskListProps){
  const {tasks, openedMemoId, onToggleCompleted, onDelete, onEdit, onSelect} = props;

  return(
    <ul className="space-y-3 mt-4">
      {tasks.length === 0 && (
        <li className="text-sm text-gray-500 text-center py-4">
          タスクがありません
        </li>
      )}
      
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          openedMemoId={openedMemoId}
          onToggleCompleted={onToggleCompleted}
          onDelete={onDelete}
          onEdit={onEdit}
          onSelect={onSelect} 
        />
      ))}
    </ul>
  );
}