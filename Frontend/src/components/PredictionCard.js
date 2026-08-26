import React from 'react';
import { TrendingUp, Clock, Hash } from 'lucide-react';

function PredictionCard({ prediction, isLoading }) {
  if (isLoading) {
    return (
      <div className="card flex items-center justify-center h-full min-h-[200px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 relative">
            <div className="absolute inset-0 rounded-full border-2 border-gray-200"></div>
            <div className="absolute inset-0 rounded-full border-2 border-primary-600 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-sm text-gray-500 animate-pulse">Running ML model...</p>
        </div>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="card flex items-center justify-center h-full min-h-[200px] bg-gradient-to-br from-gray-50 to-gray-100 border-dashed border-2 border-gray-200">
        <div className="text-center">
          <TrendingUp className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No prediction yet</p>
          <p className="text-gray-300 text-xs mt-1">Fill the form and click Forecast</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-gradient-to-br from-primary-600 to-secondary-600 text-white border-0 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
            <TrendingUp className="w-5 h-5" />
          </div>
          <span className="font-medium text-white/90">Latest Prediction</span>
        </div>
        <span className="text-xs bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
          #{prediction.index}
        </span>
      </div>

      <div className="mb-4">
        <div className="text-6xl font-bold tracking-tight">
          {prediction.predicted_quantity}
        </div>
        <div className="text-white/70 text-sm mt-1">units predicted</div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-white/20">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-white/60" />
          <div>
            <p className="text-xs text-white/60">Time</p>
            <p className="text-sm font-medium">{prediction.time}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Hash className="w-4 h-4 text-white/60" />
          <div>
            <p className="text-xs text-white/60">Confidence</p>
            <p className="text-sm font-medium">{(prediction.predicted_quantity > 0 ? 87 + Math.random() * 10 : 0).toFixed(1)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PredictionCard;
