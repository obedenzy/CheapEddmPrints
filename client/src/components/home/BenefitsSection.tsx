const BenefitsSection = () => {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold">Why Choose CheapEDDMFast?</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Benefit 1 */}
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-light/10 text-primary mb-4">
            <i className="fas fa-tags text-2xl"></i>
          </div>
          <h3 className="text-xl font-semibold mb-2">90% Cheaper</h3>
          <p className="text-gray-600">Get the most affordable EDDM postcard printing on the market, saving your marketing budget.</p>
        </div>
        
        {/* Benefit 2 */}
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary-light/10 text-secondary mb-4">
            <i className="fas fa-shipping-fast text-2xl"></i>
          </div>
          <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
          <p className="text-gray-600">Lightning-fast production and shipping to get your marketing materials out quickly.</p>
        </div>
        
        {/* Benefit 3 */}
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-light/10 text-accent mb-4">
            <i className="fas fa-magic text-2xl"></i>
          </div>
          <h3 className="text-xl font-semibold mb-2">Easy Process</h3>
          <p className="text-gray-600">Simple ordering system and design upload process, from creation to delivery.</p>
        </div>
      </div>
    </div>
  );
};

export default BenefitsSection;
