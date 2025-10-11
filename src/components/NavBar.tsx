import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const isScrolled = scrollY > 10;

      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }

      // Determine active section
      if (location.pathname === '/') {
        const sections = ['hero', 'about', 'experience', 'skills', 'projects', 'contact'];
        for (const section of [...sections].reverse()) {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= 100) {
              setActiveSection(section);
              break;
            }
          }
        }
      } else if (location.pathname === '/blog') {
        setActiveSection('blog');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled, location.pathname]);

  const handleNavigation = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          window.scrollTo({
            top: element.offsetTop - 80,
            behavior: 'smooth',
          });
        }
      }, 100); // Delay to ensure the page has loaded
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        window.scrollTo({
          top: element.offsetTop - 80,
          behavior: 'smooth',
        });
      }
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-apple py-4",
        scrolled ? "bg-white/70 dark:bg-black/70 backdrop-blur-md shadow-sm" : "bg-white/30 dark:bg-black/30 backdrop-blur-md"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-lg font-medium tracking-tight">Benjamin G Nechicattu</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {[
              { id: 'hero', label: 'Home' },
              { id: 'about', label: 'About' },
              { id: 'experience', label: 'Experience' },
              { id: 'skills', label: 'Skills' },
              { id: 'projects', label: 'Projects' },
              { id: 'contact', label: 'Contact' },
              { id: 'blog', label: 'Blog', path: '/blog' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => item.path ? navigate(item.path) : handleNavigation(item.id)}
                className={cn(
                  "text-sm font-medium px-2 py-1 rounded-md transition-all duration-300 relative",
                  activeSection === item.id
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground transition-all duration-300"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            
            <div className="md:hidden">
              <button onClick={toggleMenu} className="p-2">
                <span className="sr-only">Open menu</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <nav className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {[
              { id: 'hero', label: 'Home' },
              { id: 'about', label: 'About' },
              { id: 'experience', label: 'Experience' },
              { id: 'skills', label: 'Skills' },
              { id: 'projects', label: 'Projects' },
              { id: 'contact', label: 'Contact' },
              { id: 'blog', label: 'Blog', path: '/blog' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => item.path ? navigate(item.path) : handleNavigation(item.id)}
                className="block text-gray-900 dark:text-white px-3 py-2 rounded-md text-base font-medium"
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default NavBar;