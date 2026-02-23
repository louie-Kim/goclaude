interface BadgeProps {
  label: string;
  color?: string;
  className?: string;
}

export function Badge({ label, color = "#414868", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-foreground ${className}`}
      style={{ backgroundColor: color }}
    >
      {label}
    </span>
  );
}
