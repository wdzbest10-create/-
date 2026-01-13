"use client";

import { Task } from "../types/task";

type TaskItemProps = {
  task: Task;
  openedMemoId: string | null;
  onToggleCompleted: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onSelect: (id: string) => void;
};

export default function TaskItem(props: TaskItemProps) {
  const {
    task,openedMemoId,onToggleCompleted,onDelete,onEdit,onSelect,} = props;


    
  return (
    <li className={`border rounded-lg p-4 sm:p-3 ${task.completed ? "bg-gray-50 opacity-60" : "bg-white"}`}> 
      <div className="flex justify-between gap-3">  {/* ===== 左：情報エリア ===== */}
        <div className="flex items-start gap-3">  {/* チェック */}
          <input type="checkbox" checked={task.completed} 
            onChange={() => onToggleCompleted(task.id)} className="mt-1"
          />
        
          <div className="flex flex-col"> {/* タスク情報 */}
            <span className={`cursor-pointer font-medium text-base ${task.completed ? "line-through text-gray-400"
              : "text-gray-900"}`}
              onClick={() => onEdit(task.id)} 
            >
              {task.title}
            </span>  {/*font-medium→ 主役感 text-base → サイズ固定（環境差を防ぐ） */}

            <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
              <span className={`px-2 py-0.5 rounded text-xs 
                font-semibold ${task.priority === "high"? "bg-red-100 text-red-600"  
                : task.priority === "middle"? "bg-orange-100 text-orange-600"
                : "bg-green-100 text-green-600"}`}
              >  {/*<span className={` ... `}>文字列の中に JavaScript を埋め込める構文  */}
                [{task.priority}]
              </span>

              {task.dueDate && <span>期限: {task.dueDate}</span>}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 text-sm"> {/* ===== 右：操作エリア ===== */}
          {task.memo && (
            <button className=" text-blue-500 hover:underline"
              onClick={() => onSelect(task.id)}
            >
              {openedMemoId === task.id ? "詳細を閉じる" : "詳細"} 
            </button>
          )}

          <button className=" text-red-500 hover:underline"
            onClick={() => onDelete(task.id)}
          >
            削除
          </button>
        </div> 
      </div>
      
      {openedMemoId === task.id && task.memo && ( 
        <div className="mt-2 ml-6 text-sm text-gray-600"> 
          メモ：{task.memo}
        </div>
      )} {/* ===== メモ ===== */}
    </li>
  );
}
