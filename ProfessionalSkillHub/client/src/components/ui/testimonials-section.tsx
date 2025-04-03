import { Star } from "lucide-react";

interface Testimonial {
  text: string;
  author: {
    name: string;
    title: string;
    image: string;
  }
  rating: number;
}

export function TestimonialsSection() {
  const testimonials: Testimonial[] = [
    {
      text: "This course completely changed my career path. I went from a junior developer to landing a senior role at a tech startup within 6 months of completing the Full-Stack Web Development course.",
      author: {
        name: "Michael Johnson",
        title: "Senior Developer at TechStart",
        image: "https://randomuser.me/api/portraits/men/32.jpg"
      },
      rating: 5
    },
    {
      text: "The React & Redux Masterclass helped me understand complex state management that I was struggling with. The projects are real-world and the instructors explain concepts clearly.",
      author: {
        name: "Sarah Williams",
        title: "Frontend Developer at DesignCo",
        image: "https://randomuser.me/api/portraits/women/44.jpg"
      },
      rating: 5
    },
    {
      text: "As someone who was switching careers, the subscription option gave me access to everything I needed to build a solid foundation. The community support was invaluable.",
      author: {
        name: "David Chen",
        title: "Backend Developer at CloudSys",
        image: "https://randomuser.me/api/portraits/men/62.jpg"
      },
      rating: 4.5
    }
  ];

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    return (
      <div className="flex text-yellow-400">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="h-5 w-5 fill-yellow-400" />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star className="h-5 w-5" />
            <div className="absolute top-0 left-0 overflow-hidden w-1/2">
              <Star className="h-5 w-5 fill-yellow-400" />
            </div>
          </div>
        )}
        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
          <Star key={`empty-${i}`} className="h-5 w-5" />
        ))}
      </div>
    );
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Testimonials</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            What Our Students Say
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                {renderStars(testimonial.rating)}
              </div>
              <p className="text-gray-600 mb-4">{testimonial.text}</p>
              <div className="flex items-center">
                <img 
                  className="h-10 w-10 rounded-full object-cover" 
                  src={testimonial.author.image} 
                  alt={testimonial.author.name} 
                />
                <div className="ml-3">
                  <h3 className="text-gray-900 font-medium">{testimonial.author.name}</h3>
                  <p className="text-gray-500 text-sm">{testimonial.author.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
