interface TrainerStatsCardProps {
  label: string;
  value: string | number;
  icon: string;
  subtitle?: string;
  accentColor?: 'gold' | 'success' | 'danger' | 'default';
}

const ACCENT_STYLES = {
  gold: 'bg-gold/[0.08] text-gold border-gold/20',
  success: 'bg-success-bg text-success border-success/20',
  danger: 'bg-danger-bg text-danger border-danger/20',
  default: 'bg-charcoal/[0.04] text-charcoal/60 border-border',
};

export default function TrainerStatsCard({
  label,
  value,
  icon,
  subtitle,
  accentColor = 'default',
}: TrainerStatsCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface-raised p-5 shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="flex items-start justify-between mb-3">
        <span className="text-[11px] font-body font-medium text-charcoal/40 uppercase tracking-[0.12em]">
          {label}
        </span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm border ${ACCENT_STYLES[accentColor]}`}>
          {icon}
        </div>
      </div>
      <p className="text-[28px] font-display font-semibold text-charcoal leading-none mb-1 stat-number">
        {value}
      </p>
      {subtitle && (
        <span className="text-[12px] text-charcoal/40 font-body">{subtitle}</span>
      )}
    </div>
  );
}
