export function HeroIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {/* Geometric frame */}
      <rect
        x="40"
        y="20"
        width="240"
        height="200"
        rx="12"
        stroke="#0d5c3d"
        strokeWidth="2"
        fill="none"
        opacity="0.3"
      />
      <path
        d="M160 40v160M40 120h240M100 40l60 80-60 80M220 40l-60 80 60 80"
        stroke="#166534"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
      />
      {/* Central motif: two arcs meeting (partnership / connection) */}
      <path
        d="M100 120c0-33 26.8-60 60-60s60 27 60 60"
        stroke="#0d5c3d"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M220 120c0 33-26.8 60-60 60s-60-27-60-60"
        stroke="#0d5c3d"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      {/* Small 8-point star above */}
      <path
        d="M160 75l2 12 12 2-12 2-2 12-2-12-12-2 12-2 2-12z"
        fill="#0d5c3d"
        opacity="0.8"
      />
    </svg>
  );
}
