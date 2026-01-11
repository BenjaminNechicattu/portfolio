import { useEffect, useRef, useState } from 'react';

interface MatrixChar {
  x: number;
  y: number;
  char: string;
  speed: number;
  opacity: number;
  fadeSpeed: number;
}

interface CircuitNode {
  x: number;
  y: number;
  size: number;
  pulse: number;
  pulseSpeed: number;
  connectedTo: number[];
}

interface BinaryStream {
  x: number;
  y: number;
  bits: string;
  speed: number;
  opacity: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

const CyberElements = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const matrixCharsRef = useRef<MatrixChar[]>([]);
  const circuitNodesRef = useRef<CircuitNode[]>([]);
  const binaryStreamsRef = useRef<BinaryStream[]>([]);
  const particlesRef = useRef<Particle[]>([]);

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
      // Initialize matrix rain characters (cursor-reactive)
      if (matrixCharsRef.current.length === 0) {
        const columns = Math.floor(canvas.width / 20);
        matrixCharsRef.current = Array.from({ length: columns }, (_, i) => ({
          x: i * 20,
          y: Math.random() * canvas.height,
          char: String.fromCharCode(0x30A0 + Math.random() * 96), // Japanese katakana
          speed: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.3,
          fadeSpeed: Math.random() * 0.02 + 0.01,
        }));
      }

