import React, { useState, useEffect, useRef } from 'react';
import { Maximize2, Minimize2, Upload, PenTool, Eraser, Trash2, Image as ImageIcon } from 'lucide-react';
import type { Slide, Stroke, Point } from '../types';
import { presetSlides } from './PresetSlides';
import clsx from 'clsx';

interface SlidePanelProps {
  isMaximized: boolean;
  onToggleMaximize: () => void;
}

export const SlidePanel: React.FC<SlidePanelProps> = ({ isMaximized, onToggleMaximize }) => {
  const [slides, setSlides] = useState<Slide[]>(() => {
    const saved = localStorage.getItem('physics-slides');
    return saved ? JSON.parse(saved) : presetSlides;
  });

  const [currentSlideId, setCurrentSlideId] = useState<string>(() => {
    return localStorage.getItem('physics-current-slide') || presetSlides[0].id;
  });

  const [allStrokes, setAllStrokes] = useState<Record<string, Stroke[]>>(() => {
    const saved = localStorage.getItem('physics-strokes');
    return saved ? JSON.parse(saved) : {};
  });

  const [currentTool, setCurrentTool] = useState<'pen' | 'eraser'>('pen');
  const [brushSize] = useState<number>(4);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('physics-slides', JSON.stringify(slides));
  }, [slides]);

  useEffect(() => {
    localStorage.setItem('physics-current-slide', currentSlideId);
  }, [currentSlideId]);

  useEffect(() => {
    localStorage.setItem('physics-strokes', JSON.stringify(allStrokes));
  }, [allStrokes]);

  const currentSlide = slides.find(s => s.id === currentSlideId) || slides[0];
  const strokesForSlide = allStrokes[currentSlideId] || [];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const newSlide: Slide = {
        id: `slide-upload-${Date.now()}`,
        name: file.name,
        imageUrl: dataUrl,
        type: 'upload'
      };

      setSlides(prev => [...prev, newSlide]);
      setCurrentSlideId(newSlide.id);
    };
    reader.readAsDataURL(file);
  };

  // Canvas Drawing Logic
  const getCoordinates = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent): Point | null => {
    if (!canvasRef.current) return null;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    // Store as percentages (0.0 to 1.0) so it scales perfectly on resize
    return {
      x: (clientX - rect.left) / rect.width,
      y: (clientY - rect.top) / rect.height
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault(); // prevent scrolling on touch
    const point = getCoordinates(e);
    if (!point) return;

    setIsDrawing(true);
    setCurrentStroke({
      points: [point],
      color: '#ef4444', // Red default
      width: brushSize,
      isEraser: currentTool === 'eraser'
    });
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !currentStroke) return;
    e.preventDefault();

    const point = getCoordinates(e);
    if (!point) return;

    setCurrentStroke(prev => prev ? {
      ...prev,
      points: [...prev.points, point]
    } : null);
  };

  const stopDrawing = () => {
    if (!isDrawing || !currentStroke || currentStroke.points.length === 0) return;

    setIsDrawing(false);
    setAllStrokes(prev => ({
      ...prev,
      [currentSlideId]: [...(prev[currentSlideId] || []), currentStroke]
    }));
    setCurrentStroke(null);
  };

  const clearCanvas = () => {
    if (confirm('Clear all drawings on this slide?')) {
      setAllStrokes(prev => ({
        ...prev,
        [currentSlideId]: []
      }));
    }
  };

  // Render canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      // Setup canvas dimensions to match display size for 1:1 pixel mapping
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const drawStroke = (stroke: Stroke) => {
        if (stroke.points.length < 2) return;

        ctx.beginPath();
        ctx.strokeStyle = stroke.color;
        // Scale brush size slightly relative to canvas width for consistency, or keep absolute
        ctx.lineWidth = stroke.width;

        if (stroke.isEraser) {
           ctx.globalCompositeOperation = 'destination-out';
           ctx.lineWidth = stroke.width * 4; // Eraser is bigger
        } else {
           ctx.globalCompositeOperation = 'source-over';
        }

        ctx.moveTo(stroke.points[0].x * canvas.width, stroke.points[0].y * canvas.height);
        for (let i = 1; i < stroke.points.length; i++) {
          ctx.lineTo(stroke.points[i].x * canvas.width, stroke.points[i].y * canvas.height);
        }
        ctx.stroke();
      };

      strokesForSlide.forEach(drawStroke);
      if (currentStroke) drawStroke(currentStroke);
    };

    render();

    // Use ResizeObserver to trigger re-render on container resize
    const observer = new ResizeObserver(() => {
        render();
    });

    if (containerRef.current) {
        observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [strokesForSlide, currentStroke, currentSlideId]);

  return (
    <div className="glass-panel flex flex-col h-[calc(100vh-2rem)] relative overflow-hidden transition-all duration-300">
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
            <ImageIcon size={18} className="text-indigo-400" />
          </div>
          <h2 className="text-lg font-semibold tracking-wide">Whiteboard Presentation</h2>
        </div>
        <button
          onClick={onToggleMaximize}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-white"
          title={isMaximized ? "Minimize" : "Maximize"}
        >
          {isMaximized ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </button>
      </div>

      <div className="p-4 flex gap-4 bg-black/10 z-10 border-b border-white/5 items-end flex-wrap">
        <div className="flex-[2] flex flex-col gap-2 min-w-[200px]">
          <label className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">Select Slide</label>
          <select
            value={currentSlideId}
            onChange={(e) => setCurrentSlideId(e.target.value)}
            className="glass-input w-full appearance-none bg-slate-900/80 cursor-pointer"
          >
            {slides.map(slide => (
              <option key={slide.id} value={slide.id}>
                {slide.type === 'preset' ? '📌 ' : '📄 '} {slide.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 flex flex-col gap-2 min-w-[150px]">
           <label className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">Upload Images</label>
           <label className="glass-button bg-indigo-600/20 hover:bg-indigo-600/30 border-indigo-500/30 text-indigo-300 cursor-pointer w-full">
              <Upload size={16} />
              <span>Upload PDF (Image)</span>
              <input
                type="file"
                accept="image/png, image/jpeg"
                className="hidden"
                onChange={handleFileUpload}
              />
           </label>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/60 border border-white/10 rounded-lg p-1 ml-auto">
           <button
             onClick={() => setCurrentTool('pen')}
             className={clsx("p-2 rounded transition-colors", currentTool === 'pen' ? "bg-indigo-600 text-white" : "text-zinc-400 hover:text-white hover:bg-white/10")}
             title="Red Pen"
           >
             <PenTool size={18} />
           </button>
           <button
             onClick={() => setCurrentTool('eraser')}
             className={clsx("p-2 rounded transition-colors", currentTool === 'eraser' ? "bg-amber-500 text-white" : "text-zinc-400 hover:text-white hover:bg-white/10")}
             title="Eraser"
           >
             <Eraser size={18} />
           </button>
           <div className="w-px h-6 bg-white/10 mx-1"></div>
           <button
             onClick={clearCanvas}
             className="p-2 rounded text-zinc-400 hover:text-red-400 hover:bg-white/10 transition-colors"
             title="Clear Drawings"
           >
             <Trash2 size={18} />
           </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex-1 relative bg-zinc-950/80 flex items-center justify-center overflow-hidden"
      >
         {/* Background Image / SVG */}
         <img
           src={currentSlide.imageUrl}
           alt={currentSlide.name}
           className="absolute w-full h-full object-contain pointer-events-none opacity-90"
         />

         {/* Drawing Canvas overlay */}
         <canvas
            ref={canvasRef}
            className={clsx(
              "absolute inset-0 w-full h-full touch-none",
              currentTool === 'eraser' ? "cursor-crosshair" : "cursor-default" // Use custom cursor if desired
            )}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
         />
      </div>
    </div>
  );
};
