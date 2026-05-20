/**
 * StatsGrid — Dashboard için KPI kartları.
 */
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

export interface Stat {
  label: string;
  value: string | number;
  delta?: number;
  icon?: LucideIcon;
}

export function StatsGrid({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="rounded-lg border p-4 bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">{s.label}</p>
            {s.icon && <s.icon size={16} className="text-gray-400" />}
          </div>
          <p className="text-2xl font-semibold mt-1">{s.value}</p>
          {typeof s.delta === 'number' && (
            <p
              className={`text-xs mt-1 inline-flex items-center gap-1 ${
                s.delta >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {s.delta >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {s.delta >= 0 ? '+' : ''}
              {s.delta}%
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