      // Initialize circuit nodes
      if (circuitNodesRef.current.length === 0) {
        const nodeCount = 8;
        for (let i = 0; i < nodeCount; i++) {
          circuitNodesRef.current.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 4 + 3,
            pulse: Math.random() * Math.PI * 2,
            pulseSpeed: Math.random() * 0.02 + 0.01,
            connectedTo: [],
          });
        }

        // Create connections between nearby nodes
        circuitNodesRef.current.forEach((node, i) => {
          const nearbyNodes = circuitNodesRef.current
            .map((n, idx) => ({ node: n, idx }))
            .filter(({ node: n, idx }) => {
              const dist = Math.hypot(node.x - n.x, node.y - n.y);
              return idx !== i && dist < 200;
            })
            .slice(0, 3);
          
          node.connectedTo = nearbyNodes.map(({ idx }) => idx);
        });
      }

      // Initialize binary streams
      if (binaryStreamsRef.current.length === 0) {
        const streamCount = 15;
        binaryStreamsRef.current = Array.from({ length: streamCount }, () => ({
          x: Math.random() * canvas.width,
          y: -Math.random() * 100,
          bits: Array.from({ length: 8 }, () => Math.random() > 0.5 ? '1' : '0').join(''),
          speed: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.4 + 0.2,
        }));
      }

      // Initialize floating particles
      if (particlesRef.current.length === 0) {
        const particleCount = 30;
        particlesRef.current = Array.from({ length: particleCount }, () => ({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
          color: Math.random() > 0.5 ? 'rgba(0, 255, 255, 0.6)' : 'rgba(0, 200, 255, 0.5)',
        }));
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

    const drawMatrixChar = (char: MatrixChar, mouseX: number, mouseY: number) => {
      // Calculate distance from mouse for reactivity
      const dx = char.x - mouseX;
      const dy = char.y - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxDistance = 150;
      
      // Character reacts to cursor proximity
      const reactivity = Math.max(0, 1 - distance / maxDistance);
      const brighten = reactivity * 0.5;
      
      // Cycling characters
      if (Math.random() < 0.05) {
        char.char = String.fromCharCode(0x30A0 + Math.random() * 96);
      }

      ctx.save();
      ctx.font = '16px monospace';
      ctx.fillStyle = `rgba(0, 255, 200, ${char.opacity + brighten})`;
      ctx.shadowBlur = reactivity * 10;
      ctx.shadowColor = 'rgba(0, 255, 200, 0.8)';
      ctx.fillText(char.char, char.x, char.y);
      ctx.restore();
    };

    const drawCircuitNode = (node: CircuitNode, idx: number) => {
      // Update pulse
      node.pulse += node.pulseSpeed;
      const pulseSize = node.size + Math.sin(node.pulse) * 2;

      ctx.save();
      
      // Draw connections to other nodes
      ctx.strokeStyle = `rgba(0, 255, 255, 0.3)`;
      ctx.lineWidth = 1;
      node.connectedTo.forEach((connectedIdx) => {
        const connectedNode = circuitNodesRef.current[connectedIdx];
        if (connectedNode) {
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(connectedNode.x, connectedNode.y);
          ctx.stroke();
          
          // Add pulse effect on connection
          const pulsePos = (frame * 0.02) % 1;
          const pulseX = node.x + (connectedNode.x - node.x) * pulsePos;
          const pulseY = node.y + (connectedNode.y - node.y) * pulsePos;
          
          ctx.fillStyle = 'rgba(0, 255, 255, 0.8)';
          ctx.beginPath();
          ctx.arc(pulseX, pulseY, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw node
      ctx.fillStyle = 'rgba(0, 200, 255, 0.7)';
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(0, 255, 255, 0.8)';
      ctx.beginPath();
      ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2);
      ctx.fill();

      // Draw inner core
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.beginPath();
      ctx.arc(node.x, node.y, pulseSize * 0.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const drawBinaryStream = (stream: BinaryStream) => {
      ctx.save();
      ctx.font = '12px monospace';
      ctx.fillStyle = `rgba(0, 255, 150, ${stream.opacity})`;
      ctx.shadowBlur = 5;
      ctx.shadowColor = 'rgba(0, 255, 150, 0.5)';
      ctx.fillText(stream.bits, stream.x, stream.y);
      ctx.restore();

      // Update position
      stream.y += stream.speed;

      // Reset if off screen
      if (stream.y > canvas.height + 20) {
        stream.y = -20;
        stream.x = Math.random() * canvas.width;
        stream.bits = Array.from({ length: 8 }, () => Math.random() > 0.5 ? '1' : '0').join('');
      }
    };

    const drawParticle = (particle: Particle) => {
      ctx.save();
      ctx.fillStyle = particle.color;
      ctx.shadowBlur = 3;
      ctx.shadowColor = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Bounce off edges
      if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

      // Keep within bounds
      particle.x = Math.max(0, Math.min(canvas.width, particle.x));
      particle.y = Math.max(0, Math.min(canvas.height, particle.y));
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      // Draw matrix rain with cursor reactivity
      matrixCharsRef.current.forEach((char) => {
        drawMatrixChar(char, mousePosition.x, mousePosition.y);
        
        // Update position
        char.y += char.speed;
        
        // Fade effect
        char.opacity = 0.3 + Math.sin(frame * char.fadeSpeed) * 0.3;
        
        // Reset if off screen
        if (char.y > canvas.height) {
          char.y = -20;
        }
      });

      // Draw circuit network
      circuitNodesRef.current.forEach(drawCircuitNode);

      // Draw binary streams
      binaryStreamsRef.current.forEach(drawBinaryStream);

      // Draw floating particles
      particlesRef.current.forEach(drawParticle);

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* Animated canvas with matrix rain, circuits, and particles */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[5]"
      />

      {/* Digital grid overlay */}
      <div className="fixed inset-0 pointer-events-none z-[4] opacity-10">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Glowing orbs in corners */}
      <div className="fixed top-20 left-20 pointer-events-none z-[3]">
        <div className="relative w-40 h-40">
          <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-3xl animate-pulse" style={{ animationDuration: '3s' }} />
          <div className="absolute inset-4 rounded-full bg-cyan-400/30 blur-2xl animate-pulse" style={{ animationDuration: '4s', animationDelay: '0.5s' }} />
        </div>
      </div>

      <div className="fixed bottom-20 right-20 pointer-events-none z-[3]">
        <div className="relative w-40 h-40">
          <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-3xl animate-pulse" style={{ animationDuration: '3.5s' }} />
          <div className="absolute inset-4 rounded-full bg-blue-400/30 blur-2xl animate-pulse" style={{ animationDuration: '4.5s', animationDelay: '0.7s' }} />
        </div>
      </div>

      {/* Scanning line effect */}
      <div className="fixed inset-0 pointer-events-none z-[6] overflow-hidden">
        <div 
          className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent animate-scan"
          style={{
            boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)',
          }}
        />
      </div>

      {/* Hexagonal tech pattern in corners */}
      <div className="fixed top-0 right-0 pointer-events-none z-[3] opacity-20">
        <svg width="200" height="200" viewBox="0 0 200 200">
          <defs>
            <pattern id="hexagons" x="0" y="0" width="50" height="43.4" patternUnits="userSpaceOnUse">
              <path 
                d="M25 0 L50 14.43 L50 28.87 L25 43.3 L0 28.87 L0 14.43 Z" 
                fill="none" 
                stroke="rgba(0, 255, 255, 0.3)" 
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="200" height="200" fill="url(#hexagons)" />
        </svg>
      </div>

      <div className="fixed bottom-0 left-0 pointer-events-none z-[3] opacity-20">
        <svg width="200" height="200" viewBox="0 0 200 200">
          <rect width="200" height="200" fill="url(#hexagons)" />
        </svg>
      </div>

      {/* HUD-style corner brackets */}
      <div className="fixed top-0 left-0 pointer-events-none z-[7] p-4">
        <svg width="60" height="60" className="text-cyan-500/50">
          <line x1="0" y1="20" x2="0" y2="0" stroke="currentColor" strokeWidth="2" />
          <line x1="0" y1="0" x2="20" y2="0" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      <div className="fixed top-0 right-0 pointer-events-none z-[7] p-4">
        <svg width="60" height="60" className="text-cyan-500/50">
          <line x1="60" y1="20" x2="60" y2="0" stroke="currentColor" strokeWidth="2" />
          <line x1="60" y1="0" x2="40" y2="0" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      <div className="fixed bottom-0 left-0 pointer-events-none z-[7] p-4">
        <svg width="60" height="60" className="text-cyan-500/50">
          <line x1="0" y1="40" x2="0" y2="60" stroke="currentColor" strokeWidth="2" />
          <line x1="0" y1="60" x2="20" y2="60" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      <div className="fixed bottom-0 right-0 pointer-events-none z-[7] p-4">
        <svg width="60" height="60" className="text-cyan-500/50">
          <line x1="60" y1="40" x2="60" y2="60" stroke="currentColor" strokeWidth="2" />
          <line x1="60" y1="60" x2="40" y2="60" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>
    </>
  );
};

export default CyberElements;
