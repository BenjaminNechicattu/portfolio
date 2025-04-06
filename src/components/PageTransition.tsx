import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transitionStage, setTransitionStage] = useState<'fade-in' | 'fade-out' | 'idle'>('fade-in');
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    setTransitionStage('fade-out');
    setTimeout(() => {
      navigate(path);
      setTransitionStage('fade-in');
    }, 500); // Match the duration of the CSS transition
  };

  useEffect(() => {
    const links = document.querySelectorAll('a');
    links.forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = (e.target as HTMLAnchorElement).getAttribute('href');
        if (href && href.startsWith('/')) {
          e.preventDefault();
          handleNavigate(href);
        }
      });
    });

    return () => {
      links.forEach((link) => {
        link.removeEventListener('click', () => {});
      });
    };
  }, []);

  return (
    <div className={`page-transition ${transitionStage}`}>
      {children}
    </div>
  );
};

export default PageTransition;