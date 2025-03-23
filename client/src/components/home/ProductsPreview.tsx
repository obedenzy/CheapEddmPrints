import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

const ProductsPreview = () => {
  return (
    <div className="bg-gray-100 py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Popular EDDM Products</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">High-quality postcards in a variety of sizes and finishes to match your marketing needs</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Product 1 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden group">
            <div className="h-48 overflow-hidden relative">
              <svg className="w-full h-full" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
                <rect width="400" height="200" fill="#f3f4f6" />
                <rect x="100" y="40" width="200" height="120" fill="#dbeafe" />
                <text x="200" y="100" fontSize="16" textAnchor="middle" fill="#1e40af">6.5" x 9" EDDM Postcard</text>
                <text x="200" y="130" fontSize="12" textAnchor="middle" fill="#6b7280">Standard Size</text>
              </svg>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">6.5" x 9" EDDM Postcard</h3>
              <p className="text-gray-600 mb-4">Perfect standard size for most EDDM campaigns</p>
              <div className="flex justify-between items-center">
                <span className="text-primary font-semibold">From $0.39/pc</span>
                <Link href="/shop">
                  <Button variant="link" className="text-secondary hover:text-secondary-dark font-medium">
                    Shop Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Product 2 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden group">
            <div className="h-48 overflow-hidden relative">
              <svg className="w-full h-full" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
                <rect width="400" height="200" fill="#f3f4f6" />
                <rect x="80" y="30" width="240" height="140" fill="#fef3c7" />
                <text x="200" y="100" fontSize="16" textAnchor="middle" fill="#92400e">8.5" x 11" EDDM Postcard</text>
                <text x="200" y="130" fontSize="12" textAnchor="middle" fill="#6b7280">Maximum Impact</text>
              </svg>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">8.5" x 11" EDDM Postcard</h3>
              <p className="text-gray-600 mb-4">Maximum impact with our largest postcard size</p>
              <div className="flex justify-between items-center">
                <span className="text-primary font-semibold">From $0.48/pc</span>
                <Link href="/shop">
                  <Button variant="link" className="text-secondary hover:text-secondary-dark font-medium">
                    Shop Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Product 3 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden group">
            <div className="h-48 overflow-hidden relative">
              <svg className="w-full h-full" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
                <rect width="400" height="200" fill="#f3f4f6" />
                <rect x="120" y="50" width="160" height="100" fill="#d1fae5" />
                <text x="200" y="100" fontSize="16" textAnchor="middle" fill="#065f46">6.25" x 8" EDDM Postcard</text>
                <text x="200" y="130" fontSize="12" textAnchor="middle" fill="#6b7280">Economical Option</text>
              </svg>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">6.25" x 8" EDDM Postcard</h3>
              <p className="text-gray-600 mb-4">Economical option with great response rates</p>
              <div className="flex justify-between items-center">
                <span className="text-primary font-semibold">From $0.32/pc</span>
                <Link href="/shop">
                  <Button variant="link" className="text-secondary hover:text-secondary-dark font-medium">
                    Shop Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <Link href="/shop">
            <Button className="inline-block bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-md transition-colors">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductsPreview;
