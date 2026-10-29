import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { ArrowLeft, Heart } from "lucide-react";

/* ---------- pixel art helpers ---------- */

function PixelArt({
  rows,
  cell,
  className,
}: {
  rows: string[];
  cell: number;
  className?: string;
}) {
  const w = rows[0].length;
  return (
    <svg
      aria-hidden="true"
      className={className}
      width={w * cell}
      height={rows.length * cell}
      viewBox={`0 0 ${w} ${rows.length}`}
      shapeRendering="crispEdges"
      fill="#141414"
    >
      {rows.flatMap((row, y) =>
        [...row].map((c, x) =>
          c === "#" ? (
            <rect key={`${x}-${y}`} x={x} y={y} width="1.02" height="1.02" />
          ) : null,
        ),
      )}
    </svg>
  );
}

const SAD_FILE = [
  "##########....",
  "#........##...",
  "#.........#.#.",
  "#..........###",
  "#............#",
  "#..##....##..#",
  "#..##....##..#",
  "#............#",
  "#............#",
  "#....####....#",
  "#...##..##...#",
  "#...#....#...#",
  "#............#",
  "#............#",
  "##############",
];

const DINO = [
  "........########",
  "........##.#####",
  "........########",
  "........########",
  "........#####...",
  "#.......#####...",
  "#......#######..",
  "##....#########.",
  "###..###########",
  "################",
  ".##############.",
  "..############..",
  "...##########...",
  "....########....",
  "....###..##.....",
  "....##...##.....",
  "....#....#......",
  "....##...##.....",
];

const CACTUS = [
  "....##....",
  "#...##....",
  "#...##.#..",
  "##..##.#..",
  ".#..##.#..",
  ".#######..",
  "..#####...",
  "....##....",
  "....##....",
  "....##....",
  "....##....",
  "....##....",
];

function PixelPlus({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      width="38"
      height="38"
      viewBox="0 0 24 24"
      shapeRendering="crispEdges"
      fill="#141414"
    >
      <rect x="8.5" y="0" width="7" height="7" />
      <rect x="0" y="8.5" width="7" height="7" />
      <rect x="8.5" y="8.5" width="7" height="7" />
      <rect x="17" y="8.5" width="7" height="7" />
      <rect x="8.5" y="17" width="7" height="7" />
    </svg>
  );
}

/* three short "impact" strokes */

/* ---------- notched (pixel-cut) corners ---------- */

const notch = (n: number, h = n / 2) =>
  `polygon(0 ${n}px, ${h}px ${n}px, ${h}px ${h}px, ${n}px ${h}px, ${n}px 0, calc(100% - ${n}px) 0, calc(100% - ${n}px) ${h}px, calc(100% - ${h}px) ${h}px, calc(100% - ${h}px) ${n}px, 100% ${n}px, 100% calc(100% - ${n}px), calc(100% - ${h}px) calc(100% - ${n}px), calc(100% - ${h}px) calc(100% - ${h}px), calc(100% - ${n}px) calc(100% - ${h}px), calc(100% - ${n}px) 100%, ${n}px 100%, ${n}px calc(100% - ${h}px), ${h}px calc(100% - ${h}px), ${h}px calc(100% - ${n}px), 0 calc(100% - ${n}px))`;

const NOTCH_STYLE: CSSProperties = { clipPath: notch(8, 4) };

/* ---------- decorative windows + tags ---------- */

function BrowserWindow({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      aria-hidden="true"
      className={`absolute h-[235px] w-[355px] rounded-[10px] border-2 border-[#141414] bg-[#f7f6f2] ${className ?? ""}`}
      style={style}
    >
      <div className="flex items-center gap-[6px] px-4 pt-[14px]">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-[9px] w-[9px] rounded-full border-2 border-[#141414]"
          />
        ))}
        <span className="ml-2 h-[2px] w-[18px] bg-[#141414]" />
      </div>
      <div className="mt-[10px] h-[2px] w-full bg-[#141414]" />
      <div className="flex h-[150px] items-center justify-center">
        {children}
      </div>
    </div>
  );
}

