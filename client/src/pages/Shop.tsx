import { useState } from 'react';
import ProductCustomizer from '@/components/shop/ProductCustomizer';
import { Checkbox } from '@/components/ui/checkbox';

// Interface for filter states
interface FilterState {
  price: {
    under500: boolean;
    between500And1000: boolean;
    between1000And2000: boolean;
    over2000: boolean;
  };
  delivery: {
    express: boolean;
    standard: boolean;
    economy: boolean;
  };
  size: {
    size6_25x8: boolean;
    size6_5x9: boolean;
    size6_5x11: boolean;
    size8_5x11: boolean;
  };
}

const Shop = () => {
  // State for filters
  const [filters, setFilters] = useState<FilterState>({
    price: {
      under500: true,
      between500And1000: true,
      between1000And2000: false,
      over2000: false
    },
    delivery: {
      express: true,
      standard: true,
      economy: false
    },
    size: {
      size6_25x8: true,
      size6_5x9: true,
      size6_5x11: true,
      size8_5x11: true
    }
  });

  // Handler for filter changes
  const handleFilterChange = (
    category: keyof FilterState,
    filter: string,
    checked: boolean
  ) => {
    setFilters(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [filter]: checked
      }
    }));
  };

  return (
    <section>
      <div className="bg-primary text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold">Shop EDDM Postcards</h1>
          <p className="mt-2">Customize your postcards to fit your marketing needs</p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="font-semibold text-lg mb-4">Filters</h2>
              
              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Price Range</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <Checkbox
                      checked={filters.price.under500}
                      onCheckedChange={(checked) => 
                        handleFilterChange('price', 'under500', checked === true)
                      }
                      className="mr-2"
                    />
                    <span className="ml-2 text-gray-700">Under $500</span>
                  </label>
                  <label className="flex items-center">
                    <Checkbox
                      checked={filters.price.between500And1000}
                      onCheckedChange={(checked) => 
                        handleFilterChange('price', 'between500And1000', checked === true)
                      }
                      className="mr-2"
                    />
                    <span className="ml-2 text-gray-700">$500 - $1,000</span>
                  </label>
                  <label className="flex items-center">
                    <Checkbox
                      checked={filters.price.between1000And2000}
                      onCheckedChange={(checked) => 
                        handleFilterChange('price', 'between1000And2000', checked === true)
                      }
                      className="mr-2"
                    />
                    <span className="ml-2 text-gray-700">$1,000 - $2,000</span>
                  </label>
                  <label className="flex items-center">
                    <Checkbox
                      checked={filters.price.over2000}
                      onCheckedChange={(checked) => 
                        handleFilterChange('price', 'over2000', checked === true)
                      }
                      className="mr-2"
                    />
                    <span className="ml-2 text-gray-700">Over $2,000</span>
                  </label>
                </div>
              </div>
              
              {/* Delivery Speed */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Delivery Speed</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <Checkbox
                      checked={filters.delivery.express}
                      onCheckedChange={(checked) => 
                        handleFilterChange('delivery', 'express', checked === true)
                      }
                      className="mr-2"
                    />
                    <span className="ml-2 text-gray-700">Express (3-5 days)</span>
                  </label>
                  <label className="flex items-center">
                    <Checkbox
                      checked={filters.delivery.standard}
                      onCheckedChange={(checked) => 
                        handleFilterChange('delivery', 'standard', checked === true)
                      }
                      className="mr-2"
                    />
                    <span className="ml-2 text-gray-700">Standard (7-10 days)</span>
                  </label>
                  <label className="flex items-center">
                    <Checkbox
                      checked={filters.delivery.economy}
                      onCheckedChange={(checked) => 
                        handleFilterChange('delivery', 'economy', checked === true)
                      }
                      className="mr-2"
                    />
                    <span className="ml-2 text-gray-700">Economy (10-14 days)</span>
                  </label>
                </div>
              </div>
              
              {/* Size */}
              <div>
                <h3 className="font-medium mb-3">Postcard Size</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <Checkbox
                      checked={filters.size.size6_25x8}
                      onCheckedChange={(checked) => 
                        handleFilterChange('size', 'size6_25x8', checked === true)
                      }
                      className="mr-2"
                    />
                    <span className="ml-2 text-gray-700">6.25" x 8"</span>
                  </label>
                  <label className="flex items-center">
                    <Checkbox
                      checked={filters.size.size6_5x9}
                      onCheckedChange={(checked) => 
                        handleFilterChange('size', 'size6_5x9', checked === true)
                      }
                      className="mr-2"
                    />
                    <span className="ml-2 text-gray-700">6.5" x 9"</span>
                  </label>
                  <label className="flex items-center">
                    <Checkbox
                      checked={filters.size.size6_5x11}
                      onCheckedChange={(checked) => 
                        handleFilterChange('size', 'size6_5x11', checked === true)
                      }
                      className="mr-2"
                    />
                    <span className="ml-2 text-gray-700">6.5" x 11"</span>
                  </label>
                  <label className="flex items-center">
                    <Checkbox
                      checked={filters.size.size8_5x11}
                      onCheckedChange={(checked) => 
                        handleFilterChange('size', 'size8_5x11', checked === true)
                      }
                      className="mr-2"
                    />
                    <span className="ml-2 text-gray-700">8.5" x 11"</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Product Customization Form */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <ProductCustomizer />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Shop;
