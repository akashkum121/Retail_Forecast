import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

function KPICard({ title, value, subtitle, icon: Icon, color = 'blue', trend = null }) {
  const colorMap = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: 'text-blue-600', light: 'bg-blue-100' },
    green: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', icon: 'text-emerald-600', light: 'bg-emerald-100' },
    amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: 'text-amber-600', light: 'bg-amber-100' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', icon: 'text-purple-600', light: 'bg-purple-100' },
    rose: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', icon: 'text-rose-600', light: 'bg-rose-100' },
    cyan: { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700', icon: 'text-cyan-600', light: 'bg-cyan-100' },
  };

  const c = colorMap[color] || colorMap.blue;

  return (
    <div className={`${c.bg} border ${c.border} rounded-xl p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">{title}</p>
          <p className={`text-2xl font-bold ${c.text}`}>{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          {trend !== null && (
            <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${trend >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {trend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        <div className={`${c.light} p-3 rounded-xl`}>
          <Icon className={`w-6 h-6 ${c.icon}`} />
        </div>
      </div>
    </div>
  );
}

export default KPICard;
