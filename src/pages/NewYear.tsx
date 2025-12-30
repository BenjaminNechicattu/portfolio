import { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Sparkles, Home, ArrowDown } from 'lucide-react';

// Firework particle interface
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
}

const NewYear = () => {
  const navigate = useNavigate();
  const { name } = useParams<{ name?: string }>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Particle[]>([]);
  
  // Puzzle game state
  const [tiles, setTiles] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);

  // Base64 encoded special name
  const specialUserEncoded = "Sm9zbWk=";
  
  // Decode and check for special user (memoized)
  const decodedSpecialName = useMemo(() => {
    try {
      return atob(specialUserEncoded);
    } catch {
      return "";
    }
  }, []);

  // Decode the name from URL parameter (it's base64 encoded)
  const decodedName = useMemo(() => {
    if (!name) return "";
    try {
      const decoded = atob(name);
      // Capitalize the first letter of the name
      return decoded.length > 0 ? decoded.charAt(0).toUpperCase() + decoded.slice(1) : decoded;
    } catch (error) {
      // If decoding fails, log error and return empty string
      console.error("Failed to decode base64 name from URL:", name, error);
      return "";
    }
  }, [name]);

  const isSpecialUser = decodedName && decodedName.toLowerCase() === decodedSpecialName.toLowerCase();

  // Get personalized message
  const getWishMessage = () => {
    if (isSpecialUser) {
      return {
        title: `Happy New Year ${decodedName}!`,
        message: "Wishing you a year filled with joy, success, and endless possibilities! May this new year bring you happiness, health, and prosperity. Of all the people I met this year, Joz, you're the one who stayed on my mind the most. I hope the new year brings you happiness… and I hope it gives me more moments with you. 😊"
      };
    } else if (decodedName) {
      return {
        title: `Happy New Year ${decodedName}!`,
        message: "Wishing you a year filled with joy, success, and endless possibilities! May this new year bring you happiness, health, and prosperity."
      };
    } else {
      return {
        title: "Happy New Year!",
        message: "Wishing you a year filled with joy, success, and endless possibilities! May this new year bring you happiness, health, and prosperity."
      };
    }
  };

  const wishMessage = getWishMessage();

  // Initialize puzzle
  useEffect(() => {
    const shuffled = shufflePuzzle();
    setTiles(shuffled);
  }, []);

  const shufflePuzzle = () => {
    // Start with solved state and make random valid moves to ensure solvability
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 0];
    
    // Make 100 random valid moves from the solved state
    let emptyIndex = 8;
    for (let i = 0; i < 100; i++) {
      const row = Math.floor(emptyIndex / 3);
      const col = emptyIndex % 3;
      const validMoves = [];
      
      // Check all four directions
      if (row > 0) validMoves.push(emptyIndex - 3); // up
      if (row < 2) validMoves.push(emptyIndex + 3); // down
      if (col > 0) validMoves.push(emptyIndex - 1); // left
      if (col < 2) validMoves.push(emptyIndex + 1); // right
      
      // Pick a random valid move
      const moveIndex = validMoves[Math.floor(Math.random() * validMoves.length)];
      [numbers[emptyIndex], numbers[moveIndex]] = [numbers[moveIndex], numbers[emptyIndex]];
      emptyIndex = moveIndex;
    }
    
    return numbers;
  };

  const checkWin = (currentTiles: number[]) => {
    return currentTiles.every((tile, index) => tile === (index + 1) % 9);
  };

  const moveTile = (index: number) => {
    const emptyIndex = tiles.indexOf(0);
    const row = Math.floor(index / 3);
    const col = index % 3;
    const emptyRow = Math.floor(emptyIndex / 3);
    const emptyCol = emptyIndex % 3;

    // Check if move is valid (adjacent to empty tile)
    if (
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow)
    ) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
      setTiles(newTiles);
      setMoves(moves + 1);
      
      if (checkWin(newTiles)) {
        setIsWon(true);
      }
    }
  };

  // Cursor tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Fireworks effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let localParticles: Particle[] = [];

    const createFirework = (x: number, y: number) => {
      const colors = ['#FF1461', '#18FF92', '#5A87FF', '#FBF38C', '#FF6B6B'];
      const particleCount = 50;

      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = Math.random() * 3 + 2;
        
        localParticles.push({
          x,
          y,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          alpha: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 30, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      localParticles = localParticles.filter((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.1; // gravity
        particle.alpha -= 0.01;

        if (particle.alpha > 0) {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = particle.color;
          ctx.globalAlpha = particle.alpha;
          ctx.fill();
          return true;
        }
        return false;
      });

      ctx.globalAlpha = 1;
      requestAnimationFrame(animate);
    };

    animate();

    // Random fireworks
    const interval = setInterval(() => {
      const x = Math.random() * canvas.width;
      const y = Math.random() * (canvas.height / 2);
      createFirework(x, y);
    }, 1000);

    // Cursor fireworks
    const handleClick = (e: MouseEvent) => {
      createFirework(e.clientX, e.clientY);
    };

    canvas.addEventListener('click', handleClick);

    return () => {
      clearInterval(interval);
      canvas.removeEventListener('click', handleClick);
    };
  }, []);

  // Set page title
  useEffect(() => {
    document.title = "🎉 Happy New Year! 🎊";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Fireworks canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-auto cursor-pointer z-0"
      />

      {/* Cursor glow effect */}
      <div
        className="fixed w-64 h-64 rounded-full bg-gradient-to-r from-yellow-400 to-pink-400 opacity-20 blur-3xl pointer-events-none z-10"
        style={{
          left: cursorPosition.x - 128,
          top: cursorPosition.y - 128,
          transition: 'left 0.1s, top 0.1s',
        }}
      />

      {/* Content */}
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center p-8 pointer-events-none">
        {/* Home button */}
        <button
          onClick={() => navigate('/')}
          className="fixed top-8 left-8 px-6 py-3 bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-white/20 transition-all duration-300 flex items-center gap-2 border border-white/20 pointer-events-auto"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </button>

        {/* Main content */}
        <div className="text-center mb-12 animate-fade-in pointer-events-auto">
          <div className="flex justify-center mb-6">
            <Sparkles className="w-16 h-16 text-yellow-300 animate-pulse" />
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 animate-bounce-slow">
            🎊 {wishMessage.title} 🎉
          </h1>
          
          <p className="text-2xl md:text-4xl text-white/90 mb-4">
            {new Date().getFullYear()}
          </p>
          
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            {wishMessage.message}
          </p>

          <div className="mt-8 text-white/70 text-sm">
            <p>✨ Click anywhere to create fireworks! ✨</p>
          </div>


        </div>

        {/* Scroll indicator at bottom */}
        <div className="absolute bottom-10 w-full flex justify-center pointer-events-none">
          <div className="flex flex-col items-center animate-bounce">
            <ArrowDown className="w-6 h-6 text-white/80" />
          </div>
        </div>
      </div>

      {/* Puzzle Game Section */}
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center p-8 pointer-events-none">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 max-w-md w-full pointer-events-auto">
          <h2 className="text-3xl font-bold text-white mb-4 text-center">
            🎮 New Year Puzzle
          </h2>
          <p className="text-white/80 text-center mb-6">
            Arrange the tiles in order (1-8)! Moves: {moves}
          </p>

          {isWon && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-center">
              <p className="text-white font-bold text-xl">🎉 Congratulations! 🎉</p>
              <p className="text-white/80">You solved it in {moves} moves!</p>
              <button
                onClick={() => {
                  setTiles(shufflePuzzle());
                  setMoves(0);
                  setIsWon(false);
                }}
                className="mt-4 px-6 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all"
              >
                Play Again
              </button>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2">
            {tiles.map((tile, index) => (
              <button
                key={index}
                onClick={() => moveTile(index)}
                disabled={tile === 0 || isWon}
                className={`
                  aspect-square rounded-xl text-3xl font-bold transition-all duration-200
                  ${tile === 0 
                    ? 'bg-transparent' 
                    : 'bg-gradient-to-br from-blue-400 to-purple-500 text-white hover:scale-105 hover:shadow-lg active:scale-95'
                  }
                  ${isWon ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}
                `}
              >
                {tile !== 0 && tile}
              </button>
            ))}
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setTiles(shufflePuzzle());
                setMoves(0);
                setIsWon(false);
              }}
              className="px-6 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all"
            >
              Reset Puzzle
            </button>
          </div>
        </div>
      </div>

      {/* Custom styles */}
      <style>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
};

export default NewYear;
