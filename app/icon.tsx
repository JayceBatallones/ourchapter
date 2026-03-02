import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// O (cols 0-7) and C (cols 30-36) extracted from the ANSI Shadow pixel logo.
// 0 = empty, 1 = detail (40% opacity), 2 = full block
const OC_GRID = [
  [0,2,2,2,2,2,2,1, 0, 0,2,2,2,2,2,2],
  [2,2,1,1,1,1,2,2, 0, 2,2,1,1,1,1,1],
  [2,2,1,0,0,0,2,2, 0, 2,2,1,0,0,0,0],
  [2,2,1,0,0,0,2,2, 0, 2,2,1,0,0,0,0],
  [1,2,2,2,2,2,2,1, 0, 1,2,2,2,2,2,2],
  [0,1,1,1,1,1,1,1, 0, 0,1,1,1,1,1,1],
];

const PX = 2;
const COLS = OC_GRID[0].length; // 16
const ROWS = OC_GRID.length;    // 6
const PAD_Y = Math.floor((32 - ROWS * PX) / 2);

export default function Icon() {
  const cells: { x: number; y: number; opacity: number }[] = [];

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const v = OC_GRID[r][c];
      if (v === 0) continue;
      cells.push({
        x: c * PX,
        y: PAD_Y + r * PX,
        opacity: v === 2 ? 1 : 0.4,
      });
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "black",
          position: "relative",
        }}
      >
        {cells.map((cell, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: cell.x,
              top: cell.y,
              width: PX,
              height: PX,
              backgroundColor: `rgba(255,255,255,${cell.opacity})`,
            }}
          />
        ))}
      </div>
    ),
    { ...size },
  );
}
