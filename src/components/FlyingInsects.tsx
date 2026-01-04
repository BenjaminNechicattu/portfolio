import { useEffect, useRef } from 'react';

interface Fly {
  x: number;
  y: number;
  size: number;
  speed: number;
  angle: number;
  wingPhase: number;
  zigzagPhase: number;
}

const FlyingInsects = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create flies
    const flies: Fly[] = [];
    const flyCount = 15;

    for (let i = 0; i < flyCount; i++) {
      flies.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 2,
        speed: Math.random() * 0.5 + 0.3,
        angle: Math.random() * Math.PI * 2,
        wingPhase: Math.random() * Math.PI * 2,
        zigzagPhase: Math.random() * Math.PI * 2,
      });
    }

    // Animation
    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      flies.forEach((fly) => {
        // Update position with zigzag pattern
        fly.zigzagPhase += 0.1;
        const zigzag = Math.sin(fly.zigzagPhase) * 2;
        
        fly.x += Math.cos(fly.angle) * fly.speed + zigzag;
        fly.y += Math.sin(fly.angle) * fly.speed;

        // Change direction occasionally
        if (Math.random() < 0.02) {
          fly.angle += (Math.random() - 0.5) * 0.5;
        }

        // Wrap around screen
        if (fly.x < 0) fly.x = canvas.width;
        if (fly.x > canvas.width) fly.x = 0;
        if (fly.y < 0) fly.y = canvas.height;
        if (fly.y > canvas.height) fly.y = 0;

        // Update wing animation
        fly.wingPhase += 0.3;

        // Draw fly body
        ctx.save();
        ctx.translate(fly.x, fly.y);
        ctx.rotate(fly.angle);

        // Body (dark green/brown)
        ctx.fillStyle = 'rgba(60, 80, 40, 0.8)';
        ctx.beginPath();
        ctx.ellipse(0, 0, fly.size, fly.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Wings (transparent with slight green tint)
        const wingSpread = Math.abs(Math.sin(fly.wingPhase)) * 0.5 + 0.5;
        ctx.strokeStyle = 'rgba(100, 150, 80, 0.3)';
        ctx.fillStyle = 'rgba(150, 200, 100, 0.1)';
        ctx.lineWidth = 0.5;

        // Left wing
        ctx.beginPath();
        ctx.ellipse(-fly.size * 0.5, -fly.size * wingSpread, fly.size * 1.2, fly.size * 0.8, -0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Right wing
        ctx.beginPath();
        ctx.ellipse(-fly.size * 0.5, fly.size * wingSpread, fly.size * 1.2, fly.size * 0.8, 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
    />
  );
};

export default FlyingInsects;
