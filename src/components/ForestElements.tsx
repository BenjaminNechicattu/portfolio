import { useEffect, useRef } from 'react';

interface Leaf {
  x: number;
  y: number;
  size: number;
  rotation: number;
  speed: number;
  drift: number;
  color: string;
}

const ForestElements = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const grassBladesRef = useRef<Array<{ width: number; height: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize grass blades dimensions once
    if (grassBladesRef.current.length === 0) {
      grassBladesRef.current = Array.from({ length: 20 }, () => ({
        width: Math.random() * 8 + 4,
        height: Math.random() * 40 + 30,
        delay: Math.random() * 2,
        duration: Math.random() * 2 + 3,
      }));
    }

    // Set canvas size
    const resizeCanvas = () => {
      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create falling leaves
    const leaves: Leaf[] = [];
    const leafCount = 20;
    const leafColors = [
      'rgba(34, 139, 34, 0.7)',    // Forest green
      'rgba(50, 205, 50, 0.6)',    // Lime green
      'rgba(46, 125, 50, 0.7)',    // Dark green
      'rgba(76, 175, 80, 0.6)',    // Medium green
      'rgba(129, 199, 132, 0.5)',  // Light green
    ];

    for (let i = 0; i < leafCount; i++) {
      leaves.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 15 + 10,
        rotation: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.5 + 0.3,
        drift: Math.random() * 0.5 - 0.25,
        color: leafColors[Math.floor(Math.random() * leafColors.length)],
      });
    }

    // Animation
    let animationFrameId: number;

    const drawLeaf = (x: number, y: number, size: number, rotation: number, color: string) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);

      // Draw leaf shape
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(0, -size / 2);
      ctx.quadraticCurveTo(size / 2, -size / 4, size / 3, 0);
      ctx.quadraticCurveTo(size / 2, size / 4, 0, size / 2);
      ctx.quadraticCurveTo(-size / 2, size / 4, -size / 3, 0);
      ctx.quadraticCurveTo(-size / 2, -size / 4, 0, -size / 2);
      ctx.fill();

      // Draw vein
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, -size / 2);
      ctx.lineTo(0, size / 2);
      ctx.stroke();

      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      leaves.forEach((leaf) => {
        // Draw leaf
        drawLeaf(leaf.x, leaf.y, leaf.size, leaf.rotation, leaf.color);

        // Update position
        leaf.y += leaf.speed;
        leaf.x += leaf.drift;
        leaf.rotation += 0.02;

        // Reset leaf if it goes off screen
        if (leaf.y > canvas.height + leaf.size) {
          leaf.y = -leaf.size;
          leaf.x = Math.random() * canvas.width;
        }

        if (leaf.x > canvas.width + leaf.size) {
          leaf.x = -leaf.size;
        } else if (leaf.x < -leaf.size) {
          leaf.x = canvas.width + leaf.size;
        }
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
    <>
      {/* Decorative forest elements at the bottom */}
      <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-[5]">
        {/* Grass/bushes silhouettes */}
        <div className="relative h-32 overflow-hidden">
          {/* Background layer */}
          <div className="absolute bottom-0 w-full h-20 bg-gradient-to-t from-green-800/20 to-transparent" />
          
          {/* Grass blades */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-around items-end">
            {grassBladesRef.current.map((blade, i) => (
              <div
                key={i}
                className="bg-green-700/30 rounded-t-full animate-sway"
                style={{
                  width: `${blade.width}px`,
                  height: `${blade.height}px`,
                  animationDelay: `${blade.delay}s`,
                  animationDuration: `${blade.duration}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Falling leaves canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[5]"
      />
    </>
  );
};

export default ForestElements;
