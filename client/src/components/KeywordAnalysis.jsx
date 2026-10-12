import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function KeywordAnalysis({ matched, missing }) {
  return (
    <div className="card-solid flex flex-col gap-4">
      <h3 className="text-lg font-bold border-b-2 border-border pb-2">Keyword Analysis</h3>
      
      <div>
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 className="w-5 h-5 text-success" />
          <h4 className="font-semibold text-sm">Found Keywords</h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {matched.map((kw, i) => (
            <span key={i} className="pill bg-success/10 text-success border-success">
              {kw}
            </span>
          ))}
          {matched.length === 0 && <span className="text-xs text-text-secondary">None found.</span>}
        </div>
      </div>

      <div className="mt-2">
        <div className="flex items-center gap-2 mb-2">
          <XCircle className="w-5 h-5 text-error" />
          <h4 className="font-semibold text-sm">Missing Keywords</h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {missing.map((kw, i) => (
            <span key={i} className="pill bg-error/10 text-error border-error">
              {kw}
            </span>
          ))}
          {missing.length === 0 && <span className="text-xs text-text-secondary">All keywords present!</span>}
        </div>
      </div>
    </div>
  );
}