function Tag({
  label,
  color,
  className,
  rotate,
}: {
  label: string;
  color: string;
  className?: string;
  rotate: number;
}) {
  const corner =
    "absolute h-[6px] w-[6px] border border-[#141414] bg-[#f7f6f2]";
  return (
    <span
      aria-hidden="true"
      className={`absolute border-[1.5px] border-[#141414] px-4 py-[10px] font-mono text-[18px] font-extrabold tracking-[0.02em] text-[#141414] ${className ?? ""}`}
      style={{ backgroundColor: color, transform: `rotate(${rotate}deg)` }}
    >
      {label}
      <i className={`${corner} -left-[3px] -top-[3px]`} />
      <i className={`${corner} -right-[3px] -top-[3px]`} />
      <i className={`${corner} -bottom-[3px] -left-[3px]`} />
      <i className={`${corner} -bottom-[3px] -right-[3px]`} />
    </span>
  );
}

/* ---------- page ---------- */

export default function NotFound() {
  return (
    <main
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#f7f6f2] px-6 text-[#141414]"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(0,0,0,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.045) 1px, transparent 1px)",
        backgroundSize: "110px 110px",
        backgroundPosition: "62px 75px",
      }}
    >
      {/* header */}
      <header className="absolute inset-x-0 top-0 flex h-[75px] items-center justify-between border-b border-black/[0.06] px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="h-5 w-5 rounded-full border border-[#e58aa8] bg-[#f6a5c0]" />
          <span className="font-mono text-[16px] font-extrabold tracking-[0.02em]">
            SHAMANTH
          </span>
        </Link>
        <Link
          href="/#contact"
          className="flex items-center gap-2 rounded-full border-[1.5px] border-[#141414] bg-[#f7f6f2] px-4 py-[9px] font-mono text-[12px] font-bold tracking-[0.04em]"
        >
          <Heart aria-hidden="true" className="h-3 w-3" fill="#141414" />
          CONTACT
        </Link>
      </header>

      {/* ---- left: lost file window ---- */}
      <div className="hidden lg:block" aria-hidden="true">
        <BrowserWindow
          className="left-[6%] top-[31%]"
          style={{ transform: "rotate(-10deg)" }}
        >
          <PixelArt rows={SAD_FILE} cell={7} className="rotate-[8deg]" />
        </BrowserWindow>
        <Tag
          label="LOST FILE.JPG"
          color="#f8e27a"
          rotate={-4}
          className="left-[7%] top-[56.5%]"
        />
        <PixelPlus className="absolute left-[28%] top-[22.5%]" />
        <PixelPlus className="absolute left-[24.5%] top-[79%] scale-[0.95]" />
      </div>

      {/* ---- right: offline window ---- */}
      <div className="hidden lg:block" aria-hidden="true">
        <BrowserWindow
          className="right-[4%] top-[29%]"
          style={{ transform: "rotate(14deg)" }}
        >
          <div className="flex items-end gap-10 pt-6">
            <PixelArt rows={DINO} cell={4} />
            <PixelArt rows={CACTUS} cell={4} />
          </div>
        </BrowserWindow>
        <Tag
          label="OFFLINE.EXE"
          color="#f6a5c0"
          rotate={10}
          className="right-[5.5%] top-[33%]"
        />

        <PixelPlus className="absolute right-[20%] top-[66%] scale-[0.8]" />

        <p className="absolute bottom-[8%] right-[2%] m-0 font-mono text-[13px] leading-[1.7] tracking-[0.06em] text-black/55">
          MAYBE TRY
          <br />A DIFFERENT PATH...
        </p>
      </div>

      {/* ---- center content ---- */}
      <div className="relative z-10 flex max-w-[640px] flex-col items-center text-center">
        <h1
          className="m-0 font-[family-name:var(--font-jersey-15)] text-[clamp(150px,27vw,330px)] leading-[0.82] tracking-[-0.02em]"
          style={{ WebkitTextStroke: "5px #141414" }}
        >
          404
        </h1>

        <h2
          className="m-0 mt-5 font-[family-name:var(--font-jersey-15)] text-[clamp(44px,6vw,72px)] leading-none tracking-[0.02em]"
          style={{ WebkitTextStroke: "2px #141414" }}
        >
          PAGE NOT FOUND
        </h2>

        <p className="m-0 mt-5 max-w-[600px] font-mono text-[17px] leading-[1.5] tracking-[0.04em]">
          Looks like you’ve wandered into a part of the internet that doesn’t
          exist.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
          {/* primary */}
          <Link
            href="/"
            className="flex h-[66px] items-center gap-4 bg-[#141414] px-[50px] font-mono text-[17px] font-semibold tracking-[0.06em] text-[#f7f6f2] transition-transform duration-150 hover:-translate-y-[2px]"
            style={NOTCH_STYLE}
          >
            <ArrowLeft aria-hidden="true" className="h-5 w-5" />
            GO HOME
          </Link>

        </div>
      </div>
    </main>
  );
}
