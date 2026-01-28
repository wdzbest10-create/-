"use client";

import { memo } from "react";
import { TaskFormProps, Priority, VALIDATION } from "../types/task";

/** 入力フィールドの共通スタイル */
const inputClassName =
  "w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400";

/**
 * タスク追加・編集フォームコンポーネント
 */
function TaskFormComponent({
  form,
  isEditing,
  onChangeTitle,
  onChangeDueDate,
  onChangeMemo,
  onChangePriority,
  onSave,
  onCancel,
}: TaskFormProps) {
  const titleLength = form.title.length;
  const memoLength = form.memo.length;

  const isTitleValid =
    form.title.trim().length > 0 &&
    form.title.trim().length <= VALIDATION.TITLE_MAX_LENGTH;
  const isMemoValid = memoLength <= VALIDATION.MEMO_MAX_LENGTH;
  const canSave = isTitleValid && isMemoValid;

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow p-4 space-y-4">
      <h3 className="text-lg font-bold">
        {isEditing ? "タスクを編集" : "タスクを追加"}
      </h3>

      {/* タイトル */}
      <div className="space-y-1">
        <label className="text-sm font-medium">
          タイトル（{VALIDATION.TITLE_MAX_LENGTH}文字以内・必須）
        </label>
        <input
          className={inputClassName}
          placeholder="タスク名を入力"
          value={form.title}
          onChange={(e) => onChangeTitle(e.target.value)}
        />
        <div
          className={`text-xs text-right ${
            titleLength > VALIDATION.TITLE_MAX_LENGTH
              ? "text-red-500"
              : "text-gray-500"
          }`}
        >
          {titleLength}/{VALIDATION.TITLE_MAX_LENGTH}
        </div>
      </div>

      {/* 期限 */}
      <div className="space-y-1">
        <label className="text-sm font-medium">期限</label>
        <input
          className={inputClassName}
          type="date"
          value={form.dueDate}
          onChange={(e) => onChangeDueDate(e.target.value)}
        />
      </div>

      {/* メモ */}
      <div className="space-y-1">
        <label className="text-sm font-medium">
          メモ（{VALIDATION.MEMO_MAX_LENGTH}文字以内）
        </label>
        <textarea
          className={inputClassName}
          rows={3}
          placeholder="メモを入力"
          value={form.memo}
          onChange={(e) => onChangeMemo(e.target.value)}
        />
        <div
          className={`text-xs text-right ${
            memoLength > VALIDATION.MEMO_MAX_LENGTH
              ? "text-red-500"
              : "text-gray-500"
          }`}
        >
          {memoLength}/{VALIDATION.MEMO_MAX_LENGTH}
        </div>
      </div>

      {/* 優先度 */}
      <div className="space-y-1">
        <label className="text-sm font-medium">優先度</label>
        <select
          className={inputClassName}
          value={form.priority}
          onChange={(e) => onChangePriority(e.target.value as Priority)}
        >
          <option value="high">高</option>
          <option value="middle">中</option>
          <option value="low">低</option>
        </select>
      </div>

      {/* ボタン */}
      <div className="flex gap-2 pt-2">
        <button
          className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onSave}
          disabled={!canSave}
        >
          保存する
        </button>
        <button
          className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300"
          onClick={onCancel}
        >
          キャンセル
        </button>
      </div>
    </div>
  );
}

export default memo(TaskFormComponent);
