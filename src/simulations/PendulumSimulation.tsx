import { useCallback, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import type { SimulationControls } from './DotProductSimulation';

interface PendulumSimulationProps {
  speedMultiplier?: number;
}

export const PendulumSimulation = forwardRef<SimulationControls, PendulumSimulationProps>(({ speedMultiplier = 1 }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const isPlaying = useRef<boolean>(true);

  // Physics state
  const state = useRef({
      angle: Math.PI / 4, // Initial angle (45 deg)
      velocity: 0,
      acceleration: 0,
      length: 200,
      gravity: 0.5,
      originX: 0, // Set in draw
      originY: 50
  });

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const s = state.current;
    s.originX = canvas.width / 2;

    // Calculate bob position
    const bobX = s.originX + s.length * Math.sin(s.angle);
    const bobY = s.originY + s.length * Math.cos(s.angle);

    // Calculate energies (rough approximation for visual)
    const maxH = s.length * (1 - Math.cos(Math.PI/4));
    const currentH = s.length * (1 - Math.cos(s.angle));
    const potentialEnergy = currentH / maxH;
    const kineticEnergy = 1 - potentialEnergy;

    // Draw string
    ctx.beginPath();
    ctx.strokeStyle = '#a1a1aa';
    ctx.lineWidth = 2;
    ctx.moveTo(s.originX, s.originY);
    ctx.lineTo(bobX, bobY);
    ctx.stroke();

    // Draw Bob
    ctx.beginPath();
    ctx.arc(bobX, bobY, 20, 0, Math.PI * 2);
    ctx.fillStyle = '#4f46e5';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Energy Bars
    ctx.fillStyle = '#e4e4e7';
    ctx.font = '14px "JetBrains Mono", monospace';
    ctx.fillText('Kinetic Energy', 20, 30);
    ctx.fillStyle = '#3f3f46';
    ctx.fillRect(20, 40, 150, 10);
    ctx.fillStyle = '#10b981';
    ctx.fillRect(20, 40, 150 * Math.max(0, kineticEnergy), 10);

    ctx.fillStyle = '#e4e4e7';
    ctx.fillText('Potential Energy', 20, 70);
    ctx.fillStyle = '#3f3f46';
    ctx.fillRect(20, 80, 150, 10);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(20, 80, 150 * Math.max(0, potentialEnergy), 10);
  }, []);

  const update = useCallback(() => {
    if (isPlaying.current) {
        const s = state.current;
        // Basic pendulum physics
        s.acceleration = (-s.gravity / s.length) * Math.sin(s.angle);
        s.velocity += s.acceleration * speedMultiplier;

        // Add slight damping
        s.velocity *= 0.999;

        s.angle += s.velocity * speedMultiplier;
    }
    draw();
    requestRef.current = requestAnimationFrame(update);
  }, [speedMultiplier, draw]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current);
  }, [update]);

  useImperativeHandle(ref, () => ({
    play: () => { isPlaying.current = true; },
    pause: () => { isPlaying.current = false; },
    reset: () => {
        state.current.angle = Math.PI / 4;
        state.current.velocity = 0;
        draw();
    },
    setSpeed: () => {}
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
