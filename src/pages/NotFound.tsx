import { Link, useLocation } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Home, Rocket } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Generate stable random values for stars
  const stars = useMemo(() => {
    return [...Array(50)].map(() => ({
      width: Math.random() * 3 + 1,
      height: Math.random() * 3 + 1,
      top: Math.random() * 100,
      left: Math.random() * 100,
      animationDelay: Math.random() * 3,
      animationDuration: Math.random() * 3 + 2,
    }));
  }, []);

  // Generate stable random values for shooting stars
  const shootingStars = useMemo(() => {
    return [...Array(3)].map((_, i) => ({
      top: Math.random() * 50,
      animationDuration: Math.random() * 3 + 2,
      animationDelay: i * 2,
    }));
  }, []);

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
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Animated stars background */}
      <div className="absolute inset-0">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-foreground/30 animate-pulse"
            style={{
              width: `${star.width}px`,
              height: `${star.height}px`,
              top: `${star.top}%`,
              left: `${star.left}%`,
              animationDelay: `${star.animationDelay}s`,
              animationDuration: `${star.animationDuration}s`,
            }}
          />
        ))}
      </div>

      {/* Background gradient circles - matching Hero component */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-100 dark:bg-blue-900/20 rounded-full filter blur-3xl opacity-30 animate-pulse" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-100 dark:bg-purple-900/20 rounded-full filter blur-3xl opacity-30 animate-pulse" />

      {/* Floating planets */}
      <div
        className="absolute top-20 left-1/4 w-32 h-32 rounded-full bg-primary/20 blur-sm animate-bounce"
        style={{
          animationDuration: "6s",
          transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
          transition: "transform 0.2s ease-out",
        }}
      />
      <div
        className="absolute bottom-32 right-1/4 w-24 h-24 rounded-full bg-primary/10 blur-sm animate-bounce"
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
          {/* Floating rocket icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <Rocket
                className="w-24 h-24 text-foreground animate-bounce"
                style={{ animationDuration: "3s" }}
              />
              <div className="absolute -inset-4 bg-primary/10 rounded-full blur-xl animate-pulse" />
            </div>
          </div>

          {/* 404 Text */}
          <div className="space-y-4">
            <h1 className="text-8xl md:text-9xl font-bold text-foreground">
              404
            </h1>
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
              Lost in Space
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-md mx-auto leading-relaxed">
              Oops! Looks like you've drifted into the cosmic void. The page
              you're looking for doesn't exist in this universe.
            </p>
          </div>

          {/* Call to action */}
          <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/">
              <Button
                size="lg"
                className="px-8 py-3 bg-primary text-primary-foreground hover:shadow-lg transition-all duration-300"
              >
                <Home className="mr-2 h-5 w-5" />
                Return to Home
              </Button>
            </Link>
          </div>

          {/* Fun space fact */}
          <p className="text-sm text-muted-foreground italic mt-12">
            "In space, no one can hear you 404"
          </p>
        </div>
      </div>

      {/* Animated shooting stars */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {shootingStars.map((star, i) => (
          <div
            key={i}
            className="absolute h-0.5 w-12 bg-gradient-to-r from-transparent via-foreground/50 to-transparent"
            style={{
              top: `${star.top}%`,
              left: "-12px",
              animation: `shootingStar ${star.animationDuration}s linear infinite`,
              animationDelay: `${star.animationDelay}s`,
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