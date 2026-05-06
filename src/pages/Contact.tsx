import { useEffect } from 'react';
import NavBar from '@/components/NavBar';
import ContactSection from '@/components/Contact';
import Footer from '@/components/Footer';

const ContactPage = () => {
  useEffect(() => {
    document.title = 'Contact | Benjamin G Nechicattu';
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />
      <main className="pt-28">
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
