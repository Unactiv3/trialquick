import { useEffect, useRef, useState } from "react";

const FALLBACK = { label: "focus", mins: 25 };
const PRESETS = [
  { label: "focus", mins: 25 },
  { label: "short break", mins: 5 },
  { label: "long break", mins: 15 },
];

const at = (i: number) => PRESETS[i] ?? FALLBACK;

export function BreakTimer({ onDone }: { onDone: (msg: string) => void }) {
  const [preset, setPreset] = useState(0);
  const [left, setLeft] = useState(at(0).mins * 60);
  const [running, setRunning] = useState(false);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          setRunning(false);
          doneRef.current(`${at(preset).label} finished — step away from the grid`);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, preset]);

  const select = (i: number) => {
    setPreset(i);
    setLeft(at(i).mins * 60);
    setRunning(false);
  };

  const total = at(preset).mins * 60;
  const pct = ((total - left) / total) * 100;
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");

  return (
    <div className="panel scan relative p-4">
      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary">
        // break timer
      </p>

      <p
        className={`mt-3 font-display text-5xl leading-none tracking-tighter text-primary ${
          running ? "neon-text" : ""
        }`}
      >
        {mm}:{ss}
      </p>

      <div className="mt-3 h-1.5 w-full rounded-full bg-secondary/60">
        <div
          className="h-full rounded-full bg-[var(--magenta)] transition-[width] duration-700"
          style={{ width: `${pct}%`, boxShadow: "var(--glow-magenta)" }}
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {PRESETS.map((p, i) => (
          <button
            key={p.label}
            onClick={() => select(i)}
            className={`rounded-sm border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors ${
              preset === i
                ? "border-primary bg-primary/15 text-primary"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => setRunning((r) => !r)}
          className="flex-1 rounded-sm bg-primary py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-primary-foreground hover:brightness-110"
        >
          {running ? "pause" : "start"}
        </button>
        <button
          onClick={() => select(preset)}
          className="rounded-sm border border-border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
        >
          reset
        </button>
      </div>
    </div>
  );
}
