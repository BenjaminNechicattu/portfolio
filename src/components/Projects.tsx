
import { useScrollReveal } from '@/utils/animations';
import { cn } from '@/lib/utils';

interface Project {
  title: string;
  description: string;
  technologies: string[];
  type: string;
}

const projects: Project[] = [
  {
    title: "Cloud Infrastructure Automation",
    description: "Developed a comprehensive cloud infrastructure automation system that reduced deployment time by 70% and improved resource utilization.",
    technologies: ["AWS", "Terraform", "Python", "Docker"],
    type: "Enterprise"
  },
  {
    title: "Distributed Caching System",
    description: "Architected and implemented a high-performance distributed caching system supporting millions of transactions per second with sub-millisecond latency.",
    technologies: ["Java", "Redis", "Spring Boot", "Kubernetes"],
    type: "Infrastructure"
  },
  {
    title: "E-commerce Platform",
    description: "Built a scalable e-commerce platform with real-time inventory management and advanced analytics capabilities.",
    technologies: ["Node.js", "React", "MongoDB", "GraphQL"],
    type: "Web Application"
  },
  {
    title: "Real-time Analytics Dashboard",
    description: "Designed and implemented a real-time analytics dashboard for monitoring system performance and business metrics.",
    technologies: ["TypeScript", "D3.js", "ElasticSearch", "Kafka"],
    type: "Data Visualization"
  },
  {
    title: "Serverless API Gateway",
    description: "Created a serverless API gateway for managing microservices communication with built-in authentication and rate limiting.",
    technologies: ["AWS Lambda", "API Gateway", "Node.js", "DynamoDB"],
    type: "Cloud Native"
  },
  {
    title: "Mobile Payment Solution",
    description: "Developed a secure mobile payment solution with biometric authentication and end-to-end encryption.",
    technologies: ["React Native", "Java", "Swift", "Firebase"],
    type: "Mobile Application"
  }
];

const ProjectCard = ({ project, isVisible, index }: { project: Project, isVisible: boolean, index: number }) => {
  return (
    <div 
      className={cn(
        "glass-card h-full flex flex-col p-6 transition-all duration-500 ease-apple",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
      style={{ 
        transitionDelay: isVisible ? `${index * 100}ms` : '0ms' 
      }}
    >
      <div className="mb-3">
        <span className="inline-block px-2 py-1 text-xs font-medium tracking-wider uppercase rounded-full bg-secondary text-secondary-foreground">
          {project.type}
        </span>
      </div>
      <h3 className="text-xl font-bold mb-3">{project.title}</h3>
      <p className="text-muted-foreground mb-4 flex-grow">{project.description}</p>
      <div className="flex flex-wrap gap-2 mt-auto">
        {project.technologies.map((tech, idx) => (
          <span 
            key={idx}
            className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
};

const Projects = () => {
  const { ref, isIntersecting } = useScrollReveal();

  return (
    <section id="projects" className="py-20 bg-secondary/30">
      <div className="section-container" ref={ref}>
        <div className="max-w-6xl mx-auto">
          <div className={cn(
            "mb-12 text-center transition-all duration-500 ease-apple",
            isIntersecting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}>
            <span className="inline-block px-3 py-1 text-xs font-medium tracking-wider uppercase rounded-full bg-secondary text-secondary-foreground mb-4">
              Projects
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Featured Work</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              A selection of projects that showcase my technical capabilities and problem-solving approach.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <ProjectCard 
                key={index} 
                project={project} 
                isVisible={isIntersecting}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
