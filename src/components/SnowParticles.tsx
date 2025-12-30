import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

interface Snowflake {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  drift: number;
  isGray: boolean;
}

const SnowParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

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

    // Create snowflakes
    const snowflakes: Snowflake[] = [];
    const snowflakeCount = 100;

    for (let i = 0; i < snowflakeCount; i++) {
      snowflakes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 1 + 0.5,
        opacity: Math.random() * 0.5 + 0.3,
        drift: Math.random() * 0.5 - 0.25,
        isGray: Math.random() > 0.7, // 30% of particles are gray
      });
    }

    // Animation
    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Default to light theme if theme is undefined during initial render
      const isDark = theme === 'dark';

      // Draw shadows first
      snowflakes.forEach((flake) => {
        // Draw the crescent shadow (assuming light from left)
        // Shadow appears on the right side of the particle
        const shadowOffset = flake.size * 0.3;
        ctx.save();
        
        ctx.beginPath();
        ctx.arc(
          flake.x + shadowOffset, 
          flake.y + shadowOffset, 
          flake.size * 0.8, 
          0, 
          Math.PI * 2
        );
        
        if (isDark) {
          ctx.fillStyle = `rgba(0, 0, 0, ${flake.opacity * 0.3})`;
        } else {
          ctx.fillStyle = `rgba(0, 0, 0, ${flake.opacity * 0.4})`;
        }
        ctx.fill();
        ctx.restore();
      });

      // Set shadow properties once for all particles
      ctx.shadowBlur = isDark ? 3 : 2;
      ctx.shadowColor = isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.3)';

      // Draw main particles
      snowflakes.forEach((flake) => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
        
        // Choose color based on theme and particle type
        if (isDark) {
          // In dark theme, keep particles white or light gray
          if (flake.isGray) {
            ctx.fillStyle = `rgba(200, 200, 200, ${flake.opacity})`;
          } else {
            ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
          }
        } else {
          // In light theme, use darker colors for visibility
          if (flake.isGray) {
            ctx.fillStyle = `rgba(100, 100, 100, ${flake.opacity})`;
          } else {
            ctx.fillStyle = `rgba(220, 220, 220, ${flake.opacity})`;
          }
        }
        
        ctx.fill();
        ctx.restore();

        // Update position
        flake.y += flake.speed;
        flake.x += flake.drift;

        // Reset snowflake if it goes off screen
        if (flake.y > canvas.height) {
          flake.y = -10;
          flake.x = Math.random() * canvas.width;
        }

        if (flake.x > canvas.width) {
          flake.x = 0;
        } else if (flake.x < 0) {
          flake.x = canvas.width;
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
    />
  );
};

export default SnowParticles;
