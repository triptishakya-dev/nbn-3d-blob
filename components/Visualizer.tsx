
import React, { useRef, useEffect } from 'react';
import { SimulationParams, Particle, LogBase } from '../types';

interface VisualizerProps {
  params: SimulationParams;
  onFPSUpdate: (fps: number) => void;
}

const Visualizer: React.FC<VisualizerProps> = ({ params, onFPSUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);

  const getLogValue = (val: number, base: LogBase) => {
    const v = 1 + Math.abs(val);
    switch (base) {
      case LogBase.LOG2: return Math.log2(v);
      case LogBase.LOG10: return Math.log10(v);
      case LogBase.LN:
      default: return Math.log(v);
    }
  };
  
  const initParticles = (count: number, width: number, height: number) => {
    const particles: Particle[] = [];
    const orbitalCount = Math.floor(count * 0.15);

    for (let i = 0; i < count; i++) {
      const isOrbital = i < orbitalCount;
      const x = (Math.random() - 0.5) * width;
      const y = (Math.random() - 0.5) * height;
      particles.push({
        x,
        y,
        prevX: x,
        prevY: y,
        hue: isOrbital ? 0 : (params.hueRotation + Math.random() * 60),
        life: Math.random(),
        isOrbital
      });
    }
    return particles;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    if (particlesRef.current.length === 0 || particlesRef.current.length !== params.particleCount) {
      particlesRef.current = initParticles(params.particleCount, width, height);
    }

    const animate = (time: number) => {
      if (lastTimeRef.current === 0) lastTimeRef.current = time;
      const deltaT = time - lastTimeRef.current;
      frameCountRef.current++;
      if (deltaT >= 1000) {
        onFPSUpdate(Math.round((frameCountRef.current * 1000) / deltaT));
        frameCountRef.current = 0;
        lastTimeRef.current = time;
      }

      ctx.fillStyle = `rgba(0, 0, 0, ${1 - params.decay})`;
      ctx.fillRect(0, 0, width, height);

      const { alpha, beta, gamma, omega, delta, speed, hueRotation, logBase, attractors, attractorStrength } = params;

      particlesRef.current.forEach(p => {
        p.prevX = p.x;
        p.prevY = p.y;

        const nx = p.x / 100;
        const ny = p.y / 100;

        const logX = getLogValue(nx, logBase);
        const logY = getLogValue(ny, logBase);

        // Core expansion including Omega (Harmonic Frequency)
        // dx/dt = alpha * sin(y * gamma * omega) + beta * log(1+|x|)
        let dx = (alpha * Math.sin(ny * gamma * omega) + beta * logX) * speed;
        let dy = (alpha * Math.cos(nx * gamma * omega) - beta * logY) * speed;

        if (p.isOrbital && attractors.length > 0) {
            const timeScaled = time * 0.001 * speed;
            attractors.forEach((att, idx) => {
                const ax = att.x * (width / 2);
                const ay = att.y * (height / 2);
                const distDx = ax - p.x;
                const distDy = ay - p.y;
                const distSq = distDx * distDx + distDy * distDy + 500;
                const pull = (attractorStrength * 25000) / distSq;
                
                const rot = (idx + 1) * timeScaled;
                dx += (distDx * Math.cos(rot) - distDy * Math.sin(rot)) * pull * 0.02;
                dy += (distDx * Math.sin(rot) + distDy * Math.cos(rot)) * pull * 0.02;
            });
            p.hue = (timeScaled * 50) % 360;
        } else {
            attractors.forEach(att => {
                const ax = att.x * (width / 2);
                const ay = att.y * (height / 2);
                const distDx = ax - p.x;
                const distDy = ay - p.y;
                const distSq = distDx * distDx + distDy * distDy + 800;
                const force = (attractorStrength * 18000) / distSq;
                
                dx += distDx * force * 0.015;
                dy += distDy * force * 0.015;

                const swirl = gamma * 4.0; 
                dx -= distDy * force * 0.012 * swirl;
                dy += distDx * force * 0.012 * swirl;
            });
        }

        p.x += dx * delta * 50;
        p.y += dy * delta * 50;

        if (Math.abs(p.x) > width / 1.3 || Math.abs(p.y) > height / 1.3 || Math.random() < 0.0006) {
          p.x = (Math.random() - 0.5) * width;
          p.y = (Math.random() - 0.5) * height;
          p.prevX = p.x;
          p.prevY = p.y;
          p.hue = p.isOrbital ? 0 : (hueRotation + Math.random() * 60);
        }

        ctx.beginPath();
        ctx.lineWidth = p.isOrbital ? 2.5 : 1.2;
        ctx.strokeStyle = p.isOrbital 
            ? `hsla(${p.hue}, 100%, 70%, 1.0)` 
            : `hsla(${p.hue}, 90%, 65%, 0.85)`;
        ctx.moveTo(p.prevX + width / 2, p.prevY + height / 2);
        ctx.lineTo(p.x + width / 2, p.y + height / 2);
        ctx.stroke();
      });

      attractors.forEach((att) => {
        const ax = att.x * (width / 2) + width / 2;
        const ay = att.y * (height / 2) + height / 2;
        
        const gradient = ctx.createRadialGradient(ax, ay, 0, ax, ay, 20);
        gradient.addColorStop(0, `${att.color}88`);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(ax, ay, 20, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(ax, ay, 5, 0, Math.PI * 2);
        ctx.fillStyle = att.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = att.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [params, onFPSUpdate]);

  return (
    <canvas 
      ref={canvasRef} 
      className="block w-full h-full cursor-none"
    />
  );
};

export default Visualizer;
