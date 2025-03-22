
import { useScrollReveal } from '@/utils/animations';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const About = () => {
  const { ref, isIntersecting } = useScrollReveal();

  return (
    <section id="about" className="py-20 relative" ref={ref}>
      <div className="section-container">
        <div className="max-w-3xl mx-auto">
          <div 
            className={cn(
              "appear-animation transition-all duration-700",
              isIntersecting ? "opacity-100" : "opacity-0"
            )}
          >
            <span className="inline-block px-3 py-1 text-xs font-medium tracking-wider uppercase rounded-full bg-secondary text-secondary-foreground mb-4">
              About Me
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Software Engineer & Entrepreneur
            </h2>
            
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-8">
              <div className="w-40 h-40 flex-shrink-0">
                <Avatar className="w-full h-full">
                  <AvatarImage 
                    src="/lovable-uploads/9b4974aa-1ace-4917-9f43-c9e9cf89fdfb.png" 
                    alt="Benjamin G. Nechicattu" 
                    className="object-cover"
                  />
                  <AvatarFallback>BN</AvatarFallback>
                </Avatar>
              </div>
              
              <div className="prose prose-lg dark:prose-invert">
                <p className="text-lg text-muted-foreground mb-4">
                  I'm a software engineer with extensive experience at Amazon, where I've been leading the development of innovative solutions for cloud computing and distributed systems. My passion lies at the intersection of technology and business, where I strive to create impactful products.
                </p>
                
                <p className="text-lg text-muted-foreground mb-4">
                  With a strong technical background and entrepreneurial mindset, I've contributed to various projects that have enhanced operational efficiency and created value for customers. I'm deeply interested in cloud technologies, scalable systems, and leveraging technology to solve complex business problems.
                </p>
                
                <p className="text-lg text-muted-foreground mb-8">
                  Beyond my technical work, I'm committed to continuous learning and growth, staying at the forefront of emerging technologies and industry best practices. I believe in collaborative problem-solving and creating elegant, efficient solutions that deliver real-world impact.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
              <div className="glass-card p-6">
                <h3 className="text-xl font-semibold mb-2">Education</h3>
                <p className="text-muted-foreground">
                  Computer Science & Engineering<br />
                  Mahatma Gandhi University
                </p>
              </div>
              
              <div className="glass-card p-6">
                <h3 className="text-xl font-semibold mb-2">Location</h3>
                <p className="text-muted-foreground">
                  Seattle, Washington<br />
                  United States
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
