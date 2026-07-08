import React, { useState, useEffect } from 'react';
import { Maximize2, Minimize2, Plus, AlertCircle, Link } from 'lucide-react';
import type { Simulation } from '../types';

interface SimulationPanelProps {
  isMaximized: boolean;
  onToggleMaximize: () => void;
}

const defaultSimulations: Simulation[] = [
  { id: 'sim-1', name: 'Forces and Motion', url: 'https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_en.html' },
  { id: 'sim-2', name: 'Projectile Motion', url: 'https://phet.colorado.edu/sims/html/projectile-motion/latest/projectile-motion_en.html' },
  { id: 'sim-3', name: 'Energy Skate Park', url: 'https://phet.colorado.edu/sims/html/energy-skate-park-basics/latest/energy-skate-park-basics_en.html' },
  { id: 'sim-4', name: 'Pendulum Lab', url: 'https://phet.colorado.edu/sims/html/pendulum-lab/latest/pendulum-lab_en.html' },
  { id: 'sim-5', name: 'Bending Light', url: 'https://phet.colorado.edu/sims/html/bending-light/latest/bending-light_en.html' },
  { id: 'sim-6', name: 'Balancing Act', url: 'https://phet.colorado.edu/sims/html/balancing-act/latest/balancing-act_en.html' },
];

export const SimulationPanel: React.FC<SimulationPanelProps> = ({ isMaximized, onToggleMaximize }) => {
  const [simulations, setSimulations] = useState<Simulation[]>(() => {
    const saved = localStorage.getItem('physics-simulations');
    return saved ? JSON.parse(saved) : defaultSimulations;
  });

  const [currentSimId, setCurrentSimId] = useState<string>(() => {
    return localStorage.getItem('physics-current-sim') || defaultSimulations[0].id;
  });

  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [iframeError, setIframeError] = useState(false);

  useEffect(() => {
    localStorage.setItem('physics-simulations', JSON.stringify(simulations));
  }, [simulations]);

  useEffect(() => {
    localStorage.setItem('physics-current-sim', currentSimId);
    setIframeError(false); // Reset error state on change
  }, [currentSimId]);

  const currentSim = simulations.find(s => s.id === currentSimId) || simulations[0];

  const handleAddSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newUrl.trim()) return;

    const newSim: Simulation = {
      id: `sim-custom-${Date.now()}`,
      name: newName,
      url: newUrl
    };

    setSimulations(prev => [...prev, newSim]);
    setCurrentSimId(newSim.id);
    setNewName('');
    setNewUrl('');
  };

  return (
    <div className="glass-panel flex flex-col h-[calc(100vh-2rem)] relative overflow-hidden transition-all duration-300">
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center border border-teal-500/30">
            <Link size={18} className="text-teal-400" />
          </div>
          <h2 className="text-lg font-semibold tracking-wide">Simulation Lab</h2>
        </div>
        <button
          onClick={onToggleMaximize}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-white"
          title={isMaximized ? "Minimize" : "Maximize"}
        >
          {isMaximized ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </button>
      </div>

      <div className="p-4 flex flex-col gap-4 bg-black/10 z-10 border-b border-white/5">
        <div className="flex flex-col gap-2">
          <label className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">Select Simulation Model</label>
          <select
            value={currentSimId}
            onChange={(e) => setCurrentSimId(e.target.value)}
            className="glass-input w-full appearance-none bg-slate-900/80 cursor-pointer"
          >
            {simulations.map(sim => (
              <option key={sim.id} value={sim.id}>{sim.name}</option>
            ))}
          </select>
        </div>

        <form onSubmit={handleAddSimulation} className="flex gap-2 items-end">
          <div className="flex-1 flex flex-col gap-2">
            <input
              type="text"
              placeholder="Sim Name"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              className="glass-input text-sm py-1.5"
            />
          </div>
          <div className="flex-[2] flex flex-col gap-2">
            <input
              type="url"
              placeholder="Load Simulation URL (e.g. PhET embed)"
              value={newUrl}
              onChange={e => setNewUrl(e.target.value)}
              className="glass-input text-sm py-1.5"
            />
          </div>
          <button
            type="submit"
            disabled={!newName || !newUrl}
            className="glass-button bg-teal-500/20 hover:bg-teal-500/30 border-teal-500/30 text-teal-300 py-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={16} />
          </button>
        </form>
      </div>

      <div className="flex-1 relative bg-zinc-950/50">
        {iframeError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-zinc-400">
            <AlertCircle size={48} className="text-amber-500 mb-4 opacity-80" />
            <h3 className="text-xl font-medium text-zinc-200 mb-2">Connection Blocked</h3>
            <p className="max-w-md">
              This website refuses to be embedded (X-Frame-Options restriction).
              Try finding an "embed" specific URL, or use a simulation platform that supports iframes like PhET.
            </p>
            <div className="mt-4 p-3 bg-white/5 rounded-lg text-sm font-mono border border-white/10 break-all">
              {currentSim.url}
            </div>
            <a
              href={currentSim.url}
              target="_blank"
              rel="noreferrer"
              className="mt-6 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
            >
              Open in New Tab Instead
            </a>
          </div>
        ) : (
          <iframe
            key={currentSim.id}
            src={currentSim.url}
            className="absolute inset-0 w-full h-full border-0"
            allowFullScreen
            title={currentSim.name}
            onError={() => setIframeError(true)}
            // Sandbox attributes to prevent malicious behavior while allowing necessary features
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        )}
      </div>
    </div>
  );
};
