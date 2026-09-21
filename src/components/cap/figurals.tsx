import type { IcarItem } from "@/lib/cap/icar-items";
import {
  cubeOptions,
  faceGlyph,
  FACE_GLYPHS,
  makeCube,
  type CubeFaces,
} from "@/lib/cap/cube";

const INK = "#000000";
const FACE = "#fdf4e3";
const FACE_F = "#eadfc8";
const FACE_R = "#d4c7ab";
const EDGE = "#1f2228";

function cellGlyph(shape: number, fill: number, size = 28) {
  const s = shape % 3;
  const f = fill % 3;
  const fillPaint = f === 1 ? FACE : "none";
  const extra = f === 2 ? <circle cx="0" cy="0" r="3.5" fill={FACE} /> : null;
  if (s === 0) {
    return (
      <g>
        <circle r={size / 2 - 2} fill={fillPaint} stroke={FACE} strokeWidth="1.6" />
        {extra}
      </g>
    );
  }
  if (s === 1) {
    const h = size / 2 - 3;
    return (
      <g>
        <rect
          x={-h}
          y={-h}
          width={h * 2}
          height={h * 2}
          fill={fillPaint}
          stroke={FACE}
          strokeWidth="1.6"
        />
        {extra}
      </g>
    );
  }
  return (
    <g>
      <polygon
        points={`0,${-size / 2 + 2} ${size / 2 - 2},0 0,${size / 2 - 2} ${-size / 2 + 2},0`}
        fill={fillPaint}
        stroke={FACE}
        strokeWidth="1.6"
      />
      {extra}
    </g>
  );
}

function matrixValue(seed: number, r: number, c: number) {
  const shape = (r + seed) % 3;
  const fill = (c + seed) % 3;
  if (c === 2) {
    return { shape: (r + seed) % 3, fill: (shape + fill + seed) % 3 };
  }
  return { shape, fill };
}

export function MatrixFigure({
  item,
  choice,
  compact,
}: {
  item: IcarItem;
  choice?: number;
  compact?: boolean;
}) {
  const seed = item.seed;
  const cells: Array<{ shape: number; fill: number; hide?: boolean }> = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const v = matrixValue(seed, r, c);
      const isMissing = r === 2 && c === 2;
      cells.push({ ...v, hide: isMissing && choice == null });
    }
  }
  if (choice != null) {
    const correct = matrixValue(seed, 2, 2);
    const offset = choice - item.answer;
    cells[8] = {
      shape: (correct.shape + offset + 9) % 3,
      fill: (correct.fill + (offset === 0 ? 0 : 1 + Math.abs(offset))) % 3,
      hide: false,
    };
  }
  return (
    <svg viewBox="0 0 168 168" className={compact ? "h-16 w-16" : "h-40 w-40"} aria-hidden>
      <rect width="168" height="168" fill="#1f2228" rx="8" />
      {cells.map((cell, i) => {
        const r = Math.floor(i / 3);
        const c = i % 3;
        const x = 28 + c * 56;
        const y = 28 + r * 56;
        return (
          <g key={i} transform={`translate(${x},${y})`}>
            <rect x="-24" y="-24" width="48" height="48" fill="#000000" stroke="#333a4b" />
            {cell.hide ? (
              <text
                textAnchor="middle"
                dy="6"
                fill="#e0400a"
                fontSize="18"
                fontFamily="Fraunces, serif"
              >
                ?
              </text>
            ) : (
              cellGlyph(cell.shape, cell.fill)
            )}
          </g>
        );
      })}
    </svg>
  );
}

type Axis = { origin: [number, number]; u: [number, number]; v: [number, number] };

const TOP: Axis = { origin: [44, 8], u: [36, 20], v: [-36, 20] };
const FRONT: Axis = { origin: [8, 28], u: [36, 20], v: [0, 36] };
const RIGHT: Axis = { origin: [44, 48], u: [36, -20], v: [0, 36] };

function map(axis: Axis, u: number, v: number) {
  return {
    x: axis.origin[0] + u * axis.u[0] + v * axis.v[0],
    y: axis.origin[1] + u * axis.u[1] + v * axis.v[1],
  };
}

/**
 * Paint the mark in the face's own UV space so it skews/rotates with the cube
 * instead of staying screen-upright.
 */
function FaceMark({ n, axis }: { n: number; axis: Axis }) {
  const [ox, oy] = axis.origin;
  const [ux, uy] = axis.u;
  const [vx, vy] = axis.v;
  // Local face is the unit square mapped by matrix(u, v, origin).
  // fontSize is in local face units (face ≈ 1×1).
  return (
    <g transform={`matrix(${ux} ${uy} ${vx} ${vy} ${ox} ${oy})`}>
      <text
        x={0.5}
        y={0.52}
        textAnchor="middle"
        dominantBaseline="central"
        fill={INK}
        fontSize={0.46}
        fontFamily="'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', ui-sans-serif, system-ui, sans-serif"
        fontWeight={700}
      >
        {faceGlyph(n)}
      </text>
    </g>
  );
}

function Cube({ cube, size = 96 }: { cube: CubeFaces; size?: number }) {
  const label = `cube ${faceGlyph(cube.U)} on top, ${faceGlyph(cube.F)} in front, ${faceGlyph(cube.R)} on the right`;
  return (
    <svg
      viewBox="0 0 88 92"
      width={size}
      height={size * 1.05}
      role="img"
      aria-label={label}
    >
      <polygon points="44,8 80,28 44,48 8,28" fill={FACE} stroke={EDGE} strokeWidth="1.4" />
      <polygon points="8,28 44,48 44,84 8,64" fill={FACE_F} stroke={EDGE} strokeWidth="1.4" />
      <polygon points="44,48 80,28 80,64 44,84" fill={FACE_R} stroke={EDGE} strokeWidth="1.4" />
      <FaceMark n={cube.U} axis={TOP} />
      <FaceMark n={cube.F} axis={FRONT} />
      <FaceMark n={cube.R} axis={RIGHT} />
    </svg>
  );
}

export function RotationFigure({
  item,
  choice,
}: {
  item: IcarItem;
  choice?: number;
}) {
  const target = makeCube(item.seed);
  if (choice == null) {
    return <Cube cube={target} size={132} />;
  }
  const opts = cubeOptions(item.seed, item.answer);
  return <Cube cube={opts[choice - 1] ?? target} size={88} />;
}

export function GlyphFace({ n, size = 40 }: { n: number; size?: number }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden>
      <rect width="40" height="40" rx="6" fill={FACE} stroke={EDGE} />
      <text
        x="20"
        y="21"
        textAnchor="middle"
        dominantBaseline="central"
        fill={INK}
        fontSize="20"
        fontWeight={700}
        fontFamily="'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', ui-sans-serif, system-ui, sans-serif"
      >
        {faceGlyph(n)}
      </text>
    </svg>
  );
}

export function GlyphLegend() {
  return (
    <div className="flex flex-wrap gap-3">
      {FACE_GLYPHS.map((g, i) => (
        <div
          key={`${g}-${i}`}
          className="flex items-center gap-2 rounded-[var(--radius-sm)] border border-border bg-moon px-2 py-1 text-bg"
        >
          <GlyphFace n={i + 1} size={28} />
          <span className="text-sm" aria-hidden>
            {g}
          </span>
        </div>
      ))}
    </div>
  );
}
