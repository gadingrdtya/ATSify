import React from 'react';
import { Lightbulb, ArrowRight, Copy } from 'lucide-react';

export default function ActionableFeedback({ tips, bullets }) {
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="card-solid flex flex-col gap-4">
      <h3 className="text-lg font-bold border-b-2 border-border pb-2 flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-accent" />
        Actionable Feedback
      </h3>

      {tips && tips.length > 0 && (
        <ul className="text-sm space-y-2 mb-4">
          {tips.map((tip, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-accent font-bold">•</span>
              <span className="font-medium text-text-primary/90">{tip}</span>
            </li>
          ))}
        </ul>
      )}

      {bullets && bullets.length > 0 && (
        <div className="flex flex-col gap-4">
          <h4 className="font-semibold text-sm">Bullet Point Rewrites</h4>
          {bullets.map((b, i) => (
            <div key={i} className="border-2 border-border rounded-md bg-background overflow-hidden">
              <div className="p-3 border-b-2 border-border bg-surface/50">
                <span className="text-xs font-bold text-text-secondary uppercase mb-1 block">Original</span>
                <p className="text-sm line-through text-text-secondary">{b.original}</p>
              </div>
              <div className="p-3 bg-primary/5">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-bold text-primary uppercase flex items-center gap-1">
                    <ArrowRight className="w-3 h-3" /> AI Suggestion
                  </span>
                </div>
                <p className="text-sm font-semibold">{b.enhanced}</p>
                <div className="mt-3 flex justify-end">
                  <button 
                    onClick={() => handleCopy(b.enhanced)}
                    className="flex items-center gap-1 text-xs font-bold bg-surface border-2 border-border px-3 py-1 rounded-md shadow-solid-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all active:bg-primary active:text-surface"
                  >
                    <Copy className="w-3 h-3" /> Apply Rewrite
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
