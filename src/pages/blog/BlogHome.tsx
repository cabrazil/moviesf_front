import { BlogHero } from '../../components/blog/BlogHero';
import { DailyCurationSection } from '../../components/blog/DailyCurationSection';
import { BlogLatestPosts } from '../../components/blog/BlogLatestPosts';

export function BlogHome() {
  return (
    <div style={{ backgroundColor: 'transparent', minHeight: '100vh' }}>
      <BlogHero />
      <DailyCurationSection />
      <BlogLatestPosts />
    </div>
  );
}
