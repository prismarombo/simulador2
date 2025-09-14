
import React, { useRef, useEffect, useCallback } from 'react';

interface SimulationCanvasProps {
    position: number;
    rampShape: (x: number) => number;
    onBallDrag: (startPosition: number) => void;
    isSimulating: boolean;
}

export const SimulationCanvas: React.FC<SimulationCanvasProps> = ({ position, rampShape, onBallDrag, isSimulating }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    const draw = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
        ctx.clearRect(0, 0, width, height);

        // --- Transformation to world coordinates ---
        const scale = Math.min(width / 2.2, height / 1.2);
        const offsetX = width / 2;
        const offsetY = height * 0.8;
        
        const toCanvasX = (worldX: number) => offsetX + worldX * scale;
        const toCanvasY = (worldY: number) => offsetY - worldY * scale;

        // --- Draw Ramp ---
        ctx.beginPath();
        ctx.moveTo(toCanvasX(-1.1), toCanvasY(rampShape(-1.1)));
        for (let x = -1.1; x <= 1.1; x += 0.01) {
            ctx.lineTo(toCanvasX(x), toCanvasY(rampShape(x)));
        }
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#5eead4'; // teal-300
        ctx.stroke();

        // --- Draw Ball ---
        const ballRadius = 12;
        const ballX = toCanvasX(position);
        const ballY = toCanvasY(rampShape(position));

        // Gradient for the ball
        const gradient = ctx.createRadialGradient(ballX - 4, ballY - 4, 2, ballX, ballY, ballRadius);
        gradient.addColorStop(0, '#f0f9ff'); // sky-50
        gradient.addColorStop(0.8, '#38bdf8'); // sky-500
        gradient.addColorStop(1, '#0ea5e9'); // sky-600

        ctx.beginPath();
        ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.strokeStyle = '#0284c7'; // sky-700
        ctx.lineWidth = 1;
        ctx.stroke();

    }, [position, rampShape]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
            draw(ctx, canvas.width, canvas.height);
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        return () => window.removeEventListener('resize', resizeCanvas);
    }, [draw]);

    const handleInteraction = (event: React.MouseEvent | React.TouchEvent) => {
        if (isSimulating || !canvasRef.current) return;
        
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();

        const getClientX = (e: React.MouseEvent | React.TouchEvent) => {
            return 'touches' in e ? e.touches[0].clientX : e.clientX;
        }

        const clientX = getClientX(event);
        const canvasX = clientX - rect.left;

        const width = canvas.width;
        const scale = width / 2.2;
        const offsetX = width / 2;
        
        let worldX = (canvasX - offsetX) / scale;
        if (worldX > 1) worldX = 1;
        if (worldX < -1) worldX = -1;
        
        onBallDrag(worldX);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (isSimulating) return;
        isDragging.current = true;
        handleInteraction(e);
    };

    const handleMouseUp = () => {
        isDragging.current = false;
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging.current) {
            handleInteraction(e);
        }
    };
    
    const handleTouchStart = (e: React.TouchEvent) => {
        if (isSimulating) return;
        isDragging.current = true;
        handleInteraction(e);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (isDragging.current) {
            handleInteraction(e);
        }
    };
    
    const handleTouchEnd = () => {
        isDragging.current = false;
    };

    return (
        <div 
            ref={containerRef} 
            className="w-full h-full relative"
            onMouseLeave={handleMouseUp}
        >
            <canvas 
                ref={canvasRef} 
                className="w-full h-full"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onTouchMove={handleTouchMove}
            />
            {!isSimulating && (
                 <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-slate-900/50 text-cyan-300 px-3 py-1 rounded-full text-xs sm:text-sm animate-pulse">
                    Arrastra la bola para establecer una posición inicial
                </div>
            )}
        </div>
    );
};
