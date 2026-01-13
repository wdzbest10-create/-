import { useState} from "react";
import { useTasks } from "./hooks/useTasks";
import { Task} from "./types/task"

type TaskListProps = {
  tasks: Task[];
  openedMemoId: string | null;
  onToggleCompleted: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onSelect:(id:string) => void;
};

type TaskItemProps={
  task:Task;                              // 表示する1件のタスクデータ
  openedMemoId:string|null;
  onToggleCompleted:(id:string)=>void; //完了/未完了を切り替えてって親に頼む
  onDelete:(id:string)=>void;          //削除してって親に頼む
  onEdit:(id:string)=>void;            //編集モードにしてって親に頼む
  onSelect:(id:string)=>void;
}; //親から、データ3つと関数4つを受け取りますよ」という約束書

type TaskFormProps = {
  form: FormState; //今フォームに入っている値そのもの例：{ title: "A", time: "8:00", memo: "", priority: "high" }
  setForm: React.Dispatch<React.SetStateAction<FormState>>; //useState の setForm 関数そのもの= TaskForm の中から 親の form state を更新するためのリモコン
  editingId: string | null; //今「編集中のタスクの id」null → 新規追加モード 文字列 → 編集モード
  onSave: () => void;   //保存ボタン押したら親でこの処理してね」という約束中身は App 側で定義して渡してる。
  onCancel: () => void; //キャンセル押したら親でこの処理してね
};


type FormState ={
  title:string;
  dueDate:string;
  memo:string;
  priority:"high"|"middle"|"low";
}

const emptyForm: FormState = {
  title: "",dueDate: "",memo: "",priority: "middle",
}; //emptyForm 定数化 → 保守性UP

function TaskItem(props:TaskItemProps){
  const {task,openedMemoId,
    onToggleCompleted,onDelete,onEdit,onSelect}=props;

  return (
    <div>
      <input type="checkbox" checked={task.completed}
        onChange={() => onToggleCompleted(task.id)}
      />
      <span style={{ 
        textDecoration: task.completed ? "line-through" : "none" ,
        color: task.completed ? "#999" : "#000", //完了は赤色
        cursor: "pointer"}}
        onClick={() => onEdit(task.id)}>
        <span style={{color:task.priority === "high"
          ? "red": task.priority === "middle"
          ? "orange": "green",
          fontWeight: "bold",marginRight: "4px",}}>
          [{task.priority}]
        </span>  
          {task.title}
          {task.dueDate&&(
            <small style={{ marginLeft: "8px", color: "#666" }}>
              {task.dueDate}
            </small>
          )}
      </span>

      {task.memo && (
        <button onClick={() => onSelect(task.id)}>
          {openedMemoId === task.id ? "詳細を閉じる" : "詳細"}
        </button>
      )}
      <button onClick={() => onDelete(task.id)}>削除</button>

      {openedMemoId === task.id && task.memo && (
        <div style={{ marginLeft: "16px" }}>メモ：{task.memo}</div>
      )}
    </div>
  );
}

function TaskList (props:TaskListProps){
 const{tasks,openedMemoId,onToggleCompleted,onDelete,onEdit,onSelect}=props;

  return(
    <div>
      {tasks.map(task => (
        <TaskItem
          key={task.id}  //親から子に渡す瞬間
          task={task}
          openedMemoId={openedMemoId}
          onToggleCompleted={onToggleCompleted}
          onDelete={onDelete}
          onEdit={onEdit}
          onSelect={onSelect} 
        />
      ))}
    </div>
  );
}

function TaskForm(props: TaskFormProps) {
  const { form, setForm, editingId, onSave, onCancel } = props;

  return (
    <div>
      <h3>{editingId ? "タスクを編集" : "タスクを追加"}</h3>

      <p>タイトル名（30文字以内・必須）：</p>
      <input
        placeholder="タイトル名"
        value={form.title}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, title: e.target.value }))
        }
      />
      <div>
        {form.title.length}/30
      </div>

      <p>期限：</p>
      <input
        type="date"
        value={form.dueDate}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, dueDate: e.target.value }))
        }
      />

      <p>メモ（100文字以内）：</p>
      <textarea
        placeholder="メモの内容を書いて"
        value={form.memo}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, memo: e.target.value }))
        }
      />
      <div>
        {form.memo.length}/100
      </div>

      <p>優先度：</p>
      <select
        value={form.priority}
        onChange={(e) =>
          setForm((prev) => ({
            ...prev,
            priority: e.target.value as "high" | "middle" | "low",
          }))
        }
      >
        <option value="high">高</option>
        <option value="middle">中</option>
        <option value="low">低</option>
      </select>

      <br />

      <button onClick={onSave} disabled={
        !form.title.trim() ||
        form.memo.length > 100||
        form.title.trim().length > 30}>保存する
      </button>
      <button onClick={onCancel}>キャンセル</button>
    </div>
  );
}

