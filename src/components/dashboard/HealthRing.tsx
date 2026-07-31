interface HealthRingProps {
  score: number;
  size?: number;
  className?: string;
}

function colorForScore(score: number): string {
  if (score >= 80) return "#13ab67";
  if (score >= 50) return "#d97706";
  return "#dc2626";
}

export function HealthRing({ score, size = 40, className = "" }: HealthRingProps) {
  const strokeWidth = 3.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.max(0, Math.min(100, score)) / 100) * circumference;
  const color = colorForScore(score);

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e5e2e1" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.4s ease" }}
        />
      </svg>
      <span className="absolute font-label-sm text-on-surface" style={{ fontSize: size <= 32 ? "9px" : "11px" }}>
        {score}
      </span>
    </div>
  );
}
