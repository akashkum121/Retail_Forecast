import React from 'react';

function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const sizeMap = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`${sizeMap[size]} relative`}>
        <div className="absolute inset-0 rounded-full border-2 border-gray-200"></div>
        <div className="absolute inset-0 rounded-full border-2 border-primary-600 border-t-transparent animate-spin"></div>
      </div>
      {text && <p className="text-sm text-gray-500 animate-pulse">{text}</p>}
    </div>
  );
}

export default LoadingSpinner;
