import { useEffect, useRef, useState } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  baseOpacity: number;
  parallaxFactor: number;
}

interface Planet {
  x: number;
  y: number;
  size: number;
  color: string;
  orbitSpeed: number;
  orbitRadius: number;
  angle: number;
}

interface Rocket {
  x: number;
  y: number;
  size: number;
  speed: number;
  angle: number;
  trailLength: number;
}

interface TieFighter {
  x: number;
  y: number;
  size: number;
  speed: number;
  direction: number;
}

const SpaceElements = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const starsRef = useRef<Star[]>([]);
  const planetsRef = useRef<Planet[]>([]);
  const rocketsRef = useRef<Rocket[]>([]);
  const tieFightersRef = useRef<TieFighter[]>([]);

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
        initializeElements();
      }
    };

    const initializeElements = () => {
      // Initialize stars (cursor-reactive)
      if (starsRef.current.length === 0) {
        const starCount = 150;
        starsRef.current = Array.from({ length: starCount }, () => ({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2.5 + 0.5,
          opacity: Math.random() * 0.5 + 0.5,
          twinkleSpeed: Math.random() * 0.02 + 0.01,
          baseOpacity: Math.random() * 0.5 + 0.5,
          parallaxFactor: Math.random() * 0.05 + 0.01,
        }));
      }

      // Initialize planets
      if (planetsRef.current.length === 0) {
        planetsRef.current = [
          {
            x: canvas.width * 0.15,
            y: canvas.height * 0.2,
            size: 60,
            color: 'rgba(255, 140, 0, 0.3)',
            orbitSpeed: 0.001,
            orbitRadius: 30,
            angle: 0,
          },
          {
            x: canvas.width * 0.8,
            y: canvas.height * 0.7,
            size: 80,
            color: 'rgba(100, 150, 255, 0.25)',
            orbitSpeed: 0.0008,
            orbitRadius: 40,
            angle: Math.PI,
          },
          {
            x: canvas.width * 0.5,
            y: canvas.height * 0.1,
            size: 40,
            color: 'rgba(200, 100, 255, 0.2)',
            orbitSpeed: 0.0012,
            orbitRadius: 20,
            angle: Math.PI / 2,
          },
        ];
      }

      // Initialize rockets
      if (rocketsRef.current.length === 0) {
        rocketsRef.current = [
          {
            x: -50,
            y: canvas.height * 0.3,
            size: 20,
            speed: 1.5,
            angle: 0.1,
            trailLength: 30,
          },
          {
            x: canvas.width + 50,
            y: canvas.height * 0.7,
            size: 18,
            speed: 1.2,
            angle: Math.PI - 0.2,
            trailLength: 25,
          },
        ];
      }

      // Initialize TIE Fighters (Star Wars element)
      if (tieFightersRef.current.length === 0) {
        tieFightersRef.current = [
          {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height * 0.5,
            size: 15,
            speed: 0.8,
            direction: 1,
          },
          {
            x: Math.random() * canvas.width,
            y: canvas.height * 0.8 + Math.random() * canvas.height * 0.2,
            size: 12,
            speed: 1.0,
            direction: -1,
          },
        ];
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation
    let animationFrameId: number;
    let frame = 0;

    const drawStar = (star: Star, mouseX: number, mouseY: number) => {
      // Calculate distance from mouse for reactivity
      const dx = star.x - mouseX;
      const dy = star.y - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxDistance = 200;
      
      // Star reacts to cursor proximity
      const reactivity = Math.max(0, 1 - distance / maxDistance);
      const size = star.size * (1 + reactivity * 1.5);
      
      // Twinkling effect
      star.opacity = star.baseOpacity + Math.sin(frame * star.twinkleSpeed) * 0.3;
      
      // Enhanced opacity near cursor
      const finalOpacity = Math.min(1, star.opacity + reactivity * 0.5);

      ctx.save();
      ctx.fillStyle = `rgba(255, 255, 255, ${finalOpacity})`;
      ctx.shadowBlur = size * 2;
      ctx.shadowColor = `rgba(255, 255, 255, ${finalOpacity})`;
      
      // Draw star as a plus shape for variety
      if (star.size > 1.5) {
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          const angle = (Math.PI / 2) * i;
          const x = star.x + Math.cos(angle) * size;
          const y = star.y + Math.sin(angle) * size;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(star.x, star.y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.restore();
    };

    const drawPlanet = (planet: Planet) => {
      // Gentle orbit animation
      planet.angle += planet.orbitSpeed;
      const offsetX = Math.cos(planet.angle) * planet.orbitRadius;
      const offsetY = Math.sin(planet.angle) * planet.orbitRadius;

      ctx.save();
      ctx.fillStyle = planet.color;
      ctx.shadowBlur = planet.size * 0.5;
      ctx.shadowColor = planet.color;
      ctx.beginPath();
      ctx.arc(planet.x + offsetX, planet.y + offsetY, planet.size, 0, Math.PI * 2);
      ctx.fill();

      // Add ring to some planets
      if (planet.size > 60) {
        ctx.strokeStyle = planet.color.replace('0.25', '0.15');
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(
          planet.x + offsetX,
          planet.y + offsetY,
          planet.size * 1.5,
          planet.size * 0.3,
          Math.PI / 6,
          0,
          Math.PI * 2
        );
        ctx.stroke();
      }

      ctx.restore();
    };

    const drawRocket = (rocket: Rocket) => {
      rocket.x += Math.cos(rocket.angle) * rocket.speed;
      rocket.y += Math.sin(rocket.angle) * rocket.speed;

      // Reset position when off screen
      if (rocket.x > canvas.width + 100) {
        rocket.x = -50;
        rocket.y = Math.random() * canvas.height;
      } else if (rocket.x < -100) {
        rocket.x = canvas.width + 50;
        rocket.y = Math.random() * canvas.height;
      }

      ctx.save();
      ctx.translate(rocket.x, rocket.y);
      ctx.rotate(rocket.angle);

      // Trail
      const gradient = ctx.createLinearGradient(-rocket.trailLength, 0, 0, 0);
      gradient.addColorStop(0, 'rgba(255, 100, 0, 0)');
      gradient.addColorStop(0.5, 'rgba(255, 150, 0, 0.3)');
      gradient.addColorStop(1, 'rgba(255, 200, 0, 0.6)');
      ctx.fillStyle = gradient;
      ctx.fillRect(-rocket.trailLength, -rocket.size * 0.3, rocket.trailLength, rocket.size * 0.6);

      // Rocket body
      ctx.fillStyle = '#e0e0e0';
      ctx.beginPath();
      ctx.moveTo(rocket.size, 0);
      ctx.lineTo(-rocket.size * 0.5, -rocket.size * 0.4);
      ctx.lineTo(-rocket.size * 0.5, rocket.size * 0.4);
      ctx.closePath();
      ctx.fill();

      // Rocket window
      ctx.fillStyle = 'rgba(100, 150, 255, 0.8)';
      ctx.beginPath();
      ctx.arc(rocket.size * 0.3, 0, rocket.size * 0.3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const drawTieFighter = (tieFighter: TieFighter) => {
      tieFighter.x += tieFighter.speed * tieFighter.direction;

      // Reset position when off screen
      if (tieFighter.x > canvas.width + 50) {
        tieFighter.x = -50;
        tieFighter.y = Math.random() * canvas.height;
      } else if (tieFighter.x < -50) {
        tieFighter.x = canvas.width + 50;
        tieFighter.y = Math.random() * canvas.height;
      }

      ctx.save();
      ctx.translate(tieFighter.x, tieFighter.y);
      if (tieFighter.direction < 0) {
        ctx.scale(-1, 1);
      }

      // Draw TIE Fighter (simplified iconic shape)
      const size = tieFighter.size;

      // Wings (hexagonal panels)
      ctx.fillStyle = 'rgba(80, 80, 80, 0.6)';
      ctx.strokeStyle = 'rgba(120, 120, 120, 0.8)';
      ctx.lineWidth = 1;

      // Left wing
      ctx.beginPath();
      ctx.rect(-size * 1.5, -size * 0.8, size * 0.4, size * 1.6);
      ctx.fill();
      ctx.stroke();

      // Right wing
      ctx.beginPath();
      ctx.rect(size * 1.1, -size * 0.8, size * 0.4, size * 1.6);
      ctx.fill();
      ctx.stroke();

      // Cockpit (sphere)
      ctx.fillStyle = 'rgba(60, 60, 60, 0.7)';
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.5, 0, Math.PI * 2);
      ctx.fill();

      // Window
      ctx.fillStyle = 'rgba(100, 150, 200, 0.4)';
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      // Draw stars with cursor reactivity
      starsRef.current.forEach((star) => {
        // Apply parallax based on mouse movement
        const parallaxX = (mousePosition.x - canvas.width / 2) * star.parallaxFactor;
        const parallaxY = (mousePosition.y - canvas.height / 2) * star.parallaxFactor;
        
        const tempStar = {
          ...star,
          x: star.x - parallaxX,
          y: star.y - parallaxY,
        };
        
        drawStar(tempStar, mousePosition.x, mousePosition.y);
      });

      // Draw planets
      planetsRef.current.forEach(drawPlanet);

      // Draw rockets
      rocketsRef.current.forEach(drawRocket);

      // Draw TIE Fighters
      tieFightersRef.current.forEach(drawTieFighter);

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []); // Remove mousePosition dependency to avoid re-initialization

  return (
    <>
      {/* Space canvas with stars, planets, rockets, and TIE fighters */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[5]"
      />

      {/* Death Star (Star Wars element) - positioned in corner */}
      <div className="fixed top-10 right-10 pointer-events-none z-[6] opacity-20 animate-pulse" style={{ animationDuration: '6s' }}>
        <div className="relative w-32 h-32">
          {/* Main sphere */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 shadow-2xl" />
          {/* Superlaser dish */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gray-500 border-2 border-gray-400" />
          {/* Equatorial trench */}
          <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-700 -translate-y-1/2" />
          {/* Surface details */}
          <div className="absolute top-4 left-4 w-3 h-3 bg-gray-500 rounded" />
          <div className="absolute bottom-6 right-6 w-2 h-2 bg-gray-500 rounded" />
          <div className="absolute top-8 right-8 w-4 h-1 bg-gray-600" />
        </div>
      </div>

      {/* Nebula effect at the edges */}
      <div className="fixed inset-0 pointer-events-none z-[4]">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-pink-500/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />
      </div>
    </>
  );
};

export default SpaceElements;
