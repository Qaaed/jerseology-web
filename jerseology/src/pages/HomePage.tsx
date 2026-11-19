import { HeroSection } from '../components/home/HeroSection';
import { FeaturedCollections } from '../components/home/FeaturedCollections';
import { ScrollShowcase } from '../components/home/ScrollShowcase';
import { NewArrivals } from '../components/home/NewArrivals';
import { EditorialSection } from '../components/home/EditorialSection';
import { FAQSection } from '../components/home/FAQSection';

export function HomePage() {
  return (
    <div className="bg-[#F3EADB] text-[#1A1A1A]">
      <HeroSection />
      <FeaturedCollections />
      <ScrollShowcase />
      <NewArrivals />
      <EditorialSection />
      <FAQSection />
    </div>
  );
}
