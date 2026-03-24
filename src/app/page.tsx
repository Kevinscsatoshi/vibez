import {
  getFeaturedProjects,
  getTrendingProjects,
  getLatestProjects,
} from "@/lib/sample-data";
import { HomeSections } from "@/components/home-sections";

export default function HomePage() {
  const featured = getFeaturedProjects();
  const trending = getTrendingProjects();
  const latest = getLatestProjects();

  return <HomeSections featured={featured} trending={trending} latest={latest} />;
}
