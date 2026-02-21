export function GeometricPattern({ className }: { className?: string }) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden opacity-[0.04] ${className ?? ""}`}
      aria-hidden
    >
      <svg
        className="h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="hikmah-grid"
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 16h32M16 0v32"
              stroke="currentColor"
              strokeWidth="0.5"
            />
          </pattern>
          <pattern
            id="hikmah-stars"
            width="64"
            height="64"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M32 4L34 30L60 32L34 34L32 60L30 34L4 32L30 30L32 4Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.4"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hikmah-grid)" />
        <rect width="100%" height="100%" fill="url(#hikmah-stars)" />
      </svg>
    </div>
  );
}
