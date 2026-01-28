// ============================================
// 基本型定義
// ============================================

/** 優先度 */
export type Priority = "high" | "middle" | "low";

/** フィルター種別 */
export type FilterType = "all" | "active" | "completed" | Priority;

/** ソート種別 */
export type SortType = "none" | "priority" | "dueDate";

/** タスク */
export type Task = {
  id: string;
  title: string;
  dueDate?: string;
  memo?: string;
  priority: Priority;
  completed: boolean;
};

/** フォームの状態 */
export type FormState = {
  title: string;
  dueDate: string;
  memo: string;
  priority: Priority;
};

/** 空フォームの初期値 */
export const EMPTY_FORM: FormState = {
  title: "",
  dueDate: "",
  memo: "",
  priority: "middle",
};

// ============================================
// コンポーネント Props 型
// ============================================

/** TaskItem 用 Props */
export type TaskItemProps = {
  task: Task;
  isDetailOpen: boolean;
  onToggleCompleted: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onToggleDetail: (id: string) => void;
};

/** TaskList 用 Props */
export type TaskListProps = {
  tasks: Task[];
  openedMemoId: string | null;
  onToggleCompleted: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onToggleDetail: (id: string) => void;
};

/** TaskForm 用 Props */
export type TaskFormProps = {
  form: FormState;
  isEditing: boolean;
  onChangeTitle: (value: string) => void;
  onChangeDueDate: (value: string) => void;
  onChangeMemo: (value: string) => void;
  onChangePriority: (value: Priority) => void;
  onSave: () => void;
  onCancel: () => void;
};

// ============================================
// 定数
// ============================================

/** バリデーション定数 */
export const VALIDATION = {
  TITLE_MAX_LENGTH: 30,
  MEMO_MAX_LENGTH: 100,
} as const;

/** 優先度の表示順序（ソート用） */
export const PRIORITY_ORDER: Record<Priority, number> = {
  high: 3,
  middle: 2,
  low: 1,
};
