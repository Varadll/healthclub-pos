interface StatsCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
  accentColor?: "gold" | "success" | "danger" | "warning";
}

export function StatsCard({
  label,
  value,
  icon,
  trend,
  accentColor = "gold",
}: StatsCardProps) {
  const accentMap = {
    gold: "bg-gold/10 text-gold",
    success: "bg-success-bg text-success",
    danger: "bg-danger-bg text-danger",
    warning: "bg-warning-bg text-warning",
  };

  const trendColorMap = {
    true: "text-success",
    false: "text-danger",
  };

  return (
    <div className="bg-surface-raised border border-border rounded-md p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-11 h-11 rounded-md flex items-center justify-center ${accentMap[accentColor]}`}
        >
          {icon}
        </div>
        {trend && (
          <span
            className={`text-xs font-medium font-body ${
              trendColorMap[String(trend.positive) as "true" | "false"]
            }`}
          >
            {trend.positive ? "↑" : "↓"} {trend.value}
          </span>
        )}
      </div>
      <p className="font-display text-3xl text-charcoal stat-number">{value}</p>
      <p className="font-body text-sm text-charcoal/50 mt-1">{label}</p>
    </div>
  );
}
