
import { Github, Linkedin, Mail, Twitter } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-secondary/50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <p className="text-lg font-semibold">Benjamin G Nechicattu</p>
            <p className="text-sm text-muted-foreground">A Tech Enthusiast, A Software Engineer</p>
          </div>
          
          <div className="flex space-x-4 mb-6 md:mb-0">
            <a 
              href="https://www.linkedin.com/in/benjamin-g-nechicattu/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-background/50 hover:bg-background transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a 
              href="https://github.com/BenjaminNechicattu" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-background/50 hover:bg-background transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a 
              href="https://x.com/Benjamingarvasi" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-background/50 hover:bg-background transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a 
              href="mailto:benjaminnechicattu@gmail.com" 
              className="p-2 rounded-full bg-background/50 hover:bg-background transition-colors"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
        
        <div className="border-t border-border/50 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            &copy; {currentYear} Benjamin G Nechicattu. All rights reserved.
          </p>
          
          {/* <div className="flex space-x-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </a>
          </div> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
