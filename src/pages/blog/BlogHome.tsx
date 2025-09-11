import { BlogHero } from '../../components/blog/BlogHero';
import { BlogFeaturedSection } from '../../components/blog/BlogFeaturedSection';
import { BlogLatestPosts } from '../../components/blog/BlogLatestPosts';

export function BlogHome() {
  return (
    <div style={{ backgroundColor: 'transparent', minHeight: '100vh' }}>
      <BlogHero />
      <BlogFeaturedSection />
      <BlogLatestPosts />
    </div>
  );
}