export default function App(){
  //state 定義 =「アプリの記憶」
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [openedMemoId, setOpenedMemoId] = useState<string | null>(null);  // メモ表示
  const [editingId, setEditingId] = useState<string | null>(null);      // 編集対象
  const [form,setForm]=useState<FormState>(emptyForm); 
  const [filter, setFilter] = useState
  <"all" | "active" | "completed" |"high" | "middle" | "low">("all");
  const [sort, setSort] = useState<"none" | "priority" | "dueDate">("none");

  const {tasks,addTask,updateTask,deleteTask,toggleCompleted,} = useTasks();
  
  const handleDelete = (id: string) => {
    const ok = window.confirm("このタスクを削除してもいいですか？");

    if(!ok) return;

    deleteTask(id); // hook の deleteTask

    if (openedMemoId === id) {
      setOpenedMemoId(null);
    }
  };

  const priorityOrder: Record<"high" | "middle" | "low", number> = {
    high: 3,
    middle: 2,
    low: 1,
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    if (filter === "high") return task.priority === "high";
    if (filter === "middle") return task.priority === "middle";
    if (filter === "low") return task.priority === "low";
    return true; // all
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
  if (sort === "priority") {
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  }

  if (sort === "dueDate") {
    const ad = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
    const bd = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
    return ad - bd; // 近い期限が上
  }

  return 0; // none
});



