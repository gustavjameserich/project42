import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Course } from "@shared/schema";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { formatPrice } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Clock, Play, CheckCircle, AlertCircle } from "lucide-react";

export default function CoursePage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  
  const { data: course, isLoading } = useQuery<Course>({
    queryKey: [`/api/courses/${id}`],
  });

  const handleEnroll = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    
    navigate(`/checkout/course/${id}`);
  };

  const renderRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating / 10);
    const hasHalfStar = rating % 10 >= 5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star className="h-5 w-5 text-yellow-400" />
            <div className="absolute top-0 overflow-hidden w-1/2">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="h-5 w-5 text-yellow-400" />
        ))}
        <span className="text-gray-600 text-sm ml-1">({course?.reviewCount})</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-10 w-3/4" />
                <div className="flex space-x-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
              </div>
              <div>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-6 space-y-4">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold">Course not found</h1>
            <p className="mt-2">The course you're looking for doesn't exist or has been removed.</p>
            <Button 
              className="mt-4" 
              onClick={() => navigate("/")}
            >
              Return to Home
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course details */}
            <div className="lg:col-span-2 space-y-6">
              <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4">
                {renderRatingStars(course.rating)}
                
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-500 mr-1" />
                  <span className="text-gray-600 text-sm">{course.duration} hours</span>
                </div>
                
                {course.isBestseller && (
                  <Badge variant="default" className="bg-primary">BESTSELLER</Badge>
                )}
                
                {course.isNew && (
                  <Badge variant="secondary">NEW</Badge>
                )}
              </div>
              
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative">
                <img 
                  src={course.imageUrl} 
                  alt={course.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <Button variant="outline" className="bg-white/90 hover:bg-white">
                    <Play className="h-5 w-5 mr-2" />
                    Preview Course
                  </Button>
                </div>
              </div>
              
              <Tabs defaultValue="overview">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="pt-4">
                  <h3 className="text-xl font-semibold mb-4">Course Description</h3>
                  <p className="text-gray-700">{course.description}</p>
                  
                  <h3 className="text-xl font-semibold mt-8 mb-4">What You'll Learn</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {["Master modern development techniques", 
                      "Build real-world applications", 
                      "Understand advanced concepts",
                      "Deploy applications to production",
                      "Implement best practices for performance",
                      "Write clean, maintainable code"].map((item, idx) => (
                      <div key={idx} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="curriculum" className="pt-4">
                  <h3 className="text-xl font-semibold mb-4">Course Content</h3>
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((section) => (
                      <div key={section} className="border rounded-md overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
                          <h4 className="font-medium">Section {section}: Getting Started</h4>
                          <span className="text-sm text-gray-500">4 lessons • 45 min</span>
                        </div>
                        <div className="divide-y">
                          {[1, 2, 3, 4].map((lesson) => (
                            <div key={`${section}-${lesson}`} className="flex items-center justify-between px-4 py-3">
                              <div className="flex items-center">
                                <Play className="h-4 w-4 text-gray-500 mr-2" />
                                <span className="text-gray-700">Lesson {lesson}</span>
                              </div>
                              <span className="text-sm text-gray-500">10:30</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="reviews" className="pt-4">
                  <h3 className="text-xl font-semibold mb-4">Student Reviews</h3>
                  <div className="space-y-6">
                    {[1, 2, 3].map((review) => (
                      <div key={review} className="border-b pb-6 last:border-0">
                        <div className="flex items-center mb-2">
                          <div className="h-10 w-10 rounded-full bg-gray-200 mr-3 overflow-hidden">
                            <img 
                              src={`https://randomuser.me/api/portraits/${review % 2 === 0 ? 'women' : 'men'}/${review * 10}.jpg`}
                              alt="Reviewer"
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium">Student {review}</h4>
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, idx) => (
                                <Star key={idx} className={`h-4 w-4 ${idx < 4 ? 'fill-yellow-400' : ''}`} />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm">
                          This course exceeded my expectations. The instructor explains complex concepts in a clear and concise way.
                          I've learned so much and can apply these skills in my daily work.
                        </p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Course sidebar/enrollment card */}
            <div>
              <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-24">
                <div className="p-6 space-y-6">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">{formatPrice(course.price)}</h2>
                  </div>
                  
                  <Button 
                    className="w-full text-base py-6"
                    onClick={handleEnroll}
                  >
                    Enroll Now
                  </Button>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-center">This course includes:</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Play className="h-5 w-5 text-gray-500 mr-3" />
                        <span className="text-sm">{course.duration} hours on-demand video</span>
                      </div>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-sm">25 articles</span>
                      </div>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span className="text-sm">Downloadable resources</span>
                      </div>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                        <span className="text-sm">Certificate of completion</span>
                      </div>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                        <span className="text-sm">Full lifetime access</span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-500">
                      30-Day Money-Back Guarantee
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
