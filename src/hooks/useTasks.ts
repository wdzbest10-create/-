import { useEffect, useState } from "react";
import { Task } from "../types/task"


type TaskUpdate = Omit<Partial<Task>, "id">; //id を外から書き換えられないようにしただけ。updateTask 型安全化 → 設計レベルUP

export function useTasks() {
  const [tasks,setTasks] = useState<Task[]>(() => {
    try{
      const saved = localStorage.getItem("tasks");// ブラウザの保存箱（localStorage）に『tasks』という名前のデータがあるか探す
      return saved ? (JSON.parse(saved) as Task[]) : [];  //JSON.parse(saved) 文字列 → 配列に戻す
    }catch{
      console.warn("localStorage の tasks が壊れていました。初期化します。");
      return [];
    }
  });  //try/catch 付き初期化 → 起動クラッシュ防止

  // 変更時：画面 → 保存
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);
  //JSON.stringify(tasks) 配列 → 文字列 理由：localStorage は 文字列しか保存できない
  //localStorage.setItem("tasks", ...) 『tasks』という名前で保存する
  //[task] tasks が変わった時だけ実行 つまり1,追加したとき 2,編集したとき 3,削除したとき
  //完了を切り替えたとき,全部自動保存

  const generateId = () => {
    return crypto.randomUUID?.() ?? Date.now().toString();
  }; //ID 生成フォールバック → 環境耐性UP

  const addTask = (task: Omit<Task, "id" | "completed">) => {
    setTasks(prev => [...prev,{ id: generateId(), 
      ...task, completed: false },
    ]);
  };

  const updateTask = (id: string, updated: TaskUpdate) => {
    setTasks(prev =>prev.map(task =>
        task.id === id ? { ...task, ...updated } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const toggleCompleted = (id: string) => {
    setTasks(prev =>prev.map(task =>
        task.id === id? { ...task, completed: !task.completed }: task
      )
    );
  };

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleCompleted,
  };
}
