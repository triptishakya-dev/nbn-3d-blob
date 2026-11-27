
import React from 'react';
import { SimulationParams } from '../types';

interface FormulaOverlayProps {
  params: SimulationParams;
}

const FormulaOverlay: React.FC<FormulaOverlayProps> = ({ params }) => {
  return (
    <div className="bg-black/40 backdrop-blur-md border border-cyan-500/10 p-5 rounded-lg shadow-2xl animate-in fade-in slide-in-from-left duration-700">
      <h3 className="text-cyan-600 font-mono text-[9px] uppercase tracking-[0.3em] mb-4 opacity-60 border-b border-cyan-500/5 pb-2 flex justify-between items-center">
        <span>Solver Diagnostics</span>
        <span className="text-[8px]">&Delta;t: 10<sup>-3</sup></span>
      </h3>
      
      <div className="space-y-5 font-math italic">
        <div>
          <div className="flex justify-between text-[10px] uppercase tracking-widest text-cyan-800 mb-1">
            <span className="font-math">Precision (&delta;)</span>
            <span className="text-cyan-500 font-mono not-italic">{(params.delta).toFixed(4)}</span>
          </div>
          <div className="w-full h-0.5 bg-cyan-950 rounded-full overflow-hidden">
            <div 
              className="h-full bg-cyan-600 transition-all duration-300 shadow-[0_0_5px_#0891b2]"
              style={{ width: `${(params.delta / 0.15) * 100}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[10px] uppercase tracking-widest text-cyan-800 mb-1">
            <span className="font-math">Entropy Coefficient (&gamma;)</span>
            <span className="text-fuchsia-500 font-mono not-italic">{(params.gamma).toFixed(3)}</span>
          </div>
          <div className="w-full h-0.5 bg-cyan-950 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-900 to-fuchsia-900 transition-all duration-300"
              style={{ width: `${(params.gamma * 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="pt-2 border-t border-cyan-500/5 font-mono text-[9px] text-cyan-950 uppercase tracking-tighter">
          <div className="flex justify-between mb-1">
            <span>Flux Derivative:</span>
            <span className="text-cyan-700">{(params.alpha * params.beta).toFixed(3)}</span>
          </div>
          <div className="flex justify-between">
            <span>Integration Step:</span>
            <span className="text-cyan-700">{params.speed.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormulaOverlay;
