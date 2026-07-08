import React, { useState } from 'react';
import { Search, History, Type } from 'lucide-react';
import type { GeneratedContent } from '../types';

interface HeaderProps {
  onGenerate: (topic: string) => void;
  isLoading: boolean;
  history: GeneratedContent[];
  onSelectHistory: (id: string) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onGenerate,
  isLoading,
  history,
  onSelectHistory,
  fontSize,
  setFontSize
}) => {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim() && !isLoading) {
      onGenerate(topic);
    }
  };

  return (
    <div className="glass-panel p-4 flex flex-col md:flex-row gap-4 items-center justify-between sticky top-0 z-50">

      {/* Search Input */}
      <form onSubmit={handleSubmit} className="flex-1 w-full flex gap-2 relative">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a physics topic (e.g. 'Why is dot product maximum at 0?')"
          className="glass-input w-full pl-10 py-3 text-lg"
          disabled={isLoading}
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
        <button
          type="submit"
          disabled={!topic.trim() || isLoading}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-lg"
        >
          {isLoading ? 'Generating...' : 'Generate'}
        </button>
      </form>

      {/* Controls */}
      <div className="flex gap-4 w-full md:w-auto">

        {/* History Dropdown */}
        <div className="relative flex-1 md:w-48 flex items-center bg-slate-900/60 border border-white/10 rounded-lg px-3">
          <History size={16} className="text-zinc-400 mr-2" />
          <select
            className="bg-transparent text-white w-full py-3 focus:outline-none appearance-none cursor-pointer text-sm"
            onChange={(e) => {
                if(e.target.value) onSelectHistory(e.target.value);
            }}
            defaultValue=""
          >
            <option value="" disabled>Saved Simulations</option>
            {history.map(item => (
              <option key={item.id} value={item.id} className="bg-slate-900">
                {item.topic}
              </option>
            ))}
          </select>
        </div>

        {/* Font Size Dropdown */}
        <div className="relative flex-1 md:w-32 flex items-center bg-slate-900/60 border border-white/10 rounded-lg px-3">
          <Type size={16} className="text-zinc-400 mr-2" />
          <select
            className="bg-transparent text-white w-full py-3 focus:outline-none appearance-none cursor-pointer text-sm"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
          >
            <option value={1} className="bg-slate-900">100%</option>
            <option value={1.25} className="bg-slate-900">125%</option>
            <option value={1.5} className="bg-slate-900">150%</option>
            <option value={1.75} className="bg-slate-900">175%</option>
            <option value={2} className="bg-slate-900">200%</option>
          </select>
        </div>

      </div>
    </div>
  );
};
