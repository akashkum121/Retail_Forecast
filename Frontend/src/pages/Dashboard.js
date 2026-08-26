import React, { useState, useEffect } from 'react';
import KPICard from '../components/KPICard';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  DollarSign, 
  ShoppingCart, 
  Trophy, 
  MapPin, 
  Brain, 
  TrendingUp,
  Activity
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

function Dashboard() {
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchKPIs();
    const interval = setInterval(fetchKPIs, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchKPIs = async () => {
    try {
      const res = await fetch(`${API_BASE}/kpis`);
      const data = await res.json();
      if (data.success) {
        setKpis(data.data);
        setError(null);
      }
    } catch (err) {
      setError('Failed to load KPIs. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-rose-500 text-lg mb-2">⚠️ {error}</div>
          <button onClick={fetchKPIs} className="btn-primary mt-4">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const kpiData = [
    {
      title: 'Total Revenue',
      value: `£${kpis?.total_revenue?.toLocaleString() || '0'}`,
      subtitle: 'Lifetime revenue',
      icon: DollarSign,
      color: 'green',
      trend: 12.5,
    },
    {
      title: 'Total Orders',
      value: kpis?.total_orders?.toLocaleString() || '0',
      subtitle: 'Orders processed',
      icon: ShoppingCart,
      color: 'blue',
      trend: 8.3,
    },
    {
      title: 'Top Product',
      value: kpis?.top_product || '-',
      subtitle: 'Best seller',
      icon: Trophy,
      color: 'amber',
    },
    {
      title: 'Top City',
      value: kpis?.top_city || '-',
      subtitle: 'Highest demand',
      icon: MapPin,
      color: 'purple',
    },
        {
      title: 'Model R² Score',
      // We multiply the decimal by 100 and add the % symbol
      value: kpis?.model_r2_score ? `${(kpis.model_r2_score * 100).toFixed(2)}%` : '0%',
      subtitle: 'Prediction accuracy',
      icon: Brain,
      color: 'cyan',
      trend: 2.1,
    },
    {
      title: 'Highest Sale',
      value: `£${kpis?.highest_sale_value?.toLocaleString() || '0'}`,
      subtitle: 'Single transaction',
      icon: TrendingUp,
      color: 'rose',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Real-time retail analytics overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {kpiData.map((kpi, idx) => (
          <KPICard key={idx} {...kpi} />
        ))}
      </div>

      {/* Activity Section */}
      <div className="mt-8 card">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-primary-600" />
          <h2 className="text-lg font-semibold text-gray-900">System Status</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-lg">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
            <div>
              <p className="text-sm font-medium text-emerald-800">Backend API</p>
              <p className="text-xs text-emerald-600">Running on port 5000</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
            <div>
              <p className="text-sm font-medium text-blue-800">ML Model</p>
              <p className="text-xs text-blue-600">RandomForestRegressor loaded</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
            <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse"></div>
            <div>
              <p className="text-sm font-medium text-purple-800">Frontend</p>
              <p className="text-xs text-purple-600">React + Recharts ready</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
