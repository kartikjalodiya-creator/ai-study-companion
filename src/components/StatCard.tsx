import { GlassCard } from "./GlassCard";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  change?: string;
  delay?: number;
  iconColor?: string;
}

export function StatCard({ icon: Icon, label, value, change, delay = 0, iconColor = "text-primary" }: StatCardProps) {
  return (
    <GlassCard delay={delay} className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center ${iconColor}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-display font-bold text-foreground">{value}</p>
        {change && <p className="text-xs text-success">{change}</p>}
      </div>
    </GlassCard>
  );
}
