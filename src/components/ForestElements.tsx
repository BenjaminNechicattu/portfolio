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

interface Butterfly {
  x: number;
  y: number;
  size: number;
  speed: number;
  angle: number;
  wingPhase: number;
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
      grassBladesRef.current = Array.from({ length: 30 }, () => ({
        width: Math.random() * 8 + 4,
        height: Math.random() * 50 + 30,
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
    const leafCount = 30;
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

    // Create butterflies
    const butterflies: Butterfly[] = [];
    const butterflyCount = 8;
    const butterflyColors = [
      'rgba(255, 200, 100, 0.8)',   // Yellow
      'rgba(255, 150, 150, 0.8)',   // Pink
      'rgba(150, 200, 255, 0.8)',   // Blue
      'rgba(200, 150, 255, 0.8)',   // Purple
    ];

    for (let i = 0; i < butterflyCount; i++) {
      butterflies.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 8 + 6,
        speed: Math.random() * 0.5 + 0.4,
        angle: Math.random() * Math.PI * 2,
        wingPhase: Math.random() * Math.PI * 2,
        color: butterflyColors[Math.floor(Math.random() * butterflyColors.length)],
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

    const drawButterfly = (butterfly: Butterfly) => {
      ctx.save();
      ctx.translate(butterfly.x, butterfly.y);
      ctx.rotate(butterfly.angle);

      // Update wing animation
      butterfly.wingPhase += 0.2;
      const wingAngle = Math.sin(butterfly.wingPhase) * 0.3;

      // Body
      ctx.fillStyle = 'rgba(50, 50, 50, 0.8)';
      ctx.beginPath();
      ctx.ellipse(0, 0, butterfly.size * 0.2, butterfly.size * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Left wings
      ctx.save();
      ctx.rotate(wingAngle);
      
      // Top left wing
      ctx.fillStyle = butterfly.color;
      ctx.beginPath();
      ctx.ellipse(-butterfly.size * 0.4, -butterfly.size * 0.3, butterfly.size * 0.5, butterfly.size * 0.4, -0.5, 0, Math.PI * 2);
      ctx.fill();
      
      // Bottom left wing
      ctx.beginPath();
      ctx.ellipse(-butterfly.size * 0.4, butterfly.size * 0.3, butterfly.size * 0.4, butterfly.size * 0.35, 0.5, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();

      // Right wings
      ctx.save();
      ctx.rotate(-wingAngle);
      
      // Top right wing
      ctx.fillStyle = butterfly.color;
      ctx.beginPath();
      ctx.ellipse(butterfly.size * 0.4, -butterfly.size * 0.3, butterfly.size * 0.5, butterfly.size * 0.4, 0.5, 0, Math.PI * 2);
      ctx.fill();
      
      // Bottom right wing
      ctx.beginPath();
      ctx.ellipse(butterfly.size * 0.4, butterfly.size * 0.3, butterfly.size * 0.4, butterfly.size * 0.35, -0.5, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();

      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Animate and draw leaves
      leaves.forEach((leaf) => {
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

      // Animate and draw butterflies
      butterflies.forEach((butterfly) => {
        drawButterfly(butterfly);

        // Update position with graceful movement
        butterfly.x += Math.cos(butterfly.angle) * butterfly.speed;
        butterfly.y += Math.sin(butterfly.angle) * butterfly.speed + Math.sin(Date.now() * 0.002) * 0.3;

        // Change direction occasionally
        if (Math.random() < 0.02) {
          butterfly.angle += (Math.random() - 0.5) * 0.5;
        }

        // Wrap around screen
        if (butterfly.x < -20) butterfly.x = canvas.width + 20;
        if (butterfly.x > canvas.width + 20) butterfly.x = -20;
        if (butterfly.y < -20) butterfly.y = canvas.height + 20;
        if (butterfly.y > canvas.height + 20) butterfly.y = -20;
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
        <div className="relative h-40 overflow-hidden">
          {/* Background layer - forest floor */}
          <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-green-800/30 dark:from-green-950/40 to-transparent" />
          
          {/* Grass blades */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-around items-end">
            {grassBladesRef.current.map((blade, i) => (
              <div
                key={i}
                className="bg-green-700/40 dark:bg-green-800/50 rounded-t-full animate-sway"
                style={{
                  width: `${blade.width}px`,
                  height: `${blade.height}px`,
                  animationDelay: `${blade.delay}s`,
                  animationDuration: `${blade.duration}s`,
                }}
              />
            ))}
          </div>
          
          {/* Flowers scattered in grass */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-around">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse"
                style={{
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: `${2 + Math.random()}s`,
                }}
              >
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: ['#ff6b9d', '#ffd93d', '#a8e6cf', '#dda0dd'][i % 4],
                    opacity: 0.6,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Falling leaves and butterflies canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[5]"
      />
      
      {/* Tree silhouettes on sides */}
      <div className="fixed bottom-0 left-0 pointer-events-none z-[4]">
        <div className="relative w-32 h-64">
          <div className="absolute bottom-0 left-0 w-12 h-48 bg-green-900/20 dark:bg-green-950/30 rounded-t-full" />
          <div className="absolute bottom-0 left-6 w-20 h-56 bg-green-800/25 dark:bg-green-900/35 rounded-t-full" />
        </div>
      </div>
      
      <div className="fixed bottom-0 right-0 pointer-events-none z-[4]">
        <div className="relative w-32 h-64">
          <div className="absolute bottom-0 right-0 w-12 h-48 bg-green-900/20 dark:bg-green-950/30 rounded-t-full" />
          <div className="absolute bottom-0 right-6 w-20 h-56 bg-green-800/25 dark:bg-green-900/35 rounded-t-full" />
        </div>
      </div>
    </>
  );
};

export default ForestElements;
