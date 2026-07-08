import { useState } from 'react';
import { SimulationPanel } from './components/SimulationPanel';
import { SlidePanel } from './components/SlidePanel';
import { Lightbulb, RotateCcw } from 'lucide-react';
import clsx from 'clsx';

function App() {
  const [maximizedPanel, setMaximizedPanel] = useState<'left' | 'right' | null>(null);
  const [showDrawer, setShowDrawer] = useState(true);

  const resetWorkspace = () => {
    if (confirm('Are you sure you want to reset all slides, drawings, and simulations? This cannot be undone.')) {
      localStorage.removeItem('physics-slides');
      localStorage.removeItem('physics-current-slide');
      localStorage.removeItem('physics-strokes');
      localStorage.removeItem('physics-simulations');
      localStorage.removeItem('physics-current-sim');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen p-4 flex flex-col gap-4">
      {/* Main Grid Workspace */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 flex-1">

        {/* Left Panel (4/12) */}
        <div className={clsx(
          "transition-all duration-300",
          maximizedPanel === 'left' ? "md:col-span-12" : "md:col-span-4",
          maximizedPanel === 'right' ? "hidden md:hidden" : "block"
        )}>
          <SimulationPanel
            isMaximized={maximizedPanel === 'left'}
            onToggleMaximize={() => setMaximizedPanel(prev => prev === 'left' ? null : 'left')}
          />
        </div>

        {/* Right Panel (8/12) */}
        <div className={clsx(
          "transition-all duration-300",
          maximizedPanel === 'right' ? "md:col-span-12" : "md:col-span-8",
          maximizedPanel === 'left' ? "hidden md:hidden" : "block"
        )}>
          <SlidePanel
             isMaximized={maximizedPanel === 'right'}
             onToggleMaximize={() => setMaximizedPanel(prev => prev === 'right' ? null : 'right')}
          />
        </div>

      </div>

      {/* Teacher Action Bar / Footer */}
      <div className="glass-panel p-4 flex justify-between items-center bg-black/20 z-50">
        <div className="flex items-center gap-4">
           <button
             onClick={() => setShowDrawer(!showDrawer)}
             className={clsx("flex items-center gap-2 px-4 py-2 rounded-lg transition-colors border", showDrawer ? "bg-amber-500/20 border-amber-500/30 text-amber-300" : "bg-white/5 border-white/10 text-zinc-400 hover:text-white")}
           >
             <Lightbulb size={18} />
             <span className="font-medium text-sm">Teacher Guide</span>
           </button>

           {showDrawer && (
             <div className="text-sm text-zinc-300 flex items-center gap-2">
               <span className="px-2 py-1 bg-white/10 rounded font-mono text-xs text-amber-400 border border-white/10">Tip:</span>
               Use visual analogies instead of equations to explain complex concepts first.
             </div>
           )}
        </div>

        <button
          onClick={resetWorkspace}
          className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors border border-transparent hover:border-red-400/20"
        >
          <RotateCcw size={16} />
          Reset Workspace
        </button>
      </div>
    </div>
  );
}

export default App;
