"use client";

import { memo } from "react";
import { TaskListProps } from "../types/task";
import TaskItem from "./TaskItem";

/**
 * タスク一覧を表示するコンポーネント
 */
function TaskListComponent({
  tasks,
  openedMemoId,
  onToggleCompleted,
  onDelete,
  onEdit,
  onToggleDetail,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-sm text-gray-500 text-center py-8">
        タスクがありません
      </div>
    );
  }

  return (
    <ul className="space-y-3 mt-4">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          isDetailOpen={openedMemoId === task.id}
          onToggleCompleted={onToggleCompleted}
          onDelete={onDelete}
          onEdit={onEdit}
          onToggleDetail={onToggleDetail}
        />
      ))}
    </ul>
  );
}

export default memo(TaskListComponent);
