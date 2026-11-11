export default function Logo({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <rect width="40" height="40" rx="11" fill="var(--teal-700)" />
      <path
        d="M10 28 C16 28 16 12 22 12 S28 22 31 14"
        stroke="var(--amber-400)"
        strokeWidth="3.4"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="31" cy="14" r="3" fill="#fff" />
    </svg>
  );
}
