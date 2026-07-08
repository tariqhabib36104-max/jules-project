import type { Slide } from '../types';

// Simple abstract SVG representations for analogies (No complex equations)
const createDataURI = (svg: string) => `data:image/svg+xml;base64,${btoa(svg)}`;

const svgGravity = `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#18181b"/>
  <!-- Space-time grid -->
  <g stroke="#3f3f46" stroke-width="2" fill="none">
    <path d="M 0 100 Q 400 300 800 100" />
    <path d="M 0 200 Q 400 400 800 200" />
    <path d="M 0 300 Q 400 500 800 300" />
    <path d="M 0 400 Q 400 600 800 400" />
    <path d="M 0 500 Q 400 700 800 500" />

    <path d="M 100 0 Q 300 400 100 800" />
    <path d="M 250 0 Q 350 400 250 800" />
    <path d="M 400 0 Q 400 400 400 800" />
    <path d="M 550 0 Q 450 400 550 800" />
    <path d="M 700 0 Q 500 400 700 800" />
  </g>
  <!-- Massive Core -->
  <circle cx="400" cy="350" r="80" fill="#f59e0b" opacity="0.8" />
  <circle cx="400" cy="350" r="40" fill="#fef3c7" />
  <!-- Small Object falling in -->
  <circle cx="200" cy="180" r="15" fill="#14b8a6" />
  <path d="M 200 180 Q 300 250 350 300" stroke="#14b8a6" stroke-width="4" stroke-dasharray="10,10" fill="none" />
  <text x="400" y="550" font-family="sans-serif" font-size="28" fill="#e4e4e7" text-anchor="middle">Gravity Analogy: Trampoline</text>
</svg>`;

const svgCircuit = `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#18181b"/>
  <!-- Pipe System -->
  <path d="M 200 150 L 600 150 L 600 450 L 200 450 Z" stroke="#3f3f46" stroke-width="30" fill="none" stroke-linejoin="round"/>
  <!-- Pump (Battery) -->
  <rect x="160" y="260" width="80" height="80" rx="10" fill="#4f46e5"/>
  <text x="200" y="305" font-family="sans-serif" font-size="24" fill="white" text-anchor="middle">PUMP</text>
  <!-- Narrow Pipe (Resistor) -->
  <rect x="585" y="250" width="30" height="100" fill="#18181b"/>
  <path d="M 600 250 L 600 350" stroke="#ef4444" stroke-width="10" fill="none"/>
  <!-- Water flow (Current) -->
  <circle cx="350" cy="150" r="8" fill="#14b8a6" />
  <circle cx="450" cy="150" r="8" fill="#14b8a6" />
  <circle cx="600" cy="400" r="8" fill="#14b8a6" />
  <circle cx="450" cy="450" r="8" fill="#14b8a6" />
  <text x="400" y="550" font-family="sans-serif" font-size="28" fill="#e4e4e7" text-anchor="middle">Electric Circuit Analogy: Water Flow</text>
</svg>`;

const svgFriction = `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#18181b"/>
  <!-- Top Surface -->
  <path d="M 100 250 L 200 280 L 250 250 L 350 290 L 400 250 L 500 290 L 600 250 L 700 280 L 700 150 L 100 150 Z" fill="#4f46e5" opacity="0.8"/>
  <!-- Bottom Surface -->
  <path d="M 100 350 L 200 320 L 250 350 L 350 310 L 400 350 L 500 310 L 600 350 L 700 320 L 700 450 L 100 450 Z" fill="#10b981" opacity="0.8"/>
  <!-- Movement Arrows -->
  <path d="M 400 100 L 500 100 L 480 80 M 500 100 L 480 120" stroke="#f59e0b" stroke-width="6" fill="none" stroke-linejoin="round"/>
  <text x="400" y="550" font-family="sans-serif" font-size="28" fill="#e4e4e7" text-anchor="middle">Friction Analogy: Microscopic Teeth</text>
</svg>`;

const svgWaves = `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#18181b"/>
  <!-- Wave Path -->
  <path d="M 100 300 Q 200 150 300 300 T 500 300 T 700 300" stroke="#3f3f46" stroke-width="4" fill="none" stroke-dasharray="10,10"/>
  <!-- Particles (Stadium Wave) -->
  <circle cx="100" cy="300" r="15" fill="#f59e0b" />
  <circle cx="200" cy="150" r="15" fill="#14b8a6" />
  <circle cx="300" cy="300" r="15" fill="#f59e0b" />
  <circle cx="400" cy="450" r="15" fill="#14b8a6" />
  <circle cx="500" cy="300" r="15" fill="#f59e0b" />
  <!-- Energy Direction -->
  <path d="M 350 100 L 550 100 L 530 80 M 550 100 L 530 120" stroke="#e4e4e7" stroke-width="6" fill="none" stroke-linejoin="round"/>
  <text x="450" y="70" font-family="sans-serif" font-size="20" fill="#e4e4e7">Energy</text>
  <text x="400" y="550" font-family="sans-serif" font-size="28" fill="#e4e4e7" text-anchor="middle">Transverse Waves Analogy: Stadium Wave</text>
</svg>`;

const svgHeat = `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#18181b"/>
  <!-- Fire (Source) -->
  <path d="M 150 400 Q 200 300 150 250 Q 180 350 220 300 Q 200 400 250 450 Q 150 500 100 450 Z" fill="#ef4444"/>
  <path d="M 170 420 Q 200 350 170 320 Q 190 380 200 350 Q 190 410 220 440 Q 170 470 140 440 Z" fill="#f59e0b"/>
  <!-- Conduction (Hand to hand) -->
  <rect x="250" y="200" width="300" height="20" fill="#71717a"/>
  <circle cx="300" cy="210" r="30" fill="#ef4444" opacity="0.8"/>
  <circle cx="400" cy="210" r="30" fill="#f59e0b" opacity="0.8"/>
  <circle cx="500" cy="210" r="30" fill="#3f3f46" opacity="0.8"/>
  <text x="400" y="160" font-family="sans-serif" font-size="20" fill="#e4e4e7" text-anchor="middle">Conduction</text>

  <text x="400" y="550" font-family="sans-serif" font-size="28" fill="#e4e4e7" text-anchor="middle">Heat Transfer Analogy: Bucket Brigade</text>
</svg>`;

export const presetSlides: Slide[] = [
  { id: 'slide-preset-1', name: 'Gravity Analogy', imageUrl: createDataURI(svgGravity), type: 'preset' },
  { id: 'slide-preset-2', name: 'Circuit Analogy', imageUrl: createDataURI(svgCircuit), type: 'preset' },
  { id: 'slide-preset-3', name: 'Friction Analogy', imageUrl: createDataURI(svgFriction), type: 'preset' },
  { id: 'slide-preset-4', name: 'Waves Analogy', imageUrl: createDataURI(svgWaves), type: 'preset' },
  { id: 'slide-preset-5', name: 'Heat Transfer', imageUrl: createDataURI(svgHeat), type: 'preset' },
];
