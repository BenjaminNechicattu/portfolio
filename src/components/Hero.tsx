import { useScrollReveal } from '@/utils/animations';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Download } from 'lucide-react';
import { isFestiveSeasonActive } from '@/utils/festive';
import NewYearCountdown from './NewYearCountdown';

const Hero = () => {
  const { ref, isIntersecting } = useScrollReveal();
  const showFestiveTheme = isFestiveSeasonActive();

  return (
    <section 
      id="hero" 
      className="min-h-screen flex flex-col justify-center relative overflow-hidden"
      ref={ref}
    >
      {/* Background gradient circles */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-100 dark:bg-blue-900/20 rounded-full filter blur-3xl opacity-30 animate-pulse" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-100 dark:bg-purple-900/20 rounded-full filter blur-3xl opacity-30 animate-pulse" />
      
      <div className="absolute top-20 right-4">
        <span className="inline-block tex6 sxs font-medium tracking-wider uppercase">
          <img 
        src="https://camo.githubusercontent.com/35761d431dc488b7c55fb41896a02b2a55986cfdf149abf22c47ae1024e99a4e/68747470733a2f2f6b6f6d617265762e636f6d2f67687076632f3f757365726e616d653d62656e6e65636869266c6162656c3d56697369746f727326636f6c6f723d306537356236267374796c653d666c6174" 
        alt="visitor count" 
        className="h-4"
          />
        </span>
      </div>

      <div className="section-container relative z-10">
        <div 
          className={cn(
            "max-w-3xl mx-auto text-center appear-animation",
            isIntersecting ? "opacity-100" : "opacity-0"
          )}
        >
          {/* Profile Image */}
          <div className="mb-8 flex justify-center">
            <Avatar className="h-40 w-40 border-4 border-background shadow-xl">
              <AvatarImage 
                src="/img/me2.png" 
                alt="Benjamin G Nechicattu" 
              />
              <AvatarFallback>BEN</AvatarFallback>
            </Avatar>
          </div>
          
          <div className="mb-6 inline-block">
              <span className="inline-block px-3 py-1 text-xs font-medium tracking-wider uppercase rounded-full bg-secondary text-secondary-foreground">
              Software Engineer
              </span>
            </div>
          
          <h1 className="mb-6 text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Benjamin G Nechicattu
          </h1>
          
          <p className="mb-10 text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Building innovative software solutions at International Business Machines (IBM). 
            Passionate about technology and creating impactful products. A Tech and Science enthusiast, always looking for opertunities.
            </p>
          
          {showFestiveTheme && (
            <div className="mb-8 flex justify-center">
              <NewYearCountdown />
            </div>
          )}
          
          <div className="flex flex-row justify-center items-center space-x-4">
            <a 
              href="#contact" 
              className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-medium transition-all duration-300 hover:shadow-lg focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Get in Touch
            </a>
            <button 
              onClick={() => {
                const link = document.createElement('a');
                link.href = '/resume.pdf';
                link.download = 'Benjamin_Nechicattu_Resume.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="px-8 py-3 rounded-lg bg-secondary text-secondary-foreground font-medium transition-all duration-300 hover:shadow hover:bg-secondary/80 focus:ring-2 focus:ring-offset-2 focus:ring-secondary flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Resume
            </button>
            <a 
              href="#about" 
              className="px-8 py-3 rounded-lg bg-secondary text-secondary-foreground font-medium transition-all duration-300 hover:shadow hover:bg-secondary/80 focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 w-full flex justify-center">
        <div className="flex flex-col items-center space-y-1 animate-bounce">
          <span className="text-sm text-muted-foreground">Scroll</span>
          <svg 
            className="w-6 h-6 text-muted-foreground" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Hero;
