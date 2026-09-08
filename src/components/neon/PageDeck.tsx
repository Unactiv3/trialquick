import { useState } from "react";
import { uid, useLocal } from "@/lib/storage";

type Page = { id: string; title: string; body: string };

export function PageDeck() {
  const [pages, setPages] = useLocal<Page[]>("neonpad.pages", [
    {
      id: "p1",
      title: "NIGHT LOG 001",
      body: "The rain hasn't stopped since the grid went up.\n\nI keep the pen uncapped so the first thought of the night meets no friction. Nothing to sync. Nothing to explain.",
    },
    { id: "p2", title: "SCRAP CODE", body: "" },
  ]);
  const [activeId, setActiveId] = useState<string>("p1");
  const active = pages.find((p) => p.id === activeId) ?? pages[0];

  if (!active) return null;

  const patch = (data: Partial<Page>) =>
    setPages((v) => v.map((p) => (p.id === active.id ? { ...p, ...data } : p)));

  const addPage = () => {
    const p = { id: uid(), title: `NIGHT LOG ${String(pages.length + 1).padStart(3, "0")}`, body: "" };
    setPages((v) => [...v, p]);
    setActiveId(p.id);
  };

  const words = active.body.trim() ? active.body.trim().split(/\s+/).length : 0;

  return (
    <div className="panel scan relative flex min-h-[520px] flex-col p-5 md:p-7">
      <div className="flex flex-wrap items-center gap-2">
        {pages.map((p) => (
          <button
            key={p.id}
            onClick={() => setActiveId(p.id)}
            className={`rounded-sm border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors ${
              p.id === active.id
                ? "border-accent bg-accent/15 text-accent"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {p.title}
          </button>
        ))}
        <button
          onClick={addPage}
          className="rounded-sm border border-dashed border-primary/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-primary"
        >
          + page
        </button>
      </div>

      <input
        value={active.title ?? ""}
        onChange={(e) => patch({ title: e.target.value })}
        className="mt-6 w-full bg-transparent font-display text-3xl font-bold tracking-tight text-foreground outline-none md:text-4xl"
      />
      <div className="mt-2 h-px w-full bg-gradient-to-r from-primary/70 via-accent/50 to-transparent" />

      <textarea
        value={active.body ?? ""}
        onChange={(e) => patch({ body: e.target.value })}
        placeholder="start writing into the dark…"
        className="mt-5 min-h-[300px] flex-1 w-full resize-none bg-transparent text-[15px] leading-relaxed text-foreground/85 outline-none placeholder:text-muted-foreground"
      />

      <div className="mt-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        <span>{words} words · autosaved to this device</span>
        <span className="text-primary">rec ●</span>
      </div>
    </div>
  );
}
