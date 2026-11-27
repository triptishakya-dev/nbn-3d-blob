
import { SimulationParams, LogBase } from './types';

export const INITIAL_PARAMS: SimulationParams = {
  alpha: 0.85,
  beta: 1.2,
  gamma: 0.5,
  omega: 1.0,
  delta: 0.05,
  speed: 1.0,
  particleCount: 2500,
  hueRotation: 180,
  logBase: LogBase.LN,
  decay: 0.96,
  attractors: [],
  attractorStrength: 0.5
};

export const COLOR_PRESETS = [
  { name: 'Cyberpunk', start: 280, end: 340 },
  { name: 'Matrix', start: 100, end: 150 },
  { name: 'Deep Sea', start: 180, end: 220 },
  { name: 'Supernova', start: 0, end: 40 },
  { name: 'Nebula', start: 240, end: 300 }
];
