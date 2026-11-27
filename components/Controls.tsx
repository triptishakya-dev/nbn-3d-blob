
import React from 'react';
import { SimulationParams, LogBase } from '../types';
import { Sliders, RefreshCcw, Zap, Target, Layers, Binary, Magnet, Waves } from 'lucide-react';

interface ControlsProps {
  params: SimulationParams;
  onParamChange: <K extends keyof SimulationParams>(key: K, value: SimulationParams[K]) => void;
  onRandomize: () => void;
}

const ControlSlider: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (val: number) => void;
  icon?: React.ReactNode;
}> = ({ label, value, min, max, step, onChange, icon }) => (
  <div className="mb-4 group">
    <div className="flex justify-between items-center mb-1">
      <div className="flex items-center gap-2 text-cyan-400 font-mono text-[10px] uppercase tracking-wider">
        {icon}
        {label}
      </div>
      <div className="text-fuchsia-400 font-mono text-[10px] bg-fuchsia-400/10 px-1 rounded">
        {value.toFixed(3)}
      </div>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-500 focus:outline-none transition-all"
    />
  </div>
);

const Controls: React.FC<ControlsProps> = ({ params, onParamChange, onRandomize }) => {
  return (
    <div className="bg-black/80 backdrop-blur-xl border-l md:border border-cyan-500/20 md:rounded-l-2xl p-6 shadow-[0_0_50px_-12px_rgba(6,182,212,0.5)] flex flex-col gap-6 h-full md:h-auto pointer-events-auto">
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <h2 className="text-cyan-100 font-mono text-xs font-bold uppercase tracking-widest">Calculus Params</h2>
        </div>
        <button 
          onClick={onRandomize}
          className="p-1.5 hover:bg-cyan-500/20 rounded-md transition-colors text-cyan-400"
          title="Randomize System"
        >
          <RefreshCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2">
        <div className="mb-4">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-[10px] uppercase tracking-wider mb-2">
            <Binary className="w-3 h-3" />
            Logarithmic Base
          </div>
          <div className="grid grid-cols-3 gap-1 p-1 bg-gray-900/50 border border-cyan-500/20 rounded-lg">
            {[LogBase.LN, LogBase.LOG2, LogBase.LOG10].map((base) => (
              <button
                key={base}
                onClick={() => onParamChange('logBase', base)}
                className={`py-1.5 text-[10px] font-mono transition-all rounded uppercase ${
                  params.logBase === base 
                    ? 'bg-cyan-500 text-black font-bold shadow-[0_0_10px_rgba(6,182,212,0.5)]' 
                    : 'text-cyan-600 hover:text-cyan-400'
                }`}
              >
                {base}
              </button>
            ))}
          </div>
        </div>

        <ControlSlider 
          label="Alpha (Sin/Cos Influence)" 
          value={params.alpha} 
          min={0.1} max={3.0} step={0.01} 
          onChange={(v) => onParamChange('alpha', v)}
          icon={<Target className="w-3 h-3" />}
        />
        <ControlSlider 
          label="Beta (Log Magnitude)" 
          value={params.beta} 
          min={0.1} max={5.0} step={0.01} 
          onChange={(v) => onParamChange('beta', v)}
          icon={<Layers className="w-3 h-3" />}
        />
        <ControlSlider 
          label="Gamma (Chaos Factor)" 
          value={params.gamma} 
          min={0.01} max={1.0} step={0.01} 
          onChange={(v) => onParamChange('gamma', v)}
          icon={<Zap className="w-3 h-3" />}
        />
        <ControlSlider 
          label="Omega (Harmonic Resonance)" 
          value={params.omega} 
          min={0.1} max={5.0} step={0.01} 
          onChange={(v) => onParamChange('omega', v)}
          icon={<Waves className="w-3 h-3" />}
        />
        <ControlSlider 
          label="Attractor Strength" 
          value={params.attractorStrength} 
          min={0.01} max={2.0} step={0.01} 
          onChange={(v) => onParamChange('attractorStrength', v)}
          icon={<Magnet className="w-3 h-3" />}
        />
        <ControlSlider 
          label="Delta (Dt Precision)" 
          value={params.delta} 
          min={0.001} max={0.15} step={0.001} 
          onChange={(v) => onParamChange('delta', v)}
        />
        <ControlSlider 
          label="Animation Speed" 
          value={params.speed} 
          min={0.1} max={5.0} step={0.1} 
          onChange={(v) => onParamChange('speed', v)}
        />
         <ControlSlider 
          label="Hue Offset" 
          value={params.hueRotation} 
          min={0} max={360} step={1} 
          onChange={(v) => onParamChange('hueRotation', v)}
        />
         <ControlSlider 
          label="Trail Decay" 
          value={params.decay} 
          min={0.8} max={0.999} step={0.001} 
          onChange={(v) => onParamChange('decay', v)}
        />
      </div>

      <div className="mt-4 pt-4 border-t border-cyan-500/20">
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => onParamChange('particleCount', Math.max(100, params.particleCount - 500))}
            className="text-[10px] font-mono py-2 px-3 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 transition-colors uppercase"
          >
            - 500 Part.
          </button>
          <button 
            onClick={() => onParamChange('particleCount', Math.min(10000, params.particleCount + 500))}
            className="text-[10px] font-mono py-2 px-3 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 transition-colors uppercase"
          >
            + 500 Part.
          </button>
        </div>
      </div>

      <div className="mt-auto text-[9px] font-mono text-cyan-900 uppercase text-center tracking-[0.2em]">
        System Stable // All Systems Nominal
      </div>
    </div>
  );
};

export default Controls;
