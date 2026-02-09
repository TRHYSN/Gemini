import React, { useEffect, useRef } from 'react';

interface WaveformProps {
  isListening: boolean;
  analyzer?: AnalyserNode;
}

const Waveform: React.FC<WaveformProps> = ({ isListening, analyzer }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas || !analyzer) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyzer.getByteTimeDomainData(dataArray);

    ctx.fillStyle = '#0f172a'; // Clear with bg color
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 2;
    // Cyber color gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, '#06b6d4');
    gradient.addColorStop(0.5, '#f43f5e');
    gradient.addColorStop(1, '#06b6d4');
    
    ctx.strokeStyle = gradient;
    ctx.beginPath();

    const sliceWidth = (canvas.width * 1.0) / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * canvas.height) / 2;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    if (isListening) {
      requestRef.current = requestAnimationFrame(draw);
    }
  };

  useEffect(() => {
    if (isListening && analyzer) {
      draw();
    } else {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      // Clear canvas when stopped
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          // Draw a flat line
          ctx.strokeStyle = '#334155';
          ctx.beginPath();
          ctx.moveTo(0, canvas.height/2);
          ctx.lineTo(canvas.width, canvas.height/2);
          ctx.stroke();
        }
      }
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening, analyzer]);

  return (
    <div className="w-full h-32 bg-slate-900 rounded-lg border border-slate-700 overflow-hidden relative shadow-[0_0_15px_rgba(6,182,212,0.1)]">
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={128} 
        className="w-full h-full"
      />
      <div className="absolute top-2 right-2 text-xs text-cyan-500 font-mono">
        SIGNAL_INPUT: {isListening ? 'ACTIVE' : 'STANDBY'}
      </div>
    </div>
  );
};

export default Waveform;