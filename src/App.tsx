import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SimulationPanel } from './components/SimulationPanel';
import { InfographicPanel } from './components/InfographicPanel';
import type { GeneratedContent } from './types';
import { generateContent } from './utils/mockApi';

function App() {
  const [history, setHistory] = useState<GeneratedContent[]>(() => {
    const saved = localStorage.getItem('physics-sim-history');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentContentId, setCurrentContentId] = useState<string | null>(() => {
    return localStorage.getItem('physics-sim-current') || null;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState(1);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('physics-sim-history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (currentContentId) {
      localStorage.setItem('physics-sim-current', currentContentId);
    }
  }, [currentContentId]);

  const currentContent = history.find(h => h.id === currentContentId) || null;

  const handleGenerate = async (topic: string) => {
    setIsLoading(true);
    try {
      const newContent = await generateContent(topic);
      setHistory(prev => [newContent, ...prev]);
      setCurrentContentId(newContent.id);
    } catch (error) {
      console.error("Failed to generate content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 flex flex-col gap-4 cosmic-bg relative">
      <Header
        onGenerate={handleGenerate}
        isLoading={isLoading}
        history={history}
        onSelectHistory={setCurrentContentId}
        fontSize={fontSizeMultiplier}
        setFontSize={setFontSizeMultiplier}
      />

      {/* Main Grid Workspace - 5/12 Left, 7/12 Right as per prompt */}
      <div className="flex flex-col md:flex-row gap-4 flex-1 overflow-hidden h-[calc(100vh-8rem)]">

        {/* Left Panel: Simulation (5/12) */}
        <div className="w-full md:w-5/12 h-full flex flex-col">
          <SimulationPanel
            simulationType={currentContent?.simulationType || 'unknown'}
          />
        </div>

        {/* Right Panel: Infographic (7/12) */}
        <div className="w-full md:w-7/12 h-full flex flex-col">
          <InfographicPanel
            data={currentContent?.infographic || null}
            fontSizeMultiplier={fontSizeMultiplier}
          />
        </div>

      </div>
    </div>
  );
}

export default App;
