"use client";

import { memo } from "react";
import { TaskItemProps, Priority } from "../types/task";

/** 優先度に応じたスタイルを返す */
const getPriorityStyle = (priority: Priority) => {
  const styles: Record<Priority, string> = {
    high: "bg-red-100 text-red-600",
    middle: "bg-orange-100 text-orange-600",
    low: "bg-green-100 text-green-600",
  };
  return styles[priority];
};

/**
 * 個別タスクの表示コンポーネント
 */
function TaskItemComponent({
  task,
  isDetailOpen,
  onToggleCompleted,
  onDelete,
  onEdit,
  onToggleDetail,
}: TaskItemProps) {
  return (
    <li
      className={`border rounded-lg p-4 sm:p-3 ${
        task.completed ? "bg-gray-50 opacity-60" : "bg-white"
      }`}
    >
      <div className="flex justify-between gap-3">
        {/* 左側: タスク情報 */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleCompleted(task.id)}
            className="mt-1 cursor-pointer"
          />

          <div className="flex flex-col">
            <span
              className={`cursor-pointer font-medium text-base ${
                task.completed
                  ? "line-through text-gray-400"
                  : "text-gray-900 hover:text-blue-600"
              }`}
              onClick={() => onEdit(task.id)}
            >
              {task.title}
            </span>

            <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
              <span
                className={`px-2 py-0.5 rounded text-xs font-semibold ${getPriorityStyle(
                  task.priority
                )}`}
              >
                {task.priority === "high"
                  ? "高"
                  : task.priority === "middle"
                  ? "中"
                  : "低"}
              </span>

              {task.dueDate && <span>期限: {task.dueDate}</span>}
            </div>
          </div>
        </div>

        {/* 右側: 操作ボタン */}
        <div className="flex flex-col items-end gap-1 text-sm">
          {task.memo && (
            <button
              className="text-blue-500 hover:underline"
              onClick={() => onToggleDetail(task.id)}
            >
              {isDetailOpen ? "詳細を閉じる" : "詳細"}
            </button>
          )}

          <button
            className="text-red-500 hover:underline"
            onClick={() => onDelete(task.id)}
          >
            削除
          </button>
        </div>
      </div>

      {/* メモ詳細 */}
      {isDetailOpen && task.memo && (
        <div className="mt-2 ml-6 text-sm text-gray-600 bg-gray-50 p-2 rounded">
          メモ: {task.memo}
        </div>
      )}
    </li>
  );
}

export default memo(TaskItemComponent);
