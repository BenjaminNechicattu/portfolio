
import { useScrollReveal } from '@/utils/animations';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Linkedin, Mail, Phone } from "lucide-react";

const Contact = () => {
  const { ref, isIntersecting } = useScrollReveal();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message sent",
        description: "Thanks for reaching out! I'll get back to you soon.",
      });
      setFormData({ name: '', email: '', message: '' });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <section id="contact" className="py-20">
      <div className="section-container" ref={ref}>
        <div className="max-w-5xl mx-auto">
          <div className={cn(
            "mb-12 text-center transition-all duration-500 ease-apple",
            isIntersecting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}>
            <span className="inline-block px-3 py-1 text-xs font-medium tracking-wider uppercase rounded-full bg-secondary text-secondary-foreground mb-4">
              Contact
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Get In Touch</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Interested in working together or have a question? Feel free to reach out.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            <div className="lg:col-span-2 space-y-6">
              <div className={cn(
                "glass-card p-6 transition-all duration-500 ease-apple",
                isIntersecting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              )}
                style={{ transitionDelay: isIntersecting ? '100ms' : '0ms' }}
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Email</h3>
                    <a href="mailto:benjamin@example.com" className="text-muted-foreground hover:text-foreground transition-colors">
                      benjamin@example.com
                    </a>
                  </div>
                </div>
              </div>
              
              <div className={cn(
                "glass-card p-6 transition-all duration-500 ease-apple",
                isIntersecting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              )}
                style={{ transitionDelay: isIntersecting ? '200ms' : '0ms' }}
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Linkedin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">LinkedIn</h3>
                    <a 
                      href="https://www.linkedin.com/in/benjamin-g-nechicattu/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      benjamin-g-nechicattu
                    </a>
                  </div>
                </div>
              </div>
              
              <div className={cn(
                "glass-card p-6 transition-all duration-500 ease-apple",
                isIntersecting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              )}
                style={{ transitionDelay: isIntersecting ? '300ms' : '0ms' }}
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Phone</h3>
                    <p className="text-muted-foreground">
                      Available upon request
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={cn(
              "lg:col-span-3 glass-card p-6 transition-all duration-500 ease-apple",
              isIntersecting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}
              style={{ transitionDelay: isIntersecting ? '400ms' : '0ms' }}
            >
              <h3 className="text-xl font-bold mb-6">Send a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full min-h-[120px]"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
