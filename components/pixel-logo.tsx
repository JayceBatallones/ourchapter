// Option B — ANSI Shadow, encoded directly from the raw art.
// Full blocks (█) render at full opacity; box-drawing chars (╔═╗║╚╝)
// render at lower opacity for the shadow/detail effect.

const RAW = [
  " ██████╗ ██╗   ██╗██████╗      ██████╗██╗  ██╗ █████╗ ██████╗ ████████╗███████╗██████╗ ",
  "██╔═══██╗██║   ██║██╔══██╗    ██╔════╝██║  ██║██╔══██╗██╔══██╗╚══██╔══╝██╔════╝██╔══██╗",
  "██║   ██║██║   ██║██████╔╝    ██║     ███████║███████║██████╔╝   ██║   █████╗  ██████╔╝",
  "██║   ██║██║   ██║██╔══██╗    ██║     ██╔══██║██╔══██║██╔═══╝    ██║   ██╔══╝  ██╔══██╗",
  "╚██████╔╝╚██████╔╝██║  ██║    ╚██████╗██║  ██║██║  ██║██║        ██║   ███████╗██║  ██║",
  " ╚═════╝  ╚═════╝ ╚═╝  ╚═╝     ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝        ╚═╝   ╚══════╝╚═╝  ╚═╝",
];

// 0 = empty, 1 = border/detail char, 2 = full block
const FULL = new Set(["█"]);

const PARSED = RAW.map((line) =>
  [...line].map((ch) => (ch === " " ? 0 : FULL.has(ch) ? 2 : 1)),
);
const MAX_W = Math.max(...PARSED.map((r) => r.length));
const GRID = PARSED.map((row) => {
  while (row.length < MAX_W) row.push(0);
  return row;
});

const WIDTH = MAX_W;
const HEIGHT = GRID.length;

// Collect pixels by type
const BLOCKS: { x: number; y: number }[] = [];
const DETAILS: { x: number; y: number }[] = [];

GRID.forEach((row, y) => {
  row.forEach((cell, x) => {
    if (cell === 2) BLOCKS.push({ x, y });
    else if (cell === 1) DETAILS.push({ x, y });
  });
});

export function PixelLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Our Chapter"
    >
      {/* Border / detail characters — lower opacity for depth */}
      <g fill="currentColor" opacity={0.4}>
        {DETAILS.map(({ x, y }) => (
          <rect key={`d-${x}-${y}`} x={x} y={y} width={1} height={1} />
        ))}
      </g>

      {/* Full blocks — main body */}
      <g fill="currentColor">
        {BLOCKS.map(({ x, y }) => (
          <rect key={`b-${x}-${y}`} x={x} y={y} width={1} height={1} />
        ))}
      </g>
    </svg>
  );
}
