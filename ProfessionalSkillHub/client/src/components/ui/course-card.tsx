import { Course } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useLocation } from "wouter";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const [, navigate] = useLocation();
  
  const handlePreviewClick = () => {
    navigate(`/courses/${course.id}`);
  };
  
  // Render stars based on rating
  const renderRatingStars = () => {
    const fullStars = Math.floor(course.rating / 10);
    const hasHalfStar = course.rating % 10 >= 5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star className="h-4 w-4 text-yellow-400" />
            <div className="absolute top-0 overflow-hidden w-1/2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="h-4 w-4 text-yellow-400" />
        ))}
        <span className="text-gray-600 text-sm ml-1">({course.reviewCount})</span>
      </div>
    );
  };

  return (
    <Card className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative pb-2/3">
        <img 
          className="h-48 w-full object-cover" 
          src={course.imageUrl} 
          alt={course.title} 
        />
        {(course.isBestseller || course.isNew) && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <span className={`text-white font-medium m-3 px-2 py-1 ${course.isBestseller ? 'bg-primary' : 'bg-secondary-600'} rounded text-xs`}>
              {course.isBestseller ? 'BESTSELLER' : 'NEW'}
            </span>
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-center">
          {renderRatingStars()}
        </div>
        <h3 className="mt-2 text-xl font-semibold text-gray-900 line-clamp-1">{course.title}</h3>
        <p className="mt-2 text-gray-600 line-clamp-3">{course.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-primary font-semibold">{formatPrice(course.price)}</span>
          <div>
            <span className="text-xs text-gray-500">{course.duration} hours</span>
          </div>
        </div>
        <Button 
          className="mt-4 w-full"
          onClick={handlePreviewClick}
        >
          Preview Course
        </Button>
      </div>
    </Card>
  );
}
