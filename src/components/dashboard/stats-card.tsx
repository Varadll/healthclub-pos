interface StatsCardProps {
  label: string;
  value: string | number;
  icon: string;
  trend?: { value: string; positive: boolean };
  subtitle?: string;
}

export default function StatsCard({ label, value, icon, trend, subtitle }: StatsCardProps) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-charcoal/40 backdrop-blur-sm p-6 transition-all duration-200 hover:border-gold/20 hover:shadow-[0_0_30px_-10px_rgba(201,168,76,0.08)]">
      <div className="flex items-start justify-between mb-4">
        <span className="text-[12px] font-body text-white/40 uppercase tracking-[0.12em]">
          {label}
        </span>
        <span className="text-lg opacity-40">{icon}</span>
      </div>
      <p className="text-[32px] font-heading font-semibold text-white leading-none mb-1">
        {value}
      </p>
      {trend && (
        <span className={`text-[12px] font-medium ${trend.positive ? 'text-health-green' : 'text-health-red'}`}>
          {trend.positive ? '↑' : '↓'} {trend.value}
        </span>
      )}
      {subtitle && !trend && (
        <span className="text-[12px] text-white/30">{subtitle}</span>
      )}
    </div>
  );
}
