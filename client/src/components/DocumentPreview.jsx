import React from 'react';
import { Sparkles } from 'lucide-react';

export default function DocumentPreview({ rawResume, critique }) {
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Document Preview</h2>
        <div className="flex items-center gap-2 text-sm font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent">
          <Sparkles className="w-4 h-4" />
          AI Analysis Complete
        </div>
      </div>
      
      <div className="card-solid flex-1 bg-surface relative overflow-hidden min-h-[500px] whitespace-pre-wrap text-sm text-text-primary/90 p-8 border-x-4 border-y-[1px] lg:border-y-4">
        <div className="absolute top-0 right-0 p-4 w-64 bg-accent/10 border-l-2 border-b-2 border-border shadow-solid-sm text-xs font-semibold">
          <span className="block text-accent mb-1 font-bold">AI Critique:</span>
          {critique}
        </div>
        
        {/* Simple visual representation of text. We can highlight some portions randomly or simply display the text. */}
        <div className="mt-8 relative z-10 font-mono text-sm leading-relaxed max-w-prose">
          {rawResume.split('\n').map((line, i) => {
            // Pseudo highlighting effect for visual demonstration
            if (line.length > 50 && i % 3 === 0) {
              return (
                <span key={i} className="bg-accent/20 border-b-2 border-accent relative group inline-block my-1">
                  {line}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface border-2 border-border shadow-solid-sm px-2 py-1 text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
                    AI Rewrite Available
                  </div>
                </span>
              );
            }
            return <p key={i} className="my-1">{line}</p>;
          })}
        </div>
      </div>
    </div>
  );
}
