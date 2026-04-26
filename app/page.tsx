import HeroSection from "./components/HeroSection";
import HomeProjects from "./components/HomeProjects";
import SkillsSection from "./components/SkillsSection";
import TestimonialsSection from "./components/TestimonialsSection";
import WritingsSection from "./components/WritingsSection";
import { getFeaturedPosts } from "./lib/public/blog";

// Pre-render at build time, ISR-revalidate every hour.
export const revalidate = 3600;

export default async function Home() {
  const recentPosts = await getFeaturedPosts(3);

  return (
    <main>
      <HeroSection />
      <SkillsSection />
      <HomeProjects />
      <TestimonialsSection />
      <WritingsSection posts={recentPosts} />
    </main>
  );
}
