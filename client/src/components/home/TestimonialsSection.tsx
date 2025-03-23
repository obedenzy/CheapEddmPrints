const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      text: "Their EDDM postcards helped us reach over 5,000 potential customers in our area. The quality was excellent and the price couldn't be beat!",
      name: "Sarah T.",
      role: "Local Bakery Owner",
      rating: 5
    },
    {
      id: 2,
      text: "I was amazed at how quickly my postcards arrived. I placed my order on Monday and was able to distribute them by Friday. Great service!",
      name: "Mike R.",
      role: "Real Estate Agent",
      rating: 5
    },
    {
      id: 3,
      text: "The online design process was so simple, and the USPS route selection tool was a game-changer for our targeted marketing efforts.",
      name: "James L.",
      role: "Auto Shop Manager",
      rating: 4.5
    }
  ];

  // Render stars based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="fas fa-star"></i>);
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt"></i>);
    }
    
    // Add empty stars to reach 5
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star"></i>);
    }
    
    return stars;
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">What Our Customers Say</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="text-yellow-400 flex">
                {renderStars(testimonial.rating)}
              </div>
            </div>
            <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
            <div className="flex items-center">
              <div className="font-medium">{testimonial.name}</div>
              <div className="text-sm text-gray-500 ml-2">{testimonial.role}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsSection;
