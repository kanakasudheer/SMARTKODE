import React from 'react';

const ProgressBar = ({ value, max, label, color = 'blue' }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{`${value} / ${max}`}</span>
        </div>
      )}
      <div className="w-full bg-slate-200 rounded-full h-3.5 dark:bg-slate-700 overflow-hidden shadow-inner">
        <div
          className={`bg-${color}-500 h-3.5 rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
