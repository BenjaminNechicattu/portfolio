import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Brush, Target, Laptop, ImageIcon, CheckCircle2 } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const serviceOptions = [
  {
    id: 'paintings',
    label: 'Painting',
    title: 'Portraits/Paintings/ Art',
    subheading: 'Pencil/Acrylic Art',
    link: 'https://www.instagram.com/shades_and_pixels/',
    description: 'Custom hand-drawn portraits/Acrylic Paintings that turn moments into timeless art. Pencil Carvings. Perfect gift for your loved ones.',
    highlights: [
      'Finished artwork in a premium presentation',
      'Progress and before-after storyboards',
      'Handcrafted color, line, and detail work',
    ],
    packages: [
      'Basic: ₹699 (A5 simple)',
      'Standard: ₹1,499 (A4 detailed)',
      'Premium: ₹4,999+ (ultra-realistic)',
    ],
    extra: 'Perfect for gifts, birthday, weddings',
    visuals: [
      { title: 'Pencil / Charcoal', type: 'image', url: 'https://raw.githubusercontent.com/BenjaminNechicattu/portfolio/refs/heads/main/public/img/svcimg/2.jpg', 
        description: 'Pencil/charcoal drawings. Portraits' },
      { title: 'Quilling', type: 'image', url: 'https://raw.githubusercontent.com/BenjaminNechicattu/portfolio/refs/heads/main/public/img/svcimg/1.jpg',
        description: 'Quilling Names. Framed Art Gifts' },
      { title: 'Acrylic Painting', type: 'image', url: 'https://raw.githubusercontent.com/BenjaminNechicattu/portfolio/refs/heads/main/public/img/svcimg/3.jpg',
        description: 'Acrylic paintings. Detailed and vibrant canvases' },
      { title: 'Pencil Carving', type: 'image', url: 'https://raw.githubusercontent.com/BenjaminNechicattu/portfolio/refs/heads/main/public/img/svcimg/4.jpg',
        description: 'Pencil carvings. Intricate and detailed work' },
      // { title: 'Final portrait', type: 'video', url: 'https://www.instagram.com/reels/DPQo4afAU0A/',description: 'A polished portrait showcasing the final result.' },
    ],
    icon: Brush,
  },
  {
    id: 'design',
    label: 'Designing',
    title: 'Designing / Digital Art',
    subheading: 'Make Your Brand Pop',
    link: 'https://www.behance.net/benjaminnechicattu',
    description: 'Designs that don’t just look good — they make people stop and engage.',
    highlights: [
      'Social posts and reel thumbnails',
      'Branding and logos',
      'Poster and ad layouts',
    ],
    packages: [
      'Social Media Design',
      'Branding and Logo Design',
      'Posters / Ads and campaign visuals',
    ],
    extra: 'Lets match a vibe to your brand',
    visuals: [
      { title: 'UI/UX Design', type: 'image', url: 'https://raw.githubusercontent.com/BenjaminNechicattu/portfolio/refs/heads/main/public/img/svcimg/6.png', 
        description: 'UI/UX Design, match your vibe' },
      { title: 'Brand Identity', type: 'image', url: 'https://raw.githubusercontent.com/BenjaminNechicattu/portfolio/refs/heads/main/public/img/svcimg/7.png',
        description: 'Logo and brand identity designs' },
      { title: 'Ad Design', type: 'image', url: 'https://raw.githubusercontent.com/BenjaminNechicattu/portfolio/refs/heads/main/public/img/svcimg/5.png',
        description: 'Better ad designs for your marketing needs' },
      { title: 'Poster Design', type: 'image', url: '                                                                   ',
        description: 'Eye-catchingdesigns for events, promotions and brand' },
    ],
    icon: Target,
  },
  {
    id: 'dev',
    label: 'Software Development',
    title: 'Software Development',
    subheading: 'Softeware solutions.',
    link: 'https://github.com/BenjaminNechicattu/',
    description: 'Development with a Designer’s Touch. Functional systems that solve real problems — not just pretty code.',
    highlights: [
      'Website development with polished UX',
      'Automation tools to save time and friction',
      'Custom apps, dashboards and product MVPs',
    ],
    packages: [
      'Website Development',
      'Backend Systems and APIs',
      'Full-Stack Services',
    ],
    extra: 'Make your brand available in internet with a stunning website',
    visuals: [
      { title: 'Backend Systems', type: 'image', url: 'https://raw.githubusercontent.com/BenjaminNechicattu/portfolio/refs/heads/main/public/img/svcimg/10.png', 
        description: 'Api development and integrations' },
      { title: 'Web Development', type: 'image', url: 'https://raw.githubusercontent.com/BenjaminNechicattu/portfolio/refs/heads/main/public/img/svcimg/9.png',
        description: 'Stunning websites for your business' },
  
  ],
    icon: Laptop,
  },
];

