import HeroSection from "./components/HeroSection";
import HomeProjects from "./components/HomeProjects";
import SkillsSection from "./components/SkillsSection";
import TestimonialsSection from "./components/TestimonialsSection";
import WritingsSection from "./components/WritingsSection";

// Pre-render at build time, ISR-revalidate every hour.
export const revalidate = 3600;

export default function Home() {
  return (
    <main>
      <HeroSection />
      <SkillsSection />
      <HomeProjects />
      <TestimonialsSection />
      <WritingsSection />
    </main>
  );
}
