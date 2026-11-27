
import React, { useState, useCallback } from 'react';
import Visualizer from './components/Visualizer';
import Controls from './components/Controls';
import FormulaOverlay from './components/FormulaOverlay';
import AttractorField from './components/AttractorField';
import { SimulationParams, Attractor, LogBase } from './types';
import { INITIAL_PARAMS } from './constants';
import { Activity, Settings2, Info, Cpu } from 'lucide-react';

const App: React.FC = () => {
  const [params, setParams] = useState<SimulationParams>(INITIAL_PARAMS);
  const [showControls, setShowControls] = useState(true);
  const [showFormula, setShowFormula] = useState(true);
  const [fps, setFps] = useState(0);

  const handleParamChange = useCallback(<K extends keyof SimulationParams>(key: K, value: SimulationParams[K]) => {
    setParams(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleAttractorChange = useCallback((attractors: Attractor[]) => {
    setParams(prev => ({ ...prev, attractors }));
  }, []);

  const randomize = useCallback(() => {
    setParams({
      ...INITIAL_PARAMS,
      alpha: Math.random() * 2,
      beta: Math.random() * 2,
      gamma: Math.random(),
      omega: 0.5 + Math.random() * 2,
      hueRotation: Math.random() * 360,
      attractors: params.attractors,
    });
  }, [params.attractors]);

  const logLabel = params.logBase === LogBase.LN ? 'ln' : params.logBase === LogBase.LOG2 ? 'log_2' : 'log_{10}';
  const a = params.alpha.toFixed(2);
  const b = params.beta.toFixed(2);
  const g = params.gamma.toFixed(2);
  const w = params.omega.toFixed(2);
  const k = params.attractorStrength.toFixed(2);

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden flex flex-col">
      <div className="absolute inset-0 z-0">
        <Visualizer params={params} onFPSUpdate={setFps} />
      </div>

      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none w-full max-w-6xl px-4 flex flex-col items-center gap-6">
        <div className="bg-black/20 backdrop-blur-[2px] p-4 rounded-2xl border border-white/5 flex flex-col items-center">
          <div className="text-[10px] text-cyan-500 font-mono tracking-[0.5em] uppercase opacity-40 mb-3">
            Primary Differential Vector Field Φ(P, t)
          </div>
          <div className="font-math text-2xl md:text-4xl text-white math-glow tracking-tight whitespace-nowrap">
            <span className="text-fuchsia-500 mr-2 opacity-80">&part;P/&part;t</span>
            <span> = </span>
            <span className="mx-2 font-math">
              &lceil; {a}sin(y &middot; {g} &middot; {w}) + {b}{logLabel}(1+|x|) , {a}cos(x &middot; {g} &middot; {w}) - {b}{logLabel}(1+|y|) &rceil;
              {params.attractors.length > 0 && (
                <span className="text-cyan-400">
                  {" "}+ &sum;<sub>i&in;{'{R,G,B}'}</sub> &nabla; &Psi;<sub>{k}</sub>(A<sub>i</sub>)
                </span>
              )}
            </span>
          </div>
        </div>

        <div className="bg-black/20 backdrop-blur-[2px] p-3 rounded-xl border border-white/5 flex flex-col items-center">
          <div className="text-[9px] text-fuchsia-500 font-mono tracking-[0.4em] uppercase opacity-40 mb-2">
            Stochastic Orbital Ghost Dynamics Ω(A, τ)
          </div>
          <div className="font-math text-sm md:text-xl text-cyan-100/80 math-glow tracking-wide whitespace-nowrap">
            <span className="text-cyan-500 mr-2">&part;P<sub>ghost</sub>/&part;&tau;</span>
            <span> = </span>
            <span className="mx-2">
              &oint;<sub>&Gamma;</sub> R(&omega;t) &cdot; [ (P - A<sub>rgb</sub>) / (||dist||<sup>2</sup> + &epsilon;) ] dt + &sigma; dW<sub>t</sub>
            </span>
          </div>
        </div>
      </div>

      <div className="absolute top-0 left-0 w-full p-4 md:p-6 flex justify-between items-start z-20 pointer-events-none">
        <div className="pointer-events-auto">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-cyan-500 opacity-50" />
            <h1 className="text-sm font-bold tracking-widest text-cyan-700 font-mono uppercase">
              Chaos.RK4
            </h1>
          </div>
        </div>

        <div className="flex gap-2 pointer-events-auto">
           <button 
            onClick={() => setShowFormula(!showFormula)}
            className={`p-2 rounded-lg border transition-all ${showFormula ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300' : 'bg-black/50 border-gray-800 text-gray-500'}`}
          >
            <Info className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setShowControls(!showControls)}
            className={`p-2 rounded-lg border transition-all ${showControls ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300' : 'bg-black/50 border-gray-800 text-gray-500'}`}
          >
            <Settings2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="relative flex-1 pointer-events-none flex flex-col justify-center">
        {showFormula && (
          <div className="pointer-events-auto ml-4 md:ml-8 max-w-[240px]">
            <FormulaOverlay params={params} />
          </div>
        )}
      </div>

      <div className="relative z-20 pointer-events-auto">
        <AttractorField attractors={params.attractors} onChange={handleAttractorChange} />
      </div>

      {showControls && (
        <div className="absolute right-0 top-24 bottom-32 md:bottom-40 z-30 pointer-events-none flex items-center pr-0 md:pr-4">
          <div className="pointer-events-auto w-full md:w-80 max-h-full overflow-y-auto pb-4">
            <Controls 
              params={params} 
              onParamChange={handleParamChange} 
              onRandomize={randomize} 
            />
          </div>
        </div>
      )}

      <div className="absolute bottom-32 md:bottom-40 left-4 z-20 pointer-events-none hidden md:block mb-4">
        <div className="flex items-center gap-6 font-mono text-[10px] text-cyan-900 tracking-tighter">
          <div className="flex items-center gap-1">
            <Cpu className="w-3 h-3" />
            <span>{fps} FPS</span>
          </div>
          <span>DENSITY: {params.particleCount}</span>
        </div>
      </div>
    </div>
  );
};

export default App;
