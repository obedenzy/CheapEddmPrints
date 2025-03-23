import { Link } from 'wouter';
import HeroSection from '@/components/home/HeroSection';
import BenefitsSection from '@/components/home/BenefitsSection';
import ProductsPreview from '@/components/home/ProductsPreview';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import { Button } from '@/components/ui/button';

const Home = () => {
  return (
    <section>
      {/* Hero Section */}
      <HeroSection />
      
      {/* Benefits Section */}
      <BenefitsSection />
      
      {/* Products Preview */}
      <ProductsPreview />
      
      {/* Testimonials Section */}
      <TestimonialsSection />
    </section>
  );
};

export default Home;
