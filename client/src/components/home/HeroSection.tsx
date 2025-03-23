import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <div className="relative bg-gradient-to-r from-primary to-primary-dark text-white">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="md:w-2/3">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">The Cheapest & Fastest EDDM Postcards For Your Business</h1>
          <p className="text-lg md:text-xl mb-8">High-quality EDDM postcards at unbeatable prices with lightning-fast delivery.</p>
          <Link href="/shop">
            <Button className="inline-block bg-secondary hover:bg-secondary-dark text-white font-semibold py-3 px-6 rounded-md transition-colors">
              Shop Now
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Decoration - SVG instead of image */}
      <div className="absolute right-0 bottom-0 hidden md:block">
        <svg 
          viewBox="0 0 500 400" 
          className="h-64 w-auto opacity-20"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="50" y="50" width="400" height="300" rx="8" fill="white" fillOpacity="0.2" />
          <rect x="70" y="70" width="360" height="260" rx="4" stroke="white" strokeWidth="2" strokeDasharray="8 8" />
          <path d="M70 280L430 80" stroke="white" strokeWidth="2" />
          <circle cx="250" cy="180" r="40" fill="white" fillOpacity="0.3" />
          <rect x="150" y="220" width="200" height="30" rx="4" fill="white" fillOpacity="0.3" />
          <rect x="180" y="260" width="140" height="20" rx="4" fill="white" fillOpacity="0.3" />
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;
