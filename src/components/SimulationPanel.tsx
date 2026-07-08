import React, { useRef, useState } from 'react';
import { Play, Pause, RotateCcw, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { DotProductSimulation } from '../simulations/DotProductSimulation';
import { PendulumSimulation } from '../simulations/PendulumSimulation';
import type { SimulationControls } from '../simulations/DotProductSimulation';

interface SimulationPanelProps {
  simulationType: 'dot-product' | 'pendulum' | 'unknown';
}

export const SimulationPanel: React.FC<SimulationPanelProps> = ({ simulationType }) => {
  const simRef = useRef<SimulationControls>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const togglePlay = () => {
    if (isPlaying) {
      simRef.current?.pause();
    } else {
      simRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const resetSim = () => {
    simRef.current?.reset();
    if (!isPlaying) {
      setIsPlaying(true);
      simRef.current?.play();
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="glass-panel flex flex-col h-full overflow-hidden" ref={containerRef}>
      <div className="flex-1 relative bg-zinc-950/80 flex items-center justify-center overflow-hidden">
        <div style={{ transform: `scale(${zoom})`, transition: 'transform 0.2s', width: '100%', height: '100%' }}>
          {simulationType === 'dot-product' && <DotProductSimulation ref={simRef} speedMultiplier={speed} />}
          {simulationType === 'pendulum' && <PendulumSimulation ref={simRef} speedMultiplier={speed} />}
          {simulationType === 'unknown' && (
            <div className="text-zinc-500 font-mono flex flex-col items-center">
              <span className="text-4xl mb-4">⚛️</span>
              <p>Enter a topic above to generate a simulation.</p>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-black/40 border-t border-white/10 p-3 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-2">
          <button onClick={togglePlay} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition">
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button onClick={resetSim} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition">
            <RotateCcw size={18} />
          </button>
        </div>

        <div className="flex items-center gap-2 flex-1 max-w-[200px]">
          <span className="text-xs text-zinc-400 font-mono">SPEED</span>
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="flex-1 accent-indigo-500"
          />
        </div>

        <div className="flex gap-2">
          <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-zinc-300 transition">
            <ZoomOut size={18} />
          </button>
          <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-zinc-300 transition">
            <ZoomIn size={18} />
          </button>
          <button onClick={toggleFullscreen} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-zinc-300 transition">
            <Maximize size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
