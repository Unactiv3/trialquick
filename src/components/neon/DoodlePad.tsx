import { useEffect, useRef, useState } from "react";

const INKS = [
  { name: "cyan", css: "var(--neon)" },
  { name: "magenta", css: "var(--magenta)" },
  { name: "lime", css: "var(--lime)" },
  { name: "amber", css: "var(--amber)" },
  { name: "violet", css: "var(--violet)" },
];

export function DoodlePad() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const [ink, setInk] = useState(0);
  const [size, setSize] = useState(3);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const snapshot = canvas.toDataURL();
      canvas.width = rect.width * devicePixelRatio;
      canvas.height = rect.height * devicePixelRatio;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.scale(devicePixelRatio, devicePixelRatio);
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, rect.width, rect.height);
      img.src = snapshot;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const point = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    const { x, y } = point(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const styles = getComputedStyle(document.documentElement);
    const color = styles
      .getPropertyValue((INKS[ink] ?? INKS[0]!).css.replace("var(", "").replace(")", ""))
      .trim();
    const { x, y } = point(e);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = size;
    ctx.strokeStyle = color || "#3ff";
    ctx.shadowBlur = 12;
    ctx.shadowColor = color || "#3ff";
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const end = () => {
    drawing.current = false;
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="panel scan relative p-4">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary">
          // doodle deck
        </p>
        <button
          onClick={clear}
          className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent hover:magenta-text"
        >
          wipe
        </button>
      </div>

      <canvas
        ref={canvasRef}
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerLeave={end}
        className="mt-3 h-56 w-full cursor-crosshair rounded-sm border border-border bg-background/50 grid-floor touch-none"
      />

      <div className="mt-3 flex items-center gap-3">
        <div className="flex gap-1.5">
          {INKS.map((c, i) => (
            <button
              key={c.name}
              onClick={() => setInk(i)}
              aria-label={c.name}
              style={{ background: c.css }}
              className={`size-5 rounded-full transition-transform ${
                ink === i ? "scale-125 ring-2 ring-foreground/60" : "opacity-70"
              }`}
            />
          ))}
        </div>
        <input
          type="range"
          min={1}
          max={14}
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          className="ml-auto h-1 w-28 accent-[var(--magenta)]"
        />
        <span className="font-mono text-[11px] text-muted-foreground">{size}px</span>
      </div>
    </div>
  );
}
