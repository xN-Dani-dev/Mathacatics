import type { Visual } from "@/lib/lesson-content";

/** Renders a teaching visual as a small SVG diagram with a caption. */
export function VisualDiagram({ visual }: { visual: Visual }) {
  return (
    <figure className="rounded-2xl border-2 bg-card p-4">
      <svg viewBox="0 0 300 160" className="math-diagram mx-auto h-36 w-full" role="img" aria-label={visual.caption}>
        {visual.kind === "flow" && <Flow items={visual.items} />}
        {visual.kind === "fraction" && <Fraction filled={visual.filled} parts={visual.parts} />}
        {visual.kind === "line" && <NumberLine points={visual.points} />}
        {visual.kind === "graph" && <Graph slope={visual.slope} intercept={visual.intercept} />}
        {visual.kind === "rectangle" && <Rect width={visual.width} height={visual.height} />}
        {visual.kind === "venn" && <Venn />}
        {visual.kind === "triangle" && <Triangle />}
        {visual.kind === "circle" && <Circle />}
        {visual.kind === "bars" && <Bars values={visual.values} />}
      </svg>
      <figcaption className="mt-2 text-center text-sm font-bold text-muted-foreground">{visual.caption}</figcaption>
    </figure>
  );
}

const stroke = "currentColor";

function Flow({ items }: { items: string[] }) {
  const w = Math.min(260, Math.max(90, ...items.map((s) => s.length * 8 + 24)));
  const h = 150 / items.length;
  return (
    <g>
      {items.map((s, i) => (
        <g key={i}>
          <rect x={150 - w / 2} y={i * h + 4} width={w} height={h - 14} rx={10} className="fill-primary/10" stroke={stroke} strokeWidth={2} />
          <text x={150} y={i * h + h / 2 - 1} textAnchor="middle" fontSize={13} fontWeight={700} className="fill-foreground">{s}</text>
          {i < items.length - 1 && <text x={150} y={i * h + h - 2} textAnchor="middle" fontSize={12} className="fill-muted-foreground">↓</text>}
        </g>
      ))}
    </g>
  );
}

function Fraction({ filled, parts }: { filled: number; parts: number }) {
  const w = 240 / parts;
  return (
    <g>
      {Array.from({ length: parts }, (_, i) => (
        <rect key={i} x={30 + i * w} y={55} width={w} height={50} className={i < filled ? "fill-gold" : "fill-muted"} stroke={stroke} strokeWidth={2} />
      ))}
      <text x={150} y={140} textAnchor="middle" fontSize={16} fontWeight={800} className="fill-foreground">{filled}/{parts}</text>
    </g>
  );
}

function NumberLine({ points }: { points: number[] }) {
  const min = Math.min(...points, 0) - 1, max = Math.max(...points, 0) + 1;
  const x = (v: number) => 30 + ((v - min) / (max - min)) * 240;
  return (
    <g>
      <line x1={20} y1={80} x2={280} y2={80} stroke={stroke} strokeWidth={2} />
      {Array.from({ length: max - min + 1 }, (_, i) => min + i).map((v) => (
        <g key={v}>
          <line x1={x(v)} y1={74} x2={x(v)} y2={86} stroke={stroke} strokeWidth={2} />
          <text x={x(v)} y={104} textAnchor="middle" fontSize={11} className="fill-muted-foreground">{v}</text>
        </g>
      ))}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={x(p)} cy={80} r={7} className={p < 0 ? "fill-destructive" : "fill-accent"} stroke={stroke} strokeWidth={2} />
          <text x={x(p)} y={60} textAnchor="middle" fontSize={13} fontWeight={800} className="fill-foreground">{p}</text>
        </g>
      ))}
    </g>
  );
}

