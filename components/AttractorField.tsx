
import React, { useRef, useState, useEffect } from 'react';
import { Attractor } from '../types';
import { MousePointer2, Trash2, Move } from 'lucide-react';

interface AttractorFieldProps {
  attractors: Attractor[];
  onChange: (attractors: Attractor[]) => void;
}

const COLORS = ['#ff4444', '#44ff44', '#4444ff']; // Red, Green, Blue

const AttractorField: React.FC<AttractorFieldProps> = ({ attractors, onChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const getPos = (e: React.MouseEvent | MouseEvent) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    return { x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (attractors.length < 3) {
      const { x, y } = getPos(e);
      const newAttractor: Attractor = {
        x,
        y,
        id: Math.random().toString(36).substr(2, 9),
        color: COLORS[attractors.length]
      };
      onChange([...attractors, newAttractor]);
      setDraggingId(newAttractor.id);
    }
  };

  const handleDragStart = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDraggingId(id);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!draggingId) return;
      const { x, y } = getPos(e);
      onChange(attractors.map(a => a.id === draggingId ? { ...a, x, y } : a));
    };

    const handleMouseUp = () => setDraggingId(null);

    if (draggingId) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingId, attractors, onChange]);

  const removeAttractor = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = attractors.filter(a => a.id !== id);
    const updated = filtered.map((a, i) => ({ ...a, color: COLORS[i] }));
    onChange(updated);
  };

  return (
    <div className="w-full h-32 md:h-40 bg-black/80 border-t border-cyan-500/30 relative overflow-hidden group select-none">
      <div className="absolute inset-0 pointer-events-none opacity-10">
         <div className="w-full h-full" style={{ backgroundImage: 'linear-gradient(#083344 1px, transparent 1px), linear-gradient(90deg, #083344 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>
      
      <div 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        className="w-full h-full relative cursor-crosshair"
      >
        {attractors.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-cyan-800 font-mono text-[10px] uppercase tracking-widest gap-2 pointer-events-none animate-pulse">
            <MousePointer2 className="w-3 h-3" />
            Initialize RGB Nodes
          </div>
        )}

        {attractors.map((att, idx) => (
          <div
            key={att.id}
            onMouseDown={(e) => handleDragStart(att.id, e)}
            className={`absolute w-6 h-6 -ml-3 -mt-3 rounded-full border-2 flex items-center justify-center group/dot cursor-grab active:cursor-grabbing transition-shadow z-10`}
            style={{ 
              left: `${(att.x + 1) * 50}%`, 
              top: `${(att.y + 1) * 50}%`,
              borderColor: att.color,
              backgroundColor: `${att.color}33`,
              boxShadow: draggingId === att.id ? `0 0 25px ${att.color}` : `0 0 10px ${att.color}66`
            }}
          >
            {/* Coordinate Label */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none">
              <div 
                className="text-[9px] font-mono px-2 py-0.5 rounded border border-white/10 bg-black/80"
                style={{ color: att.color }}
              >
                {['R','G','B'][idx]}: [{att.x.toFixed(2)}, {att.y.toFixed(2)}]
              </div>
            </div>

            <Move className="w-3 h-3 opacity-0 group-hover/dot:opacity-100 transition-opacity" style={{ color: att.color }} />
            
            <button 
              onClick={(e) => removeAttractor(att.id, e)}
              className="absolute -top-4 -right-4 opacity-0 group-hover/dot:opacity-100 transition-opacity bg-black/90 rounded-full p-1 border border-red-500/50"
            >
              <Trash2 className="w-2.5 h-2.5 text-red-500" />
            </button>
          </div>
        ))}
      </div>

      <div className="absolute top-2 left-4 text-[9px] font-mono text-cyan-500 uppercase opacity-30 pointer-events-none flex gap-6">
        <span>Attractor Field Interaction Mapping</span>
        <span>RGB Coordinate Projection: Active</span>
      </div>
    </div>
  );
};

export default AttractorField;
