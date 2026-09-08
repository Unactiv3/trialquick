import { useEffect, useState } from "react";
import { PageDeck } from "@/components/neon/PageDeck";
import { DoodlePad } from "@/components/neon/DoodlePad";
import { TaskDeck } from "@/components/neon/TaskDeck";
import { IdeaWall } from "@/components/neon/IdeaWall";
import { BreakTimer } from "@/components/neon/BreakTimer";

export default function App() {
  const [glass, setGlass] = useState(42);
  const [sleep, setSleep] = useState(false);
  const [alerts, setAlerts] = useState<{ id: number; msg: string }[]>([]);
  const [clock, setClock] = useState("");

  useEffect(() => {
    document.documentElement.style.setProperty("--glass-alpha", String(glass / 100));
  }, [glass]);

  useEffect(() => {
    const tick = () =>
      setClock(
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      );
    tick();
    const id = setInterval(tick, 1000 * 20);
    return () => clearInterval(id);
  }, []);

  const push = (msg: string) => {
    const id = Date.now();
    setAlerts((a) => [...a, { id, msg }]);
    setTimeout(() => setAlerts((a) => a.filter((x) => x.id !== id)), 6000);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 grid-floor opacity-60" />
      <div className="pointer-events-none absolute -left-40 top-0 size-[520px] rounded-full bg-primary/20 blur-[140px]" />
      <div className="pointer-events-none absolute -right-32 top-1/3 size-[520px] rounded-full bg-accent/20 blur-[150px]" />

      <div className="relative mx-auto max-w-[1400px] px-5 py-6 md:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-sm border border-primary bg-primary/10 font-display text-lg font-black text-primary neon-text">
              N
            </span>
            <div>
              <h1 className="font-display text-xl font-black tracking-[0.12em] text-foreground">
                NEON<span className="text-accent magenta-text">PAD</span>
              </h1>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                private terminal · {clock}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-sm border border-border bg-card/40 px-3 py-2 backdrop-blur">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                transparent
              </span>
              <input
                type="range"
                min={5}
                max={100}
                value={glass}
                onChange={(e) => setGlass(Number(e.target.value))}
                className="h-1 w-28 accent-[var(--neon)]"
              />
              <span className="font-mono text-[10px] text-primary">{glass}%</span>
            </div>

            <button
              onClick={() => setSleep(true)}
              className="rounded-sm border border-[var(--violet)] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--violet)] hover:bg-[var(--violet)]/15"
            >
              sleep mode
            </button>
          </div>
        </header>

        <div className="mt-6 grid grid-cols-12 gap-5">
          <main className="col-span-12 lg:col-span-7">
            <PageDeck />
          </main>

          <aside className="col-span-12 space-y-5 lg:col-span-5">
            <TaskDeck onAlert={push} />
            <BreakTimer onDone={push} />
            <DoodlePad />
            <IdeaWall />
          </aside>
        </div>

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          <span>neonpad · one mind, one grid</span>
          <span>stored on this device only</span>
        </footer>
      </div>

      <div className="pointer-events-none fixed bottom-5 right-5 z-50 flex w-[300px] flex-col gap-2">
        {alerts.map((a) => (
          <div
            key={a.id}
            className="pointer-events-auto rounded-sm border border-accent bg-background/90 px-4 py-3 font-mono text-xs text-accent backdrop-blur"
            style={{ boxShadow: "var(--glow-magenta)" }}
          >
            {a.msg}
          </div>
        ))}
      </div>

      {sleep && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-background/95 backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0 grid-floor opacity-20" />
          <div className="relative text-center">
            <p className="font-display text-7xl font-black tracking-tighter text-[var(--violet)] md:text-8xl">
              {clock}
            </p>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
              sleep mode engaged · the grid can wait
            </p>
            <button
              onClick={() => setSleep(false)}
              className="mt-8 rounded-sm border border-primary px-6 py-2.5 font-mono text-[11px] uppercase tracking-[0.24em] text-primary hover:bg-primary/15"
            >
              wake up
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
