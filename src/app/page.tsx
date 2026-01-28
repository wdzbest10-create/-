"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTasks } from "../hooks/useTasks";
import { useTaskForm } from "../hooks/useTaskForm";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";
import {
  FilterType,
  SortType,
  PRIORITY_ORDER,
} from "../types/task";

/** フィルターボタンの設定 */
const FILTER_BUTTONS: { value: FilterType; label: string }[] = [
  { value: "all", label: "全部" },
  { value: "active", label: "未完了" },
  { value: "completed", label: "完了" },
];

/** 優先度フィルターボタンの設定 */
const PRIORITY_FILTER_BUTTONS: {
  value: FilterType;
  label: string;
  activeClass: string;
  inactiveClass: string;
}[] = [
  {
    value: "high",
    label: "高",
    activeClass: "bg-red-500 text-white",
    inactiveClass: "bg-red-200 hover:bg-red-300",
  },
  {
    value: "middle",
    label: "中",
    activeClass: "bg-orange-500 text-white",
    inactiveClass: "bg-orange-200 hover:bg-orange-300",
  },
  {
    value: "low",
    label: "低",
    activeClass: "bg-green-500 text-white",
    inactiveClass: "bg-green-200 hover:bg-green-300",
  },
];

/** ソートボタンの設定 */
const SORT_BUTTONS: { value: SortType; label: string }[] = [
  { value: "none", label: "なし" },
  { value: "priority", label: "優先度" },
  { value: "dueDate", label: "期限" },
];

export default function Page() {
  // Hydration対策（localStorage使用時のSSR/CSR不整合を防ぐ）
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // タスクCRUD
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleCompleted,
    getTaskById,
  } = useTasks();

  // フォーム状態
  const {
    form,
    isFormOpen,
    editingId,
    isEditing,
    openFormForNew,
    openFormForEdit,
    closeForm,
    changeTitle,
    changeDueDate,
    changeMemo,
    changePriority,
    validate,
    getFormData,
  } = useTaskForm();

  // UI状態
  const [openedMemoId, setOpenedMemoId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortType>("none");

  // フィルター処理
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      switch (filter) {
        case "active":
          return !task.completed;
        case "completed":
          return task.completed;
        case "high":
        case "middle":
        case "low":
          return task.priority === filter;
        default:
          return true;
      }
    });
  }, [tasks, filter]);

  // ソート処理
  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      switch (sort) {
        case "priority":
          return PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority];
        case "dueDate": {
          const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
          const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
          return dateA - dateB;
        }
        default:
          return 0;
      }
    });
  }, [filteredTasks, sort]);

  // イベントハンドラー
  const handleDelete = useCallback(
    (id: string) => {
      if (!window.confirm("このタスクを削除してもいいですか？")) return;
      deleteTask(id);
      if (openedMemoId === id) setOpenedMemoId(null);
    },
    [deleteTask, openedMemoId]
  );

  const handleEdit = useCallback(
    (id: string) => {
      const task = getTaskById(id);
      if (!task) return;
      openFormForEdit(task);
      setOpenedMemoId(null);
    },
    [getTaskById, openFormForEdit]
  );

  const handleToggleDetail = useCallback((id: string) => {
    setOpenedMemoId((prev) => (prev === id ? null : id));
  }, []);

  const handleSave = useCallback(() => {
    const result = validate();
    if (!result.isValid) {
      alert(result.errorMessage);
      return;
    }

    const formData = getFormData();
    if (editingId) {
      updateTask(editingId, formData);
    } else {
      addTask(formData);
    }
    closeForm();
  }, [validate, getFormData, editingId, updateTask, addTask, closeForm]);

  // Hydration対策
  if (!mounted) return null;

  // ボタンスタイル
  const baseButtonClass =
    "px-3 py-2 sm:py-1.5 text-sm rounded transition-colors select-none";
  const activeButtonClass = "bg-blue-500 text-white";
  const inactiveButtonClass = "bg-gray-200 hover:bg-gray-300";

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start p-6">
      {!isFormOpen ? (
        <div className="w-full max-w-md bg-white rounded-xl shadow p-4">
          <h1 className="text-2xl font-bold text-blue-600 mb-4">
            今日のタスク
          </h1>

          {/* フィルターボタン */}
          <div className="flex flex-wrap gap-2 mb-3">
            {FILTER_BUTTONS.map(({ value, label }) => (
              <button
                key={value}
                className={`${baseButtonClass} ${
                  filter === value ? activeButtonClass : inactiveButtonClass
                }`}
                onClick={() => setFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>

          {/* 優先度フィルターボタン */}
          <div className="flex flex-wrap gap-2 mb-3">
            {PRIORITY_FILTER_BUTTONS.map(
              ({ value, label, activeClass, inactiveClass }) => (
                <button
                  key={value}
                  className={`${baseButtonClass} ${
                    filter === value ? activeClass : inactiveClass
                  }`}
                  onClick={() => setFilter(value)}
                >
                  {label}
                </button>
              )
            )}
          </div>

          {/* ソートボタン */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-sm border-t pt-3 mb-3">
            <span className="text-gray-600">並び替え:</span>
            {SORT_BUTTONS.map(({ value, label }) => (
              <button
                key={value}
                className={`px-2 py-1 text-sm rounded transition-colors select-none ${
                  sort === value
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                onClick={() => setSort(value)}
              >
                {label}
              </button>
            ))}
          </div>

          {/* タスク一覧 */}
          <TaskList
            tasks={sortedTasks}
            openedMemoId={openedMemoId}
            onToggleCompleted={toggleCompleted}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onToggleDetail={handleToggleDetail}
          />

          {/* 追加ボタン */}
          <button
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            onClick={openFormForNew}
          >
            タスクを追加
          </button>
        </div>
      ) : (
        <TaskForm
          form={form}
          isEditing={isEditing}
          onChangeTitle={changeTitle}
          onChangeDueDate={changeDueDate}
          onChangeMemo={changeMemo}
          onChangePriority={changePriority}
          onSave={handleSave}
          onCancel={closeForm}
        />
      )}
    </div>
  );
}
