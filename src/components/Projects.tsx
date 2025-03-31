
import { useScrollReveal } from '@/utils/animations';
import { cn } from '@/lib/utils';

interface Project {
  title: string;
  description: string;
  technologies: string[];
  type: string;
  git?: string;
}

const projects: Project[] = [
  {
    title: "Elements",
    description: "Elements is a desktop application capable of Editing images over voice commands.",
    technologies: ["Python", "speech recognition", "OpenCV", "Tkinter", "pillow"],
    type: "Desktop App",
    git: "https://github.com/BenjaminNechicattu/Image-Editing-Using-Voice-Commands"
  },
  {
    title: "Elsa",
    description: "Elsa is an assistant that can be used to control your computer using voice commands.",
    technologies: ["Python", "speech recognition", "nltk"],
    type: "Desktop App",
    git: "https://github.com/BenjaminNechicattu/voice-controll-pc-python"
  },
  {
    title: "GoGames",
    description: "Entertaining games built using GoLang. Includes classic snake, simple cli chess and more in progress. Play and enjoy!",
    technologies: ["GoLang", "speech recognition", "nltk"],
    type: "CLI App",
    git: "https://github.com/BenjaminNechicattu/GoGames"
  },
  {
    title: "gogenc",
    description: "Go package for generica compare ops(max/min), string ops(reverse), GetEnv, and more",
    technologies: ["GoLang", "speech recognition", "nltk"],
    type: "go package",
    git: "https://github.com/BenjaminNechicattu/gogenc"
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
      <div className="flex justify items-center mb-3">
        <h3 className="text-xl font-bold">{project.title}</h3>
        {project.git && (
          <a 
            href={project.git} 
            className="px-2 py-1 text-xs rounded-full "
          >
        GitHub
          </a>
        )}
      </div>
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
              Find more on my <a href="https://github.com/BenjaminNechicattu" className="text-primary underline">GitHub</a>.
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
