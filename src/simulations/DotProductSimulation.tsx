import { useCallback, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';

export interface SimulationControls {
  play: () => void;
  pause: () => void;
  reset: () => void;
  setSpeed: (speed: number) => void;
}

interface DotProductSimulationProps {
  speedMultiplier?: number;
}

export const DotProductSimulation = forwardRef<SimulationControls, DotProductSimulationProps>(({ speedMultiplier = 1 }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const isPlaying = useRef<boolean>(true);
  const angleRef = useRef<number>(0);

  const drawArrow = useCallback((ctx: CanvasRenderingContext2D, fromx: number, fromy: number, tox: number, toy: number, color: string, width: number) => {
    const headlen = 10;
    const dx = tox - fromx;
    const dy = toy - fromy;
    const angle = Math.atan2(dy, dx);
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.stroke();
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.moveTo(tox, toy);
    ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
    ctx.fill();
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2 + 50;
    const lengthA = 150;
    const lengthB = 150;

    // Vector A (Fixed horizontal)
    const ax = cx + lengthA;
    const ay = cy;

    // Vector B (Rotating)
    const bx = cx + lengthB * Math.cos(angleRef.current);
    const by = cy - lengthB * Math.sin(angleRef.current);

    // Projection point on A
    const projX = cx + lengthB * Math.cos(angleRef.current);
    const projY = cy;

    // const dotProduct = lengthA * (lengthB * Math.cos(angleRef.current));
    const normalizedDot = Math.cos(angleRef.current);

    // Grid / Axis
    ctx.beginPath();
    ctx.strokeStyle = '#3f3f46';
    ctx.lineWidth = 1;
    ctx.moveTo(cx - 200, cy);
    ctx.lineTo(cx + 200, cy);
    ctx.moveTo(cx, cy - 200);
    ctx.lineTo(cx, cy + 200);
    ctx.stroke();

    // Draw Vector A (Base)
    drawArrow(ctx, cx, cy, ax, ay, '#14b8a6', 4);

    // Draw Projection (shadow)
    if (Math.abs(normalizedDot) > 0.01) {
        ctx.beginPath();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 6;
        ctx.moveTo(cx, cy);
        ctx.lineTo(projX, projY);
        ctx.stroke();
    }

    // Draw Dotted line for projection
    ctx.beginPath();
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = '#71717a';
    ctx.moveTo(bx, by);
    ctx.lineTo(projX, projY);
    ctx.stroke();
    ctx.setLineDash([]); // reset

    // Draw Vector B
    drawArrow(ctx, cx, cy, bx, by, '#4f46e5', 4);

    // Text Values
    ctx.fillStyle = '#e4e4e7';
    ctx.font = '16px "JetBrains Mono", monospace';
    ctx.fillText(`Angle: ${(angleRef.current * 180 / Math.PI).toFixed(0)}°`, 20, 30);
    ctx.fillText(`Dot Product: ${normalizedDot.toFixed(2)}`, 20, 50);

    // Visual Bar for Dot Product
    ctx.fillStyle = '#3f3f46';
    ctx.fillRect(20, 70, 200, 10);
    ctx.fillStyle = normalizedDot > 0 ? '#10b981' : '#ef4444';
    ctx.fillRect(120, 70, normalizedDot * 100, 10);
  }, [drawArrow]);

  const update = useCallback(() => {
    if (isPlaying.current) {
        angleRef.current += 0.01 * speedMultiplier;
        if (angleRef.current > Math.PI * 2) {
            angleRef.current = 0;
        }
    }
    draw();
    requestRef.current = requestAnimationFrame(update);
  }, [speedMultiplier, draw]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current);
  }, [update]);

  // Expose controls to parent
  useImperativeHandle(ref, () => ({
    play: () => { isPlaying.current = true; },
    pause: () => { isPlaying.current = false; },
    reset: () => { angleRef.current = 0; draw(); },
    setSpeed: () => {} // handled via prop currently, but could use ref
  }));

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={400}
      className="w-full h-full object-contain"
    />
  );
});
