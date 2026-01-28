import { useCallback, useState } from "react";
import { FormState, Priority, Task, EMPTY_FORM, VALIDATION } from "../types/task";

type UseTaskFormReturn = {
  // 状態
  form: FormState;
  isFormOpen: boolean;
  editingId: string | null;
  isEditing: boolean;

  // フォーム操作
  openFormForNew: () => void;
  openFormForEdit: (task: Task) => void;
  closeForm: () => void;

  // フィールド更新
  changeTitle: (value: string) => void;
  changeDueDate: (value: string) => void;
  changeMemo: (value: string) => void;
  changePriority: (value: Priority) => void;

  // バリデーション
  validate: () => { isValid: boolean; errorMessage?: string };
  getFormData: () => FormState;
};

/**
 * タスクフォームの状態管理カスタムフック
 */
export function useTaskForm(): UseTaskFormReturn {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  /** 新規追加用にフォームを開く */
  const openFormForNew = useCallback(() => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setIsFormOpen(true);
  }, []);

  /** 編集用にフォームを開く */
  const openFormForEdit = useCallback((task: Task) => {
    setForm({
      title: task.title,
      dueDate: task.dueDate ?? "",
      memo: task.memo ?? "",
      priority: task.priority,
    });
    setEditingId(task.id);
    setIsFormOpen(true);
  }, []);

  /** フォームを閉じる */
  const closeForm = useCallback(() => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setIsFormOpen(false);
  }, []);

  /** タイトル変更 */
  const changeTitle = useCallback((value: string) => {
    setForm((prev) => ({ ...prev, title: value }));
  }, []);

  /** 期限変更 */
  const changeDueDate = useCallback((value: string) => {
    setForm((prev) => ({ ...prev, dueDate: value }));
  }, []);

  /** メモ変更 */
  const changeMemo = useCallback((value: string) => {
    setForm((prev) => ({ ...prev, memo: value }));
  }, []);

  /** 優先度変更 */
  const changePriority = useCallback((value: Priority) => {
    setForm((prev) => ({ ...prev, priority: value }));
  }, []);

  /** バリデーション */
  const validate = useCallback((): { isValid: boolean; errorMessage?: string } => {
    const title = form.title.trim();

    if (!title) {
      return { isValid: false, errorMessage: "タイトルは必須です" };
    }

    if (title.length > VALIDATION.TITLE_MAX_LENGTH) {
      return {
        isValid: false,
        errorMessage: `タイトルは${VALIDATION.TITLE_MAX_LENGTH}文字以内で入力してください`,
      };
    }

    if (form.memo.length > VALIDATION.MEMO_MAX_LENGTH) {
      return {
        isValid: false,
        errorMessage: `メモは${VALIDATION.MEMO_MAX_LENGTH}文字以内で入力してください`,
      };
    }

    return { isValid: true };
  }, [form]);

  /** 現在のフォームデータを取得 */
  const getFormData = useCallback((): FormState => {
    return { ...form, title: form.title.trim() };
  }, [form]);

  return {
    form,
    isFormOpen,
    editingId,
    isEditing: editingId !== null,

    openFormForNew,
    openFormForEdit,
    closeForm,

    changeTitle,
    changeDueDate,
    changeMemo,
    changePriority,

    validate,
    getFormData,
  };
}
