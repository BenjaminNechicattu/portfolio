
import { useScrollReveal } from '@/utils/animations';
import { cn } from '@/lib/utils';

interface SkillCategory {
  name: string;
  skills: string[];
}

const skillCategories: SkillCategory[] = [
  {
    name: "Programming Languages",
    skills: ["Go", "Python", "JavaScript", "TypeScript"]
  },
  {
    name: "Web Technologies",
    skills: ["Node.js", "HTML5", "CSS3", "GraphQL", "REST APIs", "React"]
  },
  {
    name: "Cloud & DevOps",
    skills: ["AWS", "GCP", "Docker", "Kubernetes", "CI/CD","Microservices"]
  },
  {
    name: "Databases",
    skills: ["SQL", "PostgreSQL", "SqLite", "Cassandra","Redis"]
  },
  {
    name: "Other-Tools",
    skills: ["Kafka", "MQTT", "Nats", "Redis", "RabbitMQ"]
  },
  {
    name: "Methodologies",
    skills: ["Git", "Agile", "Scrum", "JIRA", "Design Patterns", "System Design"]
  }
];

const SkillCard = ({ category, isVisible, index }: { category: SkillCategory, isVisible: boolean, index: number }) => {
  return (
    <div 
      className={cn(
        "glass-card p-6 transition-all duration-500 ease-apple",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
      style={{ 
        transitionDelay: isVisible ? `${index * 100}ms` : '0ms' 
      }}
    >
      <h3 className="text-xl font-bold mb-4">{category.name}</h3>
      <div className="flex flex-wrap gap-2">
        {category.skills.map((skill, idx) => (
          <span 
            key={idx}
            className="px-3 py-1 text-sm rounded-full bg-secondary text-secondary-foreground"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};

const Skills = () => {
  const { ref, isIntersecting } = useScrollReveal();

  return (
    <section id="skills" className="py-20">
      <div className="section-container" ref={ref}>
        <div className="max-w-5xl mx-auto">
          <div className={cn(
            "mb-12 text-center transition-all duration-500 ease-apple",
            isIntersecting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}>
            <span className="inline-block px-3 py-1 text-xs font-medium tracking-wider uppercase rounded-full bg-secondary text-secondary-foreground mb-4">
              Skills
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Technical Expertise</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              A comprehensive overview of my technical skills and areas of expertise developed throughout my career.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillCategories.map((category, index) => (
              <SkillCard 
                key={index} 
                category={category} 
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

export default Skills;
