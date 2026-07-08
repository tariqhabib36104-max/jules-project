import React from 'react';
import type { InfographicData } from '../types';

interface InfographicPanelProps {
  data: InfographicData | null;
  fontSizeMultiplier: number;
}

export const InfographicPanel: React.FC<InfographicPanelProps> = ({ data, fontSizeMultiplier }) => {
  if (!data) {
    return (
      <div className="glass-panel h-full flex items-center justify-center text-zinc-500 font-mono">
        Waiting for topic...
      </div>
    );
  }

  // Calculate base sizes based on multiplier
  const titleSize = `${2.5 * fontSizeMultiplier}rem`; // 40px base
  const h2Size = `${1.5 * fontSizeMultiplier}rem`; // 24px base
  const pSize = `${1 * fontSizeMultiplier}rem`; // 16px base
  const smallSize = `${0.875 * fontSizeMultiplier}rem`; // 14px base

  return (
    <div className="glass-panel h-full overflow-y-auto bg-slate-900/40 p-8 flex flex-col gap-8">

      {/* Header Section */}
      <div className="border-b border-indigo-500/30 pb-6">
        <span className="text-indigo-400 font-bold tracking-widest uppercase mb-2 block" style={{ fontSize: smallSize }}>
          {data.keyConcept}
        </span>
        <h1 className="font-extrabold text-white leading-tight" style={{ fontSize: titleSize }}>
          {data.title}
        </h1>
      </div>

      {/* Main Idea */}
      <div className="bg-white/5 rounded-xl p-6 border border-white/10 shadow-lg">
        <p className="font-medium text-zinc-200" style={{ fontSize: h2Size, lineHeight: '1.4' }}>
          {data.mainIdea}
        </p>
      </div>

      {/* Visual / Explanatory Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-teal-400 font-bold" style={{ fontSize: h2Size }}>How it works</h2>
          <p className="text-zinc-300" style={{ fontSize: pSize, lineHeight: '1.6' }}>
            {data.visualExplanation}
          </p>
        </div>

        {data.importantFormula && (
          <div className="flex flex-col gap-4 bg-teal-500/10 p-6 rounded-xl border border-teal-500/20 flex items-center justify-center">
             <span className="text-teal-500 font-mono font-bold tracking-wider" style={{ fontSize: `${1.5 * fontSizeMultiplier}rem` }}>
               {data.importantFormula}
             </span>
          </div>
        )}
      </div>

      {/* Summary Highlight */}
      <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 p-6 rounded-xl border border-indigo-500/30 text-center">
        <p className="font-bold text-white" style={{ fontSize: `${1.25 * fontSizeMultiplier}rem` }}>
          {data.oneLineSummary}
        </p>
      </div>

      {/* Footer Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-auto pt-6 border-t border-white/10">
        <div>
          <h3 className="text-amber-400 font-bold mb-2" style={{ fontSize: pSize }}>🔑 Key Takeaway</h3>
          <p className="text-zinc-400" style={{ fontSize: smallSize }}>{data.keyTakeaway}</p>
        </div>
        {data.realLifeExample && (
          <div>
            <h3 className="text-emerald-400 font-bold mb-2" style={{ fontSize: pSize }}>🌍 Real World</h3>
            <p className="text-zinc-400" style={{ fontSize: smallSize }}>{data.realLifeExample}</p>
          </div>
        )}
      </div>

      {data.doYouKnow && (
        <div className="text-center mt-4">
           <span className="text-purple-400 font-bold" style={{ fontSize: smallSize }}>💡 Did you know? </span>
           <span className="text-zinc-400 italic" style={{ fontSize: smallSize }}>{data.doYouKnow}</span>
        </div>
      )}

    </div>
  );
};
