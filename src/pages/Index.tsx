
import { useEffect } from 'react';
import NavBar from '@/components/NavBar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Experience from '@/components/Experience';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import SnowParticles from '@/components/SnowParticles';
import ForestElements from '@/components/ForestElements';
import FlyingInsects from '@/components/FlyingInsects';
import SpaceElements from '@/components/SpaceElements';
import { isFestiveSeasonActive } from '@/utils/festive';
import { useCustomTheme } from '@/contexts/CustomThemeContext';

const Index = () => {
  const { customTheme } = useCustomTheme();
  
  // Set metadata and title
  useEffect(() => {
    document.title = "Benjamin G Nechicattu | Software Engineer";
  }, []);

  const showFestiveTheme = isFestiveSeasonActive();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {showFestiveTheme && <SnowParticles />}
      {customTheme === 'nature' && (
        <>
          <ForestElements />
          <FlyingInsects />
        </>
      )}
      {customTheme === 'space' && <SpaceElements />}
      <NavBar />
      <main>
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
