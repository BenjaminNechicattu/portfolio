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

  const cards = [
    {
      content: (
        <div className="flex items-start space-x-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Phone className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-1">Phone</h3>
            <a href="tel:+919847176142" className="text-muted-foreground hover:text-foreground transition-colors">
              +91 9847 17 6142 (preferred)
            </a>
          </div>
        </div>
      )
    },
    {
      content: (
        <div className="flex items-start space-x-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Phone className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-1">WhatsApp</h3>
            <a href="https://wa.me/919847176142" className="text-muted-foreground hover:text-foreground transition-colors">
              +91 9847 17 6142 (secondary)
            </a>
          </div>
        </div>
      )
    },
    {
      content: (
        <div className="flex items-start space-x-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-1">Email</h3>
            <a href="mailto:benjaminnechicattu@gmail.com" className="text-muted-foreground hover:text-foreground transition-colors">
              benjaminnechicattu@gmail.com
            </a>
          </div>
        </div>
      )
    },
    {
      content: (
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
      )
    },
    {
      content: (
        <div className="flex items-start space-x-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <svg className="h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-1">Address</h3>
            <p className="text-muted-foreground hover:text-foreground transition-colors">
              Nechicattu House Chelakompu PO Karukachal, 686540<br />
              kottayam Kerala
            </p>
          </div>
        </div>
      )
    }
  ];

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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {cards.map((card, index) => (
              <div
                key={index}
                className={cn(
                  "glass-card p-6 transition-all duration-500 ease-apple",
                  isIntersecting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
                  cards.length % 2 !== 0 && index === cards.length - 1 ? "md:col-span-2 md:mx-auto" : ""
                )}
                style={{ transitionDelay: isIntersecting ? `${(index + 1) * 100}ms` : '0ms' }}
              >
                {card.content}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
