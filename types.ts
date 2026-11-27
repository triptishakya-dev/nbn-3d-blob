
export interface Attractor {
  x: number; // Normalized -1 to 1
  y: number; // Normalized -1 to 1
  id: string;
  color: string; // hex or hsl
}

export interface SimulationParams {
  alpha: number;      // Influence of Sine/Cosine
  beta: number;       // Logarithmic magnitude
  gamma: number;      // Chaos multiplier
  omega: number;      // Angular Frequency (Harmonic Resonance)
  delta: number;      // Differential step size
  speed: number;      // Particle speed multiplier
  particleCount: number;
  hueRotation: number;
  logBase: LogBase;    // Choice between ln, log2, log10
  decay: number;      // Trail decay
  attractors: Attractor[];
  attractorStrength: number;
}

export enum LogBase {
  LN = 'ln',
  LOG2 = 'log2',
  LOG10 = 'log10'
}

export interface Particle {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  hue: number;
  life: number;
  isOrbital?: boolean; // Flag for special chaos-theory orbits
}
