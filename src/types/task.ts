// 1️⃣ タスクの基本型
export type Task = {
  id: string; // 一意のID
  title: string; // タイトル
  dueDate?: string; // 期限（任意）
  memo?: string; // メモ（任意）
  priority: 'high' | 'middle' | 'low'; // 優先度
  completed: boolean; // 完了フラグ
};

// 2️⃣ フォームの状態
export type FormState = {
  title: string;
  dueDate: string;
  memo: string;
  priority: 'high' | 'middle' | 'low';
};

// 3️⃣ 空フォームの初期値
export const emptyForm: FormState = {
  title: '',
  dueDate: '',
  memo: '',
  priority: 'middle',
};

// 4️⃣ TaskForm 用 Props
export type TaskFormProps = {
  form: FormState; // フォームの値
  editingId: string | null; // null → 新規追加、文字列 → 編集中
  setForm: React.Dispatch<React.SetStateAction<FormState>>; // 親の setForm
  onSave: () => void; // 保存ボタン
  onCancel: () => void; // キャンセルボタン
};

/*setForm は、
親コンポーネントの useState で作られた
form の状態を更新するための関数です。

新しい form の値、
もしくは前の form から新しい値を作る関数を受け取れます。

React.Dispatch<React.SetStateAction<FormState>> は、
その「setState 用の更新関数」であることを
TypeScript に正確に伝えている型です。
*/
