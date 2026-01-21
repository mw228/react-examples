import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../../ui/Button";
import { Card } from "../../ui/Card";

type Todo = {
  id: string;
  text: string;
  done: boolean;
  createdAt: number;
};

type Filter = "all" | "active" | "done";

const STORAGE_KEY = "mw.reactExamples.todos.v1";

function safeParseTodos(raw: string | null): Todo[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw) as unknown;
    if (!Array.isArray(data)) return [];
    return data
      .filter((t) => typeof t === "object" && t !== null)
      .map((t: any) => ({
        id: typeof t.id === "string" ? t.id : crypto.randomUUID(),
        text: typeof t.text === "string" ? t.text : "",
        done: typeof t.done === "boolean" ? t.done : false,
        createdAt: typeof t.createdAt === "number" ? t.createdAt : Date.now(),
      }))
      .filter((t) => t.text.trim().length > 0);
  } catch {
    return [];
  }
}

function saveTodos(todos: Todo[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

export default function TodosDemo() {
  const [todos, setTodos] = useState<Todo[]>(() =>
    safeParseTodos(localStorage.getItem(STORAGE_KEY))
  );
  const [text, setText] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const inputRef = useRef<HTMLInputElement | null>(null);

  // Persist on change
  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  const filtered = useMemo(() => {
    switch (filter) {
      case "active":
        return todos.filter((t) => !t.done);
      case "done":
        return todos.filter((t) => t.done);
      default:
        return todos;
    }
  }, [todos, filter]);

  const counts = useMemo(() => {
    const done = todos.filter((t) => t.done).length;
    return { done, total: todos.length, active: todos.length - done };
  }, [todos]);

  function addTodo() {
    const value = text.trim();
    if (!value) return;

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: value,
      done: false,
      createdAt: Date.now(),
    };

    setTodos((prev) => [newTodo, ...prev]);
    setText("");
    // keep flow fast
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }

  function toggleTodo(id: string) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  function removeTodo(id: string) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  function clearCompleted() {
    setTodos((prev) => prev.filter((t) => !t.done));
  }

  return (
    <div>
      <h2 className="page-title">Todo List Demo</h2>
      <p className="page-subtitle">
        A common interview exercise: add, remove, toggle complete, filter, and
        persist state across reload using localStorage.
      </p>

      <div className="grid grid--cards">
        <Card
          title="Add items"
          description="Enter a task and press Enter or Add. Items persist on reload."
        >
          <label htmlFor="todo-input" className="demo-note">
            New todo
          </label>

          <div className="demo-row" style={{ alignItems: "flex-end" }}>
            <div style={{ flex: 1, minWidth: 220 }}>
              <input
                id="todo-input"
                ref={inputRef}
                className="input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g. Update portfolio home page"
                onKeyDown={(e) => {
                  if (e.key === "Enter") addTodo();
                }}
                aria-describedby="todo-help"
              />
              <div id="todo-help" className="demo-note" style={{ marginTop: 8 }}>
                Tip: Use Enter to add quickly.
              </div>
            </div>

            <Button onClick={addTodo} disabled={text.trim().length === 0}>
              Add
            </Button>
          </div>

          <div className="demo-row" style={{ marginTop: 12, gap: 10, flexWrap: "wrap" }}>
            <Button
              variant={filter === "all" ? "secondary" : "ghost"}
              onClick={() => setFilter("all")}
            >
              All ({counts.total})
            </Button>
            <Button
              variant={filter === "active" ? "secondary" : "ghost"}
              onClick={() => setFilter("active")}
            >
              Active ({counts.active})
            </Button>
            <Button
              variant={filter === "done" ? "secondary" : "ghost"}
              onClick={() => setFilter("done")}
            >
              Done ({counts.done})
            </Button>

            <Button
              variant="ghost"
              disabled={counts.done === 0}
              onClick={clearCompleted}
            >
              Clear completed
            </Button>
          </div>
        </Card>

        <Card
          title="Your list"
          description="Accessible checkboxes, clear actions, and empty states."
        >
          {filtered.length === 0 ? (
            <div className="demo-note" role="status" aria-live="polite">
              {todos.length === 0
                ? "No todos yet. Add one above."
                : "No items match the current filter."}
            </div>
          ) : (
            <ul className="list" aria-label="Todo items">
              {filtered.map((t) => (
                <li key={t.id} className="list-item">
                  <div className="todo-row">
                    <label className="todo-check">
                      <input
                        type="checkbox"
                        checked={t.done}
                        onChange={() => toggleTodo(t.id)}
                        aria-label={t.done ? `Mark ${t.text} as not done` : `Mark ${t.text} as done`}
                      />
                      <span className={`todo-text ${t.done ? "is-done" : ""}`}>
                        {t.text}
                      </span>
                    </label>

                    <Button
                      variant="ghost"
                      onClick={() => removeTodo(t.id)}
                      aria-label={`Remove ${t.text}`}
                    >
                      Remove
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card
          title="Reload behavior"
          description="What happens on refresh?"
        >
          <ul className="card-desc" style={{ margin: 0, paddingLeft: "1.1rem" }}>
            <li>Todos are stored in <code>localStorage</code> after every change.</li>
            <li>On load, we safely parse and validate the stored data.</li>
            <li>If storage is empty or corrupted, we fall back to an empty list.</li>
          </ul>
          <div className="card-cta" style={{ marginTop: 12 }}>
            Try it: add a few items, refresh the page, and your list remains.
          </div>
        </Card>
      </div>
    </div>
  );
}
