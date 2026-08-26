import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from 'recharts';
import {
  TrendingDown,
  Calendar,
  DollarSign,
  Percent,
  Sparkles
} from 'lucide-react';

function PredictionInsights({ prediction }) {
  const [activeTab, setActiveTab] = useState('price');

  // Fallback scenario generator in case data is from simulation or old backend version
  const scenarios = useMemo(() => {
    if (prediction?.scenarios) {
      return prediction.scenarios;
    }

    // Generate simulated scenarios dynamically based on current prediction
    const baseQty = prediction?.predicted_quantity || 15;
    const basePrice = 10.0; // dummy default

    // 1. Price sensitivity
    const price_sensitivity = [
      { label: '50%', price: basePrice * 0.5, predicted_quantity: Math.round(baseQty * 1.5) },
      { label: '75%', price: basePrice * 0.75, predicted_quantity: Math.round(baseQty * 1.25) },
      { label: '100%', price: basePrice * 1.0, predicted_quantity: baseQty },
      { label: '125%', price: basePrice * 1.25, predicted_quantity: Math.max(0, Math.round(baseQty * 0.75)) },
      { label: '150%', price: basePrice * 1.5, predicted_quantity: Math.max(0, Math.round(baseQty * 0.5)) }
    ];

    // 2. Day of Week
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const day_of_week = days.map((day, idx) => {
      // Create a wave pattern
      const multiplier = 0.8 + Math.sin(idx * 1.2) * 0.3;
      return {
        day,
        predicted_quantity: Math.max(0, Math.round(baseQty * multiplier))
      };
    });

    // 3. Monthly Seasonality
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthly_seasonality = months.map((month, idx) => {
      // Create a seasonal curve (higher in summer/winter holidays)
      const multiplier = 0.9 + Math.cos((idx - 6) * 0.5) * 0.3;
      return {
        month,
        predicted_quantity: Math.max(0, Math.round(baseQty * multiplier))
      };
    });

    // 4. Promotion Impact
    const promotion_impact = {
      no_promo: Math.round(baseQty * 0.85),
      promo: Math.round(baseQty * 1.35)
    };

    return {
      price_sensitivity,
      day_of_week,
      monthly_seasonality,
      promotion_impact
    };
  }, [prediction]);

  if (!prediction) {
    return (
      <div className="card flex flex-col items-center justify-center min-h-[300px] border-dashed border-2 border-gray-200">
        <Sparkles className="w-10 h-10 text-gray-300 mb-3 animate-pulse" />
        <p className="text-gray-400 text-sm">Waiting for prediction insights</p>
        <p className="text-gray-300 text-xs mt-1">Dashboards will activate here automatically.</p>
      </div>
    );
  }

  const tabs = [
    { id: 'price', label: 'Price Elasticity', icon: DollarSign },
    { id: 'weekly', label: 'Weekly Patterns', icon: Calendar },
    { id: 'monthly', label: 'Seasonality', icon: Calendar },
    { id: 'promo', label: 'Promo Impact', icon: Percent },
  ];

  // Custom tooltips for nice UX
  const PriceTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-lg shadow-lg p-3">
          <p className="text-xs text-slate-500 font-medium">Price: £{payload[0].payload.price.toFixed(2)} ({payload[0].payload.label})</p>
          <p className="text-sm font-bold text-blue-600 mt-1">
            {payload[0].value} <span className="text-xs font-normal text-slate-400">units demand</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const BarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-lg shadow-lg p-3">
          <p className="text-xs text-slate-500 font-medium">{label}</p>
          <p className="text-sm font-bold text-indigo-600 mt-1">
            {payload[0].value} <span className="text-xs font-normal text-slate-400">predicted quantity</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card overflow-hidden transition-all duration-300 border border-slate-100 hover:shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            Forecast Scenarios & Insights
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Explore how demand reacts under alternate parameters</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-1 p-1 bg-slate-50 rounded-lg font-sans">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
                  active
                    ? 'bg-white text-indigo-600 shadow-sm border border-slate-100'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-indigo-600' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Contents */}
      <div className="pt-6 h-80 min-h-[300px]">
        {activeTab === 'price' && (
          <div className="h-full flex flex-col justify-between">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={scenarios.price_sensitivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis 
                    dataKey="label" 
                    tick={{ fontSize: 10, fill: '#64748b', fontWeight: '500' }}
                    tickLine={false}
                    axisLine={{ stroke: '#f1f5f9' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<PriceTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="predicted_quantity"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    fill="url(#colorPrice)"
                    dot={{ fill: '#6366f1', strokeWidth: 2, r: 4, stroke: '#fff' }}
                    activeDot={{ r: 6, fill: '#4f46e5', stroke: '#fff', strokeWidth: 3 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
              <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
              Standard demand curve behavior: higher unit prices lead to corresponding decay in order volumes.
            </p>
          </div>
        )}

        {activeTab === 'weekly' && (
          <div className="h-full flex flex-col justify-between">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scenarios.day_of_week} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fontSize: 10, fill: '#64748b', fontWeight: '500' }}
                    tickLine={false}
                    axisLine={{ stroke: '#f1f5f9' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<BarTooltip />} cursor={{ fill: '#f8fafc' }} />
                  <Bar
                    dataKey="predicted_quantity"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={45}
                  >
                    {scenarios.day_of_week.map((entry, idx) => (
                      <Cell 
                        key={`cell-${idx}`} 
                        fill={entry.predicted_quantity === Math.max(...scenarios.day_of_week.map(o => o.predicted_quantity)) ? '#4f46e5' : '#818cf8'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-slate-400 text-center">
              Weekly forecast distributions isolate the peak-demand days (darker bars) to plan fulfillment runs.
            </p>
          </div>
        )}

        {activeTab === 'monthly' && (
          <div className="h-full flex flex-col justify-between">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={scenarios.monthly_seasonality} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorMonth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 10, fill: '#64748b', fontWeight: '500' }}
                    tickLine={false}
                    axisLine={{ stroke: '#f1f5f9' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<BarTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="predicted_quantity"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fill="url(#colorMonth)"
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 3, stroke: '#fff' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-slate-400 text-center">
              Macro monthly seasonality maps supply adjustments for product categories based on calendar cyclicality.
            </p>
          </div>
        )}

        {activeTab === 'promo' && (
          <div className="h-full flex flex-col justify-center px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl mx-auto w-full">
              {/* No Promo Card */}
              <div className="p-5 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Regular Operations</span>
                  <h4 className="text-3xl font-black text-slate-700 mt-2">{scenarios.promotion_impact.no_promo} units</h4>
                  <p className="text-xs text-slate-500 mt-1">Expected baseline sales without active discount runs or loyalty campaigns.</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/50 text-[10px] text-slate-400 font-medium">
                  Baseline (100%)
                </div>
              </div>

              {/* Promo Active Card */}
              <div className="p-5 rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50/40 to-violet-50/20 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl">
                  RECOMMENDED RUN
                </div>
                <div>
                  <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">With Active Promotion</span>
                  <h4 className="text-3xl font-black text-indigo-600 mt-2">{scenarios.promotion_impact.promo} units</h4>
                  <p className="text-xs text-slate-500 mt-1">Boost demand through promotional campaigns, flash coupon codes, or targeted customer lists.</p>
                </div>
                <div className="mt-4 pt-3 border-t border-indigo-200/30 text-[10px] text-indigo-500 font-bold">
                  +{(((scenarios.promotion_impact.promo - scenarios.promotion_impact.no_promo) / scenarios.promotion_impact.no_promo) * 100).toFixed(0)}% Lift Expected
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 text-center mt-6">
              Assesses the efficiency of customer promotion flags on demand coefficients for this product group.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PredictionInsights;