/*setTasks が呼ばれた瞬間の、最新の tasks の値,正式には “前の state
（previous state）” の略
つまり：prev === 今この瞬間の tasks

なんで tasks じゃなくて prev を使うの？
今まで書いたコード　setTasks(newTasks);　これは、今このスコープに見えて
いる tasks を元に更新、でも React では：
1,state 更新は 非同期
2,連続で setState されると 古い値を掴むことがある

だから安全なのが
setTasks(prev => {
  return 新しいtasks;
});

prev とは？
✅ 直前の state（最新の state）
✅ React が自動で渡してくれる引数

いつ prev を使う？
👉 前の state を元に次を計算するときは必ず使う
追加,削除,トグル,カウント +1

全部これ👇が正解形：
setState(prev => 次のstate);

prev = 「今この瞬間の最新データ」
だからあなたのコードで prev がいっぱい出てくるのは、安全に state を更新してる証拠。


*/
  return(
    <div>
      {!isFormOpen && (
        <div>
          <h2>今日のタスク</h2>

          <div>
            <button onClick={() => setFilter("all")}>全部</button>
            <button onClick={() => setFilter("active")}>未完了</button>
            <button onClick={() => setFilter("completed")}>完了</button>
            <button onClick={() => setFilter("high")}>高</button>
            <button onClick={() => setFilter("middle")}>中</button>
            <button onClick={() => setFilter("low")}>低</button>
          </div>
          <div>
          <span>並び替え：</span>
            <button onClick={() => setSort("none")}>なし</button>
            <button onClick={() => setSort("priority")}>優先度</button>
            <button onClick={() => setSort("dueDate")}>期限</button>
          </div>

          <TaskList
            tasks={sortedTasks}
            openedMemoId={openedMemoId}
            onToggleCompleted={toggleCompleted}
            onDelete={handleDelete}
            onEdit={id => {
              const t = tasks.find(task=>task.id===id);
              if(!t) return;
          
              setForm({
                ...emptyForm,
                title:t.title,
                dueDate:t.dueDate??"",
                memo:t.memo??"",
                priority:t.priority,
              });
              setEditingId(id);  // どのタスクを編集中か記録
              setIsFormOpen(true);        // フォーム表示
              setOpenedMemoId(null);
            }}
            onSelect={id =>
              setOpenedMemoId(prev => (prev === id ? null : id))
            }
          />

          <button onClick={()=>setIsFormOpen(true)}>
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
            const title =form.title.trim();

            if (!title) {
              alert("タイトルは必須です");
              return;
            }

            if(title.length>30){
              alert("タイトルは30文字以内で入力してください");
              return;
            }

            if (form.memo.length > 100) {
              alert("メモは100文字以内で入力してください");
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
  )
}

/*
────────────────
📅 今日のタスク
────────────────
☐ ゴミ出し（8:00）
☑ 子どもの迎え（完了）
☐ React 勉強（30分）

＋ タスクを追加
────────────────

────────────
タスクを追加
────────────
タスク名：［　　　　　］
期限：　　［ 今日 ▼ ］
メモ：　　［　　　　　］

［ 保存する ］
────────────
*/



/*
React のプロジェクト作成とは何か？（本質）
React の開発を始めるために必要な「空の作業場（プロジェクト）」を、ツールを
使って自動で作る作業のこと。
React を使ってアプリを作れる状態を一気に作る作業が「プロジェクト作成」

React プロジェクト作成の全体フロー
1,Vite の生成コマンドを実行 (今の主流は Vite を使って作る。)
npm create vite@latest

このコマンドを実行すると、
1,プロジェクト名を決める
2,React を選ぶ
3,TypeScript を選ぶ

この３つを選択すると…
React + TypeScript のプロジェクトが自動で生成される。

4,プロジェクトフォルダに移動　　例：cd プロジェクト名
5,ローカルで起動　　例：npm run dev
これで「Reactアプリを書ける状態」が完成する。


1,package.json（司令塔）
「このプロジェクトは何か」,「npm run dev って何をするか」が書いてある。
npm コマンドは全部ここを見て動く

2,index.html（入口）
ブラウザが最初に読むファイル、ここに <div id="root"></div> がある
Reactはここに画面を描画する

3,src フォルダ
今後、あなたがコードを書くのはほぼ100%ここ
中にある：
main.tsx ← Reactの起動スイッチ、App.tsx ← 画面の本体（一番大事）


index.html
  ↓
src/main.tsx
  ↓
src/App.tsx
  ↓
画面に表示される
App.tsx を変えると、画面が変わる


TypeScript メモ：配列・型の正しい書き方
間違った書き方（存在しない）
const newArry: number = {1,2,3}        
const newArry: string = {"バナナ","りんご"} 
理由：
{} は配列ではない
number / string は「1個分の型」

正しい書き方　1つの値だけの場合
const count: number = 5;
const name: string = "りんご";
正しい配列の書き方
const numbers: number[] = [1, 2, 3];
const fruits: string[] = ["バナナ", "りんご"];

｛｝はオブジェクト専用
const fruit: { name: string; price: number } = {
  name: "りんご",
  price: 100,
};

time?: string / memo?: string の ? は何？
? は
👉 「あってもいいし、なくてもいい」
という意味。

<span style={{ textDecoration: task.completed ? "line-through" : "none" }}>
  {task.title}
  {task.time && `（${task.time}）`}
</span>
全体の目的
👉 完了したら線を引く
👉 time がある時だけ表示

task.completed ? "line-through" : "none"
三項演算子
completed === true
→ "line-through"（取り消し線）
completed === false
→ "none"（普通）

 {task.time && `（${task.time}）`}　　task.time が存在したら、右側を表示する



完成版タスク管理アプリの画面（超具体）
① 起動した瞬間（メイン画面）

スマホを開くと 1画面だけ。

────────────────
📅 今日のタスク
────────────────
☐ ゴミ出し（8:00）
☑ 子どもの迎え（完了）
☐ React 勉強（30分）

＋ タスクを追加
────────────────


上：今日（日付 or 「今日のタスク」）
真ん中：チェックボックス付きタスク一覧
下：「＋タスクを追加」ボタン
👉 これがアプリの7割。

② タスク追加画面（またはモーダル）
「＋タスクを追加」を押すと表示。

────────────
タスクを追加
────────────
タスク名：［　　　　　］
期限：　　［ 今日 ▼ ］
メモ：　　［　　　　　］

［ 保存する ］
────────────


入力項目は 最大3つ
難しいUIなし
保存したら①に戻る

③ 完了したタスクの見え方
チェックするとこうなる：
☑ 子どもの迎え（完了）

文字が薄くなる
下に移動する or 線が引かれる
つまり画面は「たった2種類」
一覧画面（9割ここ）
追加画面（1割）


まだ未着手 or 未完成な仕様
❌ タスク編集機能
❌ 期限日（date型）
❌ 優先度（高・中・低）
❌ フィルタリング
❌ ローカルストレージ
❌ コンポーネント分割
❌ Tailwind / UI整理


React での正解ルール
画面に表示する正解データは state
localStorage は
👉 バックアップ置き場
つまり
起動時：
localStorage → state

操作中：
state だけを触る

変更後：
state → localStorage

1, 起動時にやること（1回だけ）
「前に保存した tasks があれば、それを state に入れたい」
これを 自動で1回だけやる仕組みが useEffect

useEffect って何？
「特定のタイミングで実行される関数
useEffect(() => {　// やりたい処理　}, []);
[] の意味は　最初の1回だけ

コンポーネント分割
App
 ├ TaskList   ← 一覧担当
 │   └ TaskItem ← 1件担当
 └ TaskForm   ← 追加・編集フォーム

親：何を表示するか決める
子：どう表示するか担当
親 → App コンポーネント
👉 tasks を持ってる / setTasks できる / localStorage 触れる

✅ 子 → TaskItem コンポーネント
👉 1件のタスクを表示するだけ

CRUD ロジック =「タスク操作の頭脳」
CRUD = Create / Read / Update / Delete






/*                                                                                                                                                                                                                                                                                                                   
再開する手順
1,ターミナル（またはコマンドプロンプト）を開く
2,プロジェクトのフォルダに移動する    cd ..\Lesson_4_React_Task\
3,Viteを起動　npm run dev
これで開発サーバーが起動し、再び http://localhost:5173/ にアクセスできるようになります


新設の手順
1,ターミナル（またはコマンドプロンプト）を開く,新しいフォルダを作る。　C:\Users\SUAFACE\Desktop\プログラミング\Lesson_4_React_useState2\
2,ターミナルでそのフォルダに移動   　　　　　　　　　　　　　　　　　cd C:\Users\SUAFACE\Desktop\プログラミング\Lesson_4_React_useState2\
3,React（Vite）プロジェクトを新しく作る                    npm create vite@latest
4,サーバーを起動  npm run dev
*/