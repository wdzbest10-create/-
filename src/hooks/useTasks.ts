import { useCallback, useEffect, useState } from "react";
import { Task, FormState } from "../types/task";

/** タスクの更新用型（idは変更不可） */
type TaskUpdate = Partial<Omit<Task, "id">>;

/** localStorage のキー */
const STORAGE_KEY = "tasks";

/**
 * タスクのCRUD操作を管理するカスタムフック
 * - localStorage との同期
 * - 追加・更新・削除・完了切り替え
 */
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    // SSR対策: サーバーサイドでは空配列を返す
    if (typeof window === "undefined") return [];

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? (JSON.parse(saved) as Task[]) : [];
    } catch {
      console.warn("localStorage の tasks が壊れていました。初期化します。");
      return [];
    }
  });

  // tasks が変更されたら localStorage に保存
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  /** 一意なIDを生成 */
  const generateId = useCallback(() => {
    return crypto.randomUUID?.() ?? Date.now().toString();
  }, []);

  /** タスクを追加 */
  const addTask = useCallback(
    (form: FormState) => {
      const newTask: Task = {
        id: generateId(),
        title: form.title.trim(),
        dueDate: form.dueDate || undefined,
        memo: form.memo || undefined,
        priority: form.priority,
        completed: false,
      };
      setTasks((prev) => [...prev, newTask]);
    },
    [generateId]
  );

  /** タスクを更新 */
  const updateTask = useCallback((id: string, updates: TaskUpdate) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  }, []);

  /** タスクを削除 */
  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  /** 完了状態を切り替え */
  const toggleCompleted = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  /** IDでタスクを取得 */
  const getTaskById = useCallback(
    (id: string): Task | undefined => {
      return tasks.find((task) => task.id === id);
    },
    [tasks]
  );

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleCompleted,
    getTaskById,
  };
}
