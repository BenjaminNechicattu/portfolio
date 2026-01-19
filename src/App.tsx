import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { CustomThemeProvider } from "@/contexts/CustomThemeContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Blog from "./pages/Blog"; // Import the Blog page
import NewYear from "./pages/NewYear"; // Import the New Year page
import Clock from "./pages/Clock"; // Import the Clock page
import PageTransition from '@/components/PageTransition';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <BrowserRouter>
        <CustomThemeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <PageTransition>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/time" element={<Clock />} />
                <Route path="/newyear" element={<NewYear />} />
                <Route path="/newyear/:name" element={<NewYear />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </PageTransition>
          </TooltipProvider>
        </CustomThemeProvider>
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
