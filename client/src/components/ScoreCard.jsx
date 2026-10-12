import React from 'react';

export default function ScoreCard({ score, message, targetRole }) {
  // Determine color based on score
  const isGood = score >= 85;
  const isWarn = score >= 60 && score < 85;
  const colorClass = isGood ? 'text-success border-success' : isWarn ? 'text-accent border-accent' : 'text-error border-error';

  return (
    <div className="card-solid flex flex-col items-center text-center gap-2">
      <div className="text-xs font-bold uppercase tracking-wider text-text-secondary bg-background px-3 py-1 rounded-full border border-border">
        Target: {targetRole}
      </div>
      
      <div className="mt-4 relative">
        <svg className="w-32 h-32 transform -rotate-90">
          <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-border/10" />
          <circle 
            cx="64" cy="64" r="56" 
            stroke="currentColor" 
            strokeWidth="8" 
            fill="transparent" 
            strokeDasharray="351.8" 
            strokeDashoffset={351.8 - (351.8 * score) / 100}
            className={`${colorClass} transition-all duration-1000 ease-out`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl font-extrabold font-mono tracking-tighter">{score}</span>
        </div>
      </div>
      
      <h3 className="text-lg font-bold mt-2">ATS Match Score</h3>
      <p className="text-sm font-medium text-text-secondary">{message}</p>
    </div>
  );
}
