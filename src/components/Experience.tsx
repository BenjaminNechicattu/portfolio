
import { useScrollReveal } from '@/utils/animations';
import { cn } from '@/lib/utils';

interface ExperienceItem {
  company: string;
  position: string;
  period: string;
  description: string;
  highlights: string[];
}

const experiences: ExperienceItem[] = [
  {
    company: "Amazon",
    position: "Software Engineer",
    period: "2016 - Present",
    description: "Leading development of cloud-based software solutions for AWS infrastructure, focusing on distributed systems and scalable architectures.",
    highlights: [
      "Architected and implemented scalable microservices using Java and AWS technologies",
      "Led cross-functional teams to deliver critical infrastructure components",
      "Implemented CI/CD pipelines improving deployment efficiency by 40%",
      "Optimized database operations resulting in 30% performance improvement"
    ]
  },
  {
    company: "Shopsense Retail Technologies (Fynd)",
    position: "Software Engineer",
    period: "2014 - 2016",
    description: "Developed e-commerce solutions and integrated point-of-sale systems for retail clients.",
    highlights: [
      "Built and maintained backend services using Node.js and MongoDB",
      "Implemented real-time inventory management system",
      "Developed APIs for mobile applications and third-party integrations",
      "Optimized database queries improving application performance"
    ]
  },
  {
    company: "Entrepreneurial Ventures",
    position: "Co-founder & Technical Lead",
    period: "2012 - 2014",
    description: "Co-founded technology startups focusing on mobile applications and web services.",
    highlights: [
      "Developed full-stack web applications from concept to deployment",
      "Created mobile apps for Android and iOS platforms",
      "Managed technical infrastructure and development workflows",
      "Implemented analytics systems for data-driven decision making"
    ]
  }
];

const ExperienceCard = ({ item, index, isVisible }: { item: ExperienceItem, index: number, isVisible: boolean }) => {
  return (
    <div 
      className={cn(
        "glass-card p-6 mb-6 transition-all duration-500 ease-apple",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
        isVisible ? `transition-delay-${index * 100}` : ""
      )}
      style={{ 
        transitionDelay: isVisible ? `${index * 100}ms` : '0ms' 
      }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold">{item.position}</h3>
          <p className="text-lg font-medium">{item.company}</p>
        </div>
        <span className="inline-block mt-2 md:mt-0 px-3 py-1 text-xs font-medium tracking-wider uppercase rounded-full bg-secondary text-secondary-foreground">
          {item.period}
        </span>
      </div>
      
      <p className="text-muted-foreground mb-4">{item.description}</p>
      
      <ul className="space-y-2">
        {item.highlights.map((highlight, idx) => (
          <li key={idx} className="flex items-start">
            <span className="mr-2 mt-1">•</span>
            <span className="text-sm">{highlight}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Experience = () => {
  const { ref, isIntersecting } = useScrollReveal();

  return (
    <section id="experience" className="py-20 bg-secondary/30">
      <div className="section-container" ref={ref}>
        <div className="max-w-3xl mx-auto">
          <div className={cn(
            "mb-12 transition-all duration-500 ease-apple",
            isIntersecting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}>
            <span className="inline-block px-3 py-1 text-xs font-medium tracking-wider uppercase rounded-full bg-secondary text-secondary-foreground mb-4">
              Experience
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Professional Journey</h2>
            <p className="text-lg text-muted-foreground">
              A timeline of my professional experience and key roles that have shaped my career.
            </p>
          </div>
          
          <div className="space-y-6">
            {experiences.map((item, index) => (
              <ExperienceCard 
                key={index} 
                item={item} 
                index={index} 
                isVisible={isIntersecting}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
