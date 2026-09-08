import { useState } from "react";
import { uid, useLocal } from "@/lib/storage";

type Idea = { id: string; text: string; hue: number; tilt: number };

const HUES = ["var(--neon)", "var(--magenta)", "var(--lime)", "var(--amber)", "var(--violet)"];

export function IdeaWall() {
  const [ideas, setIdeas] = useLocal<Idea[]>("neonpad.ideas", [
    { id: "i1", text: "a city that dreams in static", hue: 0, tilt: -2 },
    { id: "i2", text: "letters written in rain", hue: 1, tilt: 1.5 },
    { id: "i3", text: "the vending machine oracle", hue: 3, tilt: -1 },
  ]);
  const [draft, setDraft] = useState("");

  const add = () => {
    const text = draft.trim();
    if (!text) return;
    setIdeas((v) => [
      ...v,
      {
        id: uid(),
        text,
        hue: Math.floor(Math.random() * HUES.length),
        tilt: Math.random() * 5 - 2.5,
      },
    ]);
    setDraft("");
  };

  return (
    <div className="panel scan relative p-4">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary">
          // idea wall
        </p>
        <span className="font-mono text-[11px] text-muted-foreground">
          {ideas.length} fragments
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-3">
        {ideas.map((i) => (
          <div
            key={i.id}
            onDoubleClick={() => setIdeas((v) => v.filter((x) => x.id !== i.id))}
            style={{
              transform: `rotate(${i.tilt}deg)`,
              borderColor: HUES[i.hue],
              boxShadow: `0 0 22px -6px ${HUES[i.hue]}`,
            }}
            className="w-[46%] min-w-[150px] flex-1 cursor-pointer rounded-sm border bg-background/40 p-3 transition-transform hover:scale-[1.03]"
            title="double-click to burn"
          >
            <p className="text-sm leading-snug" style={{ color: HUES[i.hue] }}>
              {i.text}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="drop a fragment…"
          className="min-w-0 flex-1 rounded-sm border border-input bg-background/50 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-accent"
        />
        <button
          onClick={add}
          className="rounded-sm border border-primary px-3 font-mono text-[11px] uppercase tracking-[0.16em] text-primary hover:bg-primary/15"
        >
          pin
        </button>
      </div>
    </div>
  );
}
