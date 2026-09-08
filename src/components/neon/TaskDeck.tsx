import { useEffect, useRef, useState } from "react";
import { uid, useLocal } from "@/lib/storage";

type Task = {
  id: string;
  text: string;
  done: boolean;
  remindAt: string | null;
};

export function TaskDeck({ onAlert }: { onAlert: (msg: string) => void }) {
  const [tasks, setTasks] = useLocal<Task[]>("neonpad.tasks", [
    { id: "a1", text: "sketch the rain-slick alley", done: false, remindAt: null },
    { id: "a2", text: "finish chapter on neon rain", done: true, remindAt: null },
  ]);
  const [draft, setDraft] = useState("");
  const [remindId, setRemindId] = useState<string | null>(null);
  const [remindTime, setRemindTime] = useState("");
  const fired = useRef<Set<string>>(new Set());
  const alertRef = useRef(onAlert);
  alertRef.current = onAlert;

  useEffect(() => {
    const id = setInterval(() => {
      const now = Date.now();
      tasks.forEach((t) => {
        if (!t.remindAt || t.done || fired.current.has(t.id)) return;
        if (new Date(t.remindAt).getTime() <= now) {
          fired.current.add(t.id);
          alertRef.current(`reminder :: ${t.text}`);
        }
      });
    }, 5000);
    return () => clearInterval(id);
  }, [tasks]);

  const add = () => {
    const text = draft.trim();
    if (!text) return;
    setTasks((t) => [{ id: uid(), text, done: false, remindAt: null }, ...t]);
    setDraft("");
  };

  const toggle = (id: string) =>
    setTasks((t) => t.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));

  const remove = (id: string) => setTasks((t) => t.filter((x) => x.id !== id));

  const saveReminder = () => {
    if (!remindId || !remindTime) return;
    setTasks((t) =>
      t.map((x) => (x.id === remindId ? { ...x, remindAt: remindTime } : x)),
    );
    fired.current.delete(remindId);
    onAlert("reminder locked in");
    setRemindId(null);
    setRemindTime("");
  };

  const left = tasks.filter((t) => !t.done).length;

  return (
    <div className="panel scan relative p-4">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary">
          // memory bank
        </p>
        <span className="font-mono text-[11px] text-muted-foreground">{left} open</span>
      </div>

      <div className="mt-3 flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="what must not be forgotten…"
          className="min-w-0 flex-1 rounded-sm border border-input bg-background/50 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
        />
        <button
          onClick={add}
          className="rounded-sm bg-accent px-3 font-mono text-[11px] uppercase tracking-[0.16em] text-accent-foreground hover:brightness-110"
        >
          add
        </button>
      </div>

      <ul className="mt-3 space-y-2">
        {tasks.map((t) => (
          <li
            key={t.id}
            className="group flex items-center gap-3 rounded-sm border border-border bg-background/30 px-3 py-2"
          >
            <button
              onClick={() => toggle(t.id)}
              className={`grid size-5 shrink-0 place-items-center rounded-sm border text-[10px] ${
                t.done
                  ? "border-primary bg-primary/20 text-primary"
                  : "border-muted-foreground/50 text-transparent"
              }`}
            >
              ✓
            </button>
            <div className="min-w-0 flex-1">
              <p
                className={`truncate text-sm ${
                  t.done ? "text-muted-foreground line-through" : "text-foreground"
                }`}
              >
                {t.text}
              </p>
              {t.remindAt && (
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--amber)]">
                  ping {new Date(t.remindAt).toLocaleString()}
                </p>
              )}
            </div>
            <button
              onClick={() => setRemindId(remindId === t.id ? null : t.id)}
              className="font-mono text-[10px] uppercase tracking-[0.14em] text-primary opacity-70 hover:opacity-100"
            >
              remind
            </button>
            <button
              onClick={() => remove(t.id)}
              className="font-mono text-[13px] text-muted-foreground hover:text-destructive"
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      {remindId && (
        <div className="mt-3 flex gap-2 rounded-sm border border-[var(--amber)]/40 bg-background/50 p-2">
          <input
            type="datetime-local"
            value={remindTime}
            onChange={(e) => setRemindTime(e.target.value)}
            className="min-w-0 flex-1 bg-transparent font-mono text-xs text-foreground outline-none"
          />
          <button
            onClick={saveReminder}
            className="rounded-sm bg-[var(--amber)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-primary-foreground"
          >
            set
          </button>
        </div>
      )}
    </div>
  );
}