const getYouTubeEmbedUrl = (url: string) => {
  const cleaned = url.trim();
  if (!cleaned) return '';

  const shortsMatch = /youtube\.com\/shorts\/([^/?&#]+)/i.exec(cleaned);
  const watchMatch = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&/?#]+)/i.exec(cleaned);
  const embedMatch = /youtube\.com\/embed\/([^&/?#]+)/i.exec(cleaned);

  if (embedMatch) return `https://www.youtube.com/embed/${embedMatch[1]}`;
  if (shortsMatch) return `https://www.youtube.com/embed/${shortsMatch[1]}`;
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;

  return '';
};

const getInstagramEmbedUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    const segments = parsed.pathname.split('/').filter(Boolean);
    if (!segments.length) return '';
    const id = segments[segments.length - 1];
    return `https://www.instagram.com/reel/${id}/embed/`;
  } catch {
    return '';
  }
};

const Services = () => {
  const [activeService, setActiveService] = useState(serviceOptions[0].id);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Services | Benjamin G Nechicattu';
  }, []);

  const active = serviceOptions.find((service) => service.id === activeService) ?? serviceOptions[0];

  const scrollToContact = () => {
    const contactElement = document.getElementById('contact');
    if (contactElement) {
      window.scrollTo({
        top: contactElement.offsetTop - 80,
        behavior: 'smooth',
      });
    }
  };

  const handleContactClick = () => {
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(scrollToContact, 120);
    } else {
      scrollToContact();
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />
      <main className="pt-28 pb-20">
        <section className="section-container py-16">
          <div className="mx-auto max-w-5xl text-center">
            <span className="inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-secondary-foreground mb-5">
              Services
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 leading-tight">
              <span
                className={cn(
                  'transition-all duration-300 px-2 py-1 rounded-xl',
                  activeService === 'paintings' && 'text-muted-foreground border-border'
                )}
              >
                Artist
              </span>{' '}
              +{' '}
              <span
                className={cn(
                  'transition-all duration-300 px-2 py-1 rounded-xl',
                  activeService === 'design' && 'text-muted-foreground'
                )}
              >
                Designer
              </span>{' '}
              +{' '}
              <span
                className={cn(
                  'transition-all duration-300 px-2 py-1 rounded-xl',
                  activeService === 'dev' && 'text-muted-foreground'
                )}
              >
                Developer
              </span>{' '}
              = Rare Solutions
            </h1>
            <p className="mx-auto max-w-3xl text-lg text-muted-foreground sm:text-xl">
              Creative + Technical solutions in one place.
            </p>

            <div className="mt-12 flex flex-wrap justify-center gap-4">
              {serviceOptions.map((service) => {
                const Icon = service.icon;
                const isActive = service.id === activeService;
                
                // Define colorful icon classes for each service
                const iconColorStyles: Record<string, { active: string; hover: string }> = {
                  paintings: { active: 'text-red-500', hover: 'group-hover:text-red-500' },
                  design: { active: 'text-blue-500', hover: 'group-hover:text-blue-500' },
                  dev: { active: 'text-green-500', hover: 'group-hover:text-green-500' },
                };
                const colorClasses = iconColorStyles[service.id] || { active: '', hover: '' };
                
                return (
                  <button
                    key={service.id}
                    onClick={() => setActiveService(service.id)}
                    className={cn(
                      'min-w-[180px] rounded-full border px-5 py-3 text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary group',
                      isActive
                        ? 'bg-primary text-primary-foreground border-transparent shadow-lg hover:bg-primary/90'
                        : 'bg-secondary text-secondary-foreground border-border/60 hover:shadow hover:bg-secondary/80'
                    )}
                  >
                    <span className="inline-flex items-center gap-2">
                      <Icon className={cn('h-4 w-4 transition-colors duration-300', isActive && colorClasses.active, colorClasses.hover, 'group-hover:animate-pulse')} />
                      {service.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section-container">
          <div className="mx-auto grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-8">
              <div className="neumorphic-card p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/80 mb-2">
                      {active.subheading}
                    </p>
                    <h2 className="text-3xl font-bold sm:text-4xl">
                      {active.title}
                    </h2>
                  </div>
                  <div className="inline-flex rounded-full bg-secondary/80 px-4 py-2 text-sm font-semibold text-secondary-foreground">
                    {active.extra}
                  </div>
                </div>

                <p className="mt-6 text-lg leading-8 text-muted-foreground">
                  {active.description}
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {active.highlights.map((highlight, index) => {                    
                    return (
                      <div key={highlight} className="rounded-3xl border border-border/60 bg-background/80 p-5 shadow-sm transition-all duration-300 hover:bg-background hover:border-primary/40 hover:shadow-md hover:scale-105 group">
                        <div className="flex items-center gap-3 text-primary">
                          <CheckCircle2 className={cn('h-5 w-5 transition-colors duration-300')} />
                          <p className="font-semibold">{highlight}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6">
                  <Button asChild variant="default" size="sm" className="mx-auto max-w-[220px] justify-center rounded-full">
                    <a href={active.link} target="_blank" rel="noreferrer">
                      Learn More <ArrowRight className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {active.packages.map((packageLabel) => (
                  <div key={packageLabel} className="neumorphic-card p-6 text-left">
                    <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-3">Package</p>
                    <p className="font-semibold text-lg">{packageLabel}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {active.visuals.map((item) => {
                  const isYouTube = item.type === 'video' && /(youtube\.com|youtu\.be)/i.test(item.url);
                  const isInstagram = item.type === 'video' && /instagram\.com/i.test(item.url);
                  const embedUrl = isYouTube ? getYouTubeEmbedUrl(item.url) : isInstagram ? getInstagramEmbedUrl(item.url) : '';
                  const hasImageBackground = item.type === 'image' && item.url;

                  return (
                    <div key={item.title} className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-primary/10 to-secondary/10 shadow-sm flex flex-col group min-h-[320px]">
                      <div className="absolute inset-0">
                        {item.type === 'image' && item.url ? (
                          <img src={item.url} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
                        ) : item.type === 'video' && embedUrl ? (
                          <iframe
                            src={embedUrl}
                            className="absolute inset-0 w-full h-full"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            loading="lazy"
                            title={item.title}
                          />
                        ) : item.type === 'video' && item.url ? (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 text-white px-6 text-center transition hover:opacity-90"
                          >
                            <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-primary shadow-lg">
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                            <div className="mt-3">
                              <p className="text-sm font-semibold">{isInstagram ? 'View Reel' : isYouTube ? 'Watch on YouTube' : 'Open Video'}</p>
                              <p className="text-[11px] text-muted-foreground/70 mt-1">
                                {isInstagram ? 'opens in Instagram' : isYouTube ? 'opens in YouTube' : 'opens in a new tab'}
                              </p>
                            </div>
                          </a>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-background/20">
                            <div className="text-center space-y-2">
                              <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground/50" />
                              <p className="text-xs text-muted-foreground/70">Image or Video</p>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="absolute inset-x-0 bottom-0 h-[40%]">
                        <div className="glass-card w-full h-full bg-white/8 dark:bg-black/10 border border-white/10 dark:border-black/10 p-6 backdrop-blur-3xl transition-transform duration-300 ease-apple translate-y-0 group-hover:translate-y-full pointer-events-none">
                          <div className="rounded-b-3xl pointer-events-none">
                            <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                            <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                          </div>
                        </div>
                      </div>
                      <div className="relative flex-1" />
                    </div>
                  );
                })}
              </div>

              <Button onClick={handleContactClick} className="w-full justify-center rounded-full" size="lg">
                Contact Me <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
