'use client';

import { useEffect, useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import { FormState, emptyForm } from '../types/task';

export default function Page() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [openedMemoId, setOpenedMemoId] = useState<string | null>(null); // メモ表示
  const [editingId, setEditingId] = useState<string | null>(null); // 編集対象
  const [form, setForm] = useState<FormState>(emptyForm);
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<
    'all' | 'active' | 'completed' | 'high' | 'middle' | 'low'
  >('all');
  const [sort, setSort] = useState<'none' | 'priority' | 'dueDate'>('none');

  const { tasks, addTask, updateTask, deleteTask, toggleCompleted } =
    useTasks();

  const handleDelete = (id: string) => {
    const ok = window.confirm('このタスクを削除してもいいですか？');

    if (!ok) return;

    deleteTask(id); // hook の deleteTask

    if (openedMemoId === id) {
      setOpenedMemoId(null);
    }
  };

  const priorityOrder: Record<'high' | 'middle' | 'low', number> = {
    high: 3,
    middle: 2,
    low: 1,
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    if (filter === 'high') return task.priority === 'high';
    if (filter === 'middle') return task.priority === 'middle';
    if (filter === 'low') return task.priority === 'low';
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sort === 'priority') {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }

    if (sort === 'dueDate') {
      const ad = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const bd = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      return ad - bd; // 近い期限が上
    }

    return 0; // none
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const baseFilterBtn =
    'px-3 py-2 sm:py-1.5 text-sm rounded transition-colors select-none'; //→ 連打時に文字選択される事故防止（地味だけどプロ）
  const filterClass = (name: typeof filter, active: typeof filter) =>
    name === active
      ? 'bg-blue-500 text-white cursor-not-allowed opacity-90'
      : 'bg-gray-200 hover:bg-gray-300 cursor-pointer';

  const priorityColor = (level: 'high' | 'middle' | 'low', active: boolean) => {
    if (!active) {
      return {
        high: 'bg-red-200 hover:bg-red-300',
        middle: 'bg-orange-200 hover:bg-orange-300',
        low: 'bg-green-200 hover:bg-green-300',
      }[level];
    }

    return {
      high: 'bg-red-500 text-white cursor-not-allowed',
      middle: 'bg-orange-500 text-white cursor-not-allowed',
      low: 'bg-green-500 text-white cursor-not-allowed',
    }[level];
  };

  const baseSortBtn = 'px-2 py-1 text-sm rounded transition-colors select-none';
  const sortClass = (name: typeof sort, active: typeof sort) =>
    name === active
      ? 'bg-blue-500 text-white cursor-not-allowed opacity-90'
      : 'bg-gray-100 hover:bg-gray-200 cursor-pointer';

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start p-6">
      {' '}
      {/*min-height-screen 最小の高さを、画面いっぱいにする*/}
      {!isFormOpen && (
        <div className="w-full max-w-md bg-white rounded-xl shadow p-4">
          {' '}
          {/*w-full=width:100% max-w-md=max-width:middle 画面が広くても読みやすい幅に制限PCで横に間延びしない  
        w-full→ スマホで横いっぱい ,max-w-md→ PCで広がりすぎない  w-full と max-w-md を両方使う👉 レスポンシブの基本テク。*/}
          <h1 className="text-2xl font-bold text-blue-600 mb-4">
            {' '}
            {/*2xl= 2 × extra large*/}
            今日のタスク
          </h1>
          <div className="flex flex-wrap gap-2 mb-3">
            <button
              className={`${baseFilterBtn} ${filterClass('all', filter)}`}
              onClick={() => setFilter('all')}
            >
              全部
            </button>{' '}
            {/*px-3=padding 横方向,py-1=縦方向  */}
            <button
              className={`${baseFilterBtn} ${filterClass('active', filter)}`}
              onClick={() => setFilter('active')}
            >
              未完了
            </button>
            <button
              className={`${baseFilterBtn} ${filterClass('completed', filter)}`}
              onClick={() => setFilter('completed')}
            >
              完了
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            <button
              className={`${baseFilterBtn} ${priorityColor('high', filter === 'high')}`}
              onClick={() => setFilter('high')}
            >
              高
            </button>
            <button
              className={`${baseFilterBtn} ${priorityColor('middle', filter === 'middle')}`}
              onClick={() => setFilter('middle')}
            >
              中
            </button>
            <button
              className={`${baseFilterBtn} ${priorityColor('low', filter === 'low')}`}
              onClick={() => setFilter('low')}
            >
              低
            </button>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-sm border-t pt-3 m-3">
            <span className="text-gray-600">並び替え：</span>
            <button
              className={`${baseSortBtn} ${sortClass('none', sort)}`}
              onClick={() => setSort('none')}
            >
              なし
            </button>
            <button
              className={`${baseSortBtn} ${sortClass('priority', sort)}`}
              onClick={() => setSort('priority')}
            >
              優先度
            </button>
            <button
              className={`${baseSortBtn} ${sortClass('dueDate', sort)}`}
              onClick={() => setSort('dueDate')}
            >
              期限
            </button>
          </div>
          <TaskList
            tasks={sortedTasks}
            openedMemoId={openedMemoId}
            onToggleCompleted={toggleCompleted}
            onDelete={handleDelete}
            onEdit={(id) => {
              const t = tasks.find((task) => task.id === id);
              if (!t) return;

              setForm({
                ...emptyForm,
                title: t.title,
                dueDate: t.dueDate ?? '',
                memo: t.memo ?? '',
                priority: t.priority,
              });
              setEditingId(id); // どのタスクを編集中か記録
              setIsFormOpen(true); // フォーム表示
              setOpenedMemoId(null);
            }}
            onSelect={(id) =>
              setOpenedMemoId((prev) => (prev === id ? null : id))
            }
          />
          <button
            className="mt-4 w-full cursor-pointer bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            onClick={() => setIsFormOpen(true)}
          >
            タスクを追加
          </button>
        </div>
      )}
      {isFormOpen && (
        <TaskForm
          form={form}
          setForm={setForm}
          editingId={editingId}
          // 追加 / 編集（Create / Update)
          onSave={() => {
            const title = form.title.trim();

            if (!title) {
              alert('タイトルは必須です');
              return;
            }

            if (title.length > 30) {
              alert('タイトルは30文字以内で入力してください');
              return;
            }

            if (form.memo.length > 100) {
              alert('メモは100文字以内で入力してください');
              return;
            }

            if (editingId === null) {
              // 新規追加
              addTask(form);
            } else {
              // 編集保存
              updateTask(editingId, form);
            }

            // 後片付け
            setForm(emptyForm);
            setEditingId(null);
            setIsFormOpen(false);
          }}
          onCancel={() => {
            setForm(emptyForm);
            setEditingId(null);
            setIsFormOpen(false);
          }}
        />
      )}
    </div>
  );
}

/*
app/
  page.tsx          ← 一覧ページ（今の Page）
  layout.tsx        ← 共通レイアウト
components/
  TaskItem.tsx
  TaskList.tsx
  TaskForm.tsx
hooks/
  useTasks.ts
types/
  task.ts
lib/
  storage.ts        ← localStorage等（任意）





  
  Node.jsプロジェクトの軽量化（安全）

今メインじゃない方のプロジェクト

node_modules 削除

.next / dist / build 削除（あれば）

※使うときは npm install で復活。
*/
