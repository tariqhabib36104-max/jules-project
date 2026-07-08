export interface Slide {
  id: string;
  name: string;
  imageUrl: string;
  type: 'preset' | 'upload';
}

export interface Simulation {
  id: string;
  name: string;
  url: string;
}

export interface Point {
  x: number; // Percentage (0-1)
  y: number; // Percentage (0-1)
}

export interface Stroke {
  points: Point[];
  color: string;
  width: number;
  isEraser: boolean;
}
