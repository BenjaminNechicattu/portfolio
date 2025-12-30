import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Home, Rocket } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [location.pathname]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      {/* Animated stars background */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              width: Math.random() * 3 + 1 + "px",
              height: Math.random() * 3 + 1 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              animationDelay: Math.random() * 3 + "s",
              animationDuration: Math.random() * 3 + 2 + "s",
            }}
          />
        ))}
      </div>

      {/* Floating planets */}
      <div
        className="absolute top-20 left-1/4 w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 opacity-60 blur-sm animate-bounce"
        style={{
          animationDuration: "6s",
          transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
          transition: "transform 0.2s ease-out",
        }}
      />
      <div
        className="absolute bottom-32 right-1/4 w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-pink-600 opacity-50 blur-sm animate-bounce"
        style={{
          animationDuration: "8s",
          animationDelay: "1s",
          transform: `translate(${mousePosition.x * -0.03}px, ${mousePosition.y * -0.03}px)`,
          transition: "transform 0.2s ease-out",
        }}
      />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-8 max-w-2xl">
          {/* Floating astronaut icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <Rocket
                className="w-24 h-24 text-white animate-bounce"
                style={{ animationDuration: "3s" }}
              />
              <div className="absolute -inset-4 bg-white/10 rounded-full blur-xl animate-pulse" />
            </div>
          </div>

          {/* 404 Text */}
          <div className="space-y-4">
            <h1 className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-pulse">
              404
            </h1>
            <h2 className="text-3xl md:text-4xl font-semibold text-white">
              Lost in Space
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-md mx-auto leading-relaxed">
              Oops! Looks like you've drifted into the cosmic void. The page
              you're looking for doesn't exist in this universe.
            </p>
          </div>

          {/* Call to action */}
          <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Home className="mr-2 h-5 w-5" />
                Return to Home
              </Button>
            </Link>
          </div>

          {/* Fun space fact */}
          <p className="text-sm text-gray-400 italic mt-12">
            "In space, no one can hear you 404"
          </p>
        </div>
      </div>

      {/* Animated shooting stars */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute h-0.5 w-12 bg-gradient-to-r from-transparent via-white to-transparent"
            style={{
              top: Math.random() * 50 + "%",
              left: "-12px",
              animation: `shootingStar ${Math.random() * 3 + 2}s linear infinite`,
              animationDelay: `${i * 2}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes shootingStar {
          0% {
            transform: translateX(0) translateY(0);
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: translateX(100vw) translateY(100px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default NotFound;