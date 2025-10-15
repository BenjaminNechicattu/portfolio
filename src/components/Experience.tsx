
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
    company: "International Business Machines (IBM)",
    position: "System Software Engineer",
    period: "Dec/2023 - Present",
    description: "Software Engineer at WatsonX Orchestrate, focusing on backend services and agentic AI solutions.",
    highlights: [
      "Implemented agentic AI capabilities within WatsonX Orchestrate, enabling dynamic reasoning and autonomous task execution through AI-driven agents.",
      "Designed and developed the Tools Runtime Manager in Go, a robust system for managing and orchestrating complex tool executions.",
      "Built new Orchestrate features supporting file uploads via chat and contextual data passing between tools, enhancing interactivity and workflow efficiency.",
      "Architected and maintained scalable microservices using Python, Go, and Node.js, powering WatsonX Orchestrate's AI chat experience.",
      "Developed and optimized RESTful APIs for seamless front-end integration, improving performance and user experience.",
      "Collaborated with cross-functional teams to deliver reliable, high-performance backend solutions ensuring data consistency and accessibility.",
    ]
  },
  {
    company: "Intellicar Telematics",
    position: "Software Systems Engineer",
    period: "Aug/2022 - Nov/2023",
    description: "Designed & developed services in Golang. Provided support for the telematics infrastructure.",
    highlights: [
      "Built and maintained backend services using Golang and MySQL to support real-time data processing and analytics for telematics applications.",
      "Designed and developed a proprietary storage application utilizing Google Cloud Platform's Object Store APls for seamless file management.",
      "Developed an application resembling a SIM management platform by integrating APls from major ISPs like Airtel and Vodafone significantly enhancing operational efficiency and enabling prompt client interactions.",
      "Developed email and SMS services using Sendgrid and infobip for multi-factor authentication, enhancing system security.",
      "Created GoLang, Python and JavaScript client libraries to seamlessly integrate UI with the API's, enhancing user experience and leading to increased customer satisfaction."
    ]
  },
  {
    company: "Algomox",
    position: "Software Engineer",
    period: "Dec/2020 - Jul/2022",
    description: "Developed AiOps which automates ITOps, which analyses KPIs and Logs to provide insights.",
    highlights: [
      "Engineered applications for the AlOps platform, showcasing adaptability and creativity in addressing intricate operational challenges.",
      "Developed a robust Ticketing System (CEC) integral to the AlOps Platform, enabling seamless ticket filing and streamlined ticket lifecycle management, further enhancing operational efficiency.",
      "Orchestrated the development of data-fetching APls, empowering the AlOps Dashboard with real-time insights, and bolstering data-driven decision-making.",
      "Designed and implemented a dynamic Log Collecting Agent, adept at capturing live logs from diverse systems strengthening system monitoring and diagnostic capabilities."
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