function Graph({ slope, intercept }: { slope: number; intercept: number }) {
  const ox = 60, oy = 110, s = 22; // origin + scale
  const X = (x: number) => ox + x * s, Y = (y: number) => oy - y * s;
  const x1 = -1.5, x2 = 4.5;
  return (
    <g>
      <line x1={30} y1={oy} x2={280} y2={oy} stroke={stroke} strokeWidth={2} />
      <line x1={ox} y1={20} x2={ox} y2={140} stroke={stroke} strokeWidth={2} />
      <text x={272} y={oy - 6} fontSize={12} fontWeight={700} className="fill-muted-foreground">x</text>
      <text x={ox + 8} y={30} fontSize={12} fontWeight={700} className="fill-muted-foreground">y</text>
      <line x1={X(x1)} y1={Y(slope * x1 + intercept)} x2={X(x2)} y2={Y(slope * x2 + intercept)} className="stroke-sky" strokeWidth={3.5} strokeLinecap="round" />
      {[0, 1, 2].map((x) => (
        <circle key={x} cx={X(x)} cy={Y(slope * x + intercept)} r={5} className="fill-gold" stroke={stroke} strokeWidth={1.5} />
      ))}
    </g>
  );
}

function Rect({ width, height }: { width: number; height: number }) {
  const s = Math.min(200 / width, 110 / height);
  const w = width * s, h = height * s, x = 150 - w / 2, y = 80 - h / 2;
  return (
    <g>
      {Array.from({ length: width }, (_, i) => Array.from({ length: height }, (_, j) => (
        <rect key={`${i}-${j}`} x={x + i * s} y={y + j * s} width={s} height={s} className="fill-primary/10" stroke={stroke} strokeWidth={1} />
      )))}
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={stroke} strokeWidth={3} />
      <text x={150} y={y + h + 22} textAnchor="middle" fontSize={13} fontWeight={700} className="fill-foreground">{width}</text>
      <text x={x - 14} y={80} textAnchor="middle" fontSize={13} fontWeight={700} className="fill-foreground">{height}</text>
    </g>
  );
}

function Venn() {
  return (
    <g>
      <circle cx={120} cy={80} r={55} className="fill-sky/25" stroke={stroke} strokeWidth={2.5} />
      <circle cx={180} cy={80} r={55} className="fill-gold/40" stroke={stroke} strokeWidth={2.5} />
      <text x={95} y={84} textAnchor="middle" fontSize={15} fontWeight={800} className="fill-foreground">A</text>
      <text x={205} y={84} textAnchor="middle" fontSize={15} fontWeight={800} className="fill-foreground">B</text>
      <text x={150} y={84} textAnchor="middle" fontSize={12} fontWeight={700} className="fill-foreground">A∩B</text>
    </g>
  );
}

function Triangle() {
  return (
    <g>
      <polygon points="70,120 230,120 70,30" className="fill-accent/30" stroke={stroke} strokeWidth={2.5} strokeLinejoin="round" />
      <rect x={70} y={102} width={18} height={18} fill="none" stroke={stroke} strokeWidth={2} />
      <text x={150} y={145} textAnchor="middle" fontSize={12} fontWeight={700} className="fill-muted-foreground">base</text>
    </g>
  );
}

function Circle() {
  return (
    <g>
      <circle cx={150} cy={80} r={55} className="fill-sky/15" stroke={stroke} strokeWidth={2.5} />
      <line x1={150} y1={80} x2={205} y2={80} className="stroke-destructive" strokeWidth={2.5} />
      <line x1={95} y1={80} x2={205} y2={80} stroke={stroke} strokeWidth={1.5} strokeDasharray="5 4" />
      <circle cx={150} cy={80} r={4} className="fill-foreground" />
      <text x={177} y={72} textAnchor="middle" fontSize={13} fontWeight={800} className="fill-destructive">r</text>
      <text x={115} y={72} textAnchor="middle" fontSize={13} fontWeight={700} className="fill-muted-foreground">d = 2r</text>
    </g>
  );
}

function Bars({ values }: { values: number[] }) {
  const max = Math.max(...values), bw = 180 / values.length;
  return (
    <g>
      <line x1={50} y1={130} x2={270} y2={130} stroke={stroke} strokeWidth={2} />
      {values.map((v, i) => {
        const h = (v / max) * 95;
        return (
          <g key={i}>
            <rect x={60 + i * bw} y={130 - h} width={bw - 14} height={h} rx={4} className="fill-orange" stroke={stroke} strokeWidth={1.5} />
            <text x={60 + i * bw + (bw - 14) / 2} y={126 - h} textAnchor="middle" fontSize={12} fontWeight={800} className="fill-foreground">{v}</text>
          </g>
        );
      })}
    </g>
  );
}
