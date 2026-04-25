import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import SectionDivider from "./components/SectionDivider";
import AboutSection from "./components/AboutSection";
import SkillsSection from "./components/SkillsSection";
import ProjectsSection from "./components/ProjectsSection";
import TestimonialsSection from "./components/TestimonialsSection";
import BlogsSection from "./components/BlogsSection";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import StatusBar from "./components/StatusBar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <SectionDivider command="cd /about" index={2} />
        <AboutSection />
        <SectionDivider command="cd /skills" index={3} />
        <SkillsSection />
        <SectionDivider command="cd /work" index={4} />
        <ProjectsSection />
        <SectionDivider command="cd /testimonials" index={5} />
        <TestimonialsSection />
        <SectionDivider command="cd /blog" index={6} />
        <BlogsSection />
      </main>
      <Footer />
      <div aria-hidden className="h-6" />
      <ScrollToTop />
      <StatusBar />
    </>
  );
}
