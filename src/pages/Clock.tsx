import { useEffect } from 'react';
import NavBar from '@/components/NavBar';
import ModernClock from '@/components/ModernClock';

const Clock = () => {
  useEffect(() => {
    document.title = "Clock Modern Way | Benjamin G Nechicattu";
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-light text-center mb-8 mt-8 italic">
            Clock Modern Way
          </h1>
          <ModernClock />
        </div>
      </main>
    </div>
  );
};

export default Clock;
