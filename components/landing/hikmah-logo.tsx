export function HikmahLogo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className ?? ""}`}>
      {/* Geometric mark: 8-pointed star (Rub el Hizb style) with inner square - Islamic geometric motif */}
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-12 w-12 shrink-0 text-[#0d5c3d]"
        aria-hidden
      >
        <path
          d="M24 4L26.5 21.5L44 24L26.5 26.5L24 44L21.5 26.5L4 24L21.5 21.5L24 4Z"
          fill="currentColor"
        />
        <path
          d="M24 12L25 20L32 21L25 22L24 36L23 22L16 21L23 20L24 12Z"
          fill="white"
          fillOpacity="0.9"
        />
      </svg>
      <div className="flex flex-col">
        <span className="text-xl font-bold tracking-tight text-[#0d5c3d] sm:text-2xl">
          Hikmah
        </span>
        <span className="text-sm font-medium tracking-wide text-[#166534] sm:text-base">
          Investors
        </span>
      </div>
    </div>
  );
}
