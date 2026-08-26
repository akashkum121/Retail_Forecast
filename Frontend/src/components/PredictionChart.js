import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine,
} from 'recharts';

function PredictionChart({ data, showLastN = 10 }) {
  // Keep only last N predictions for performance
  const chartData = useMemo(() => {
    return data.slice(-showLastN);
  }, [data, showLastN]);

  // Calculate average for reference line
  const avgValue = useMemo(() => {
    if (chartData.length === 0) return 0;
    return chartData.reduce((sum, d) => sum + d.predicted, 0) / chartData.length;
  }, [chartData]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-3">
          <p className="text-xs text-gray-500 mb-1">{label}</p>
          <p className="text-lg font-bold text-primary-600">
            {payload[0].value} <span className="text-sm font-normal text-gray-500">units</span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-xl border border-dashed border-gray-300">
        <div className="text-center">
          <p className="text-gray-400 text-sm">No predictions yet</p>
          <p className="text-gray-300 text-xs mt-1">Submit a forecast to see data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Prediction History</h3>
          <p className="text-sm text-gray-500">Live updating forecast timeline</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Live
          </span>
          <span className="text-xs text-gray-400">
            {chartData.length} / {showLastN} shown
          </span>
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrediction" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis 
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={false}
              domain={['dataMin - 5', 'dataMax + 5']}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={avgValue} stroke="#94a3b8" strokeDasharray="5 5" strokeOpacity={0.5} />
            <Area
              type="monotone"
              dataKey="predicted"
              stroke="#3b82f6"
              strokeWidth={3}
              fill="url(#colorPrediction)"
              animationDuration={800}
              animationEasing="ease-in-out"
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4, stroke: '#fff' }}
              activeDot={{ r: 6, fill: '#2563eb', stroke: '#fff', strokeWidth: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default PredictionChart;
