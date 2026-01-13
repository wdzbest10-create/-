"use client";

import { TaskFormProps } from "../types/task";


export default function TaskForm(props: TaskFormProps) {
  const { form, setForm, editingId, onSave, onCancel } = props;

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow p-4 space-y-4"> {/*rounded-xl shadow → カード感 */}
      <h3 className="text-lg font-bold">{editingId ? "タスクを編集" : "タスクを追加"}</h3>

      <div className="space-y-1">
        <label className="text-sm font-medium">
          タイトル名（30文字以内・必須）
        </label>
        <input className="w-full border rounded px-3 py-2 text-sm 
          focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="タイトル名" value={form.title}
          onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
        /> {/*out-line消しているのはブラウザ標準の outline だけ */}
        <div className="text-xs text-gray-500 text-right">  {/*text-xs= extra small　小さめな字 */}
          {form.title.length}/30
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">期限</label>
        <input className="w-full border rounded px-3 py-2 text-sm
          focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="date" value={form.dueDate}
          onChange={(e) => setForm((prev) => ({ ...prev, dueDate: e.target.value }))}
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">メモ（100文字以内）：</label>
        <textarea className="w-full border rounded px-3 py-2 text-sm
          focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={3} placeholder="メモの内容を書いて" value={form.memo}
          onChange={(e) => setForm((prev) => ({ ...prev, memo: e.target.value }))}
        /> {/*rows = 最初の高さ（行数）*/}
        <div className="text-xs text-gray-500 text-right">
          {form.memo.length}/100
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">優先度</label>
        <select className="w-full border rounded px-3 py-2 text-sm
          focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={form.priority} onChange={(e) =>setForm((prev) => ({
            ...prev,priority: e.target.value as "high" | "middle" | "low",}))
          }
        >
          <option value="high">高</option>
          <option value="middle">中</option>
          <option value="low">低</option>
        </select>
      </div>

      <div className="flex gap-2 pt-2">
        <button className="flex-1 bg-blue-500 text-white py-2 rounded
          hover:bg-blue-600 disabled:opacity-50"
          onClick={onSave} disabled={!form.title.trim() ||
          form.memo.length > 100||form.title.trim().length > 30}>保存する
        </button>
        <button className="flex-1 bg-gray-200 text-gray-700 py-2 rounded
          hover:bg-gray-300"
          onClick={onCancel}>キャンセル
        </button>
      </div>
    </div>
  );
}