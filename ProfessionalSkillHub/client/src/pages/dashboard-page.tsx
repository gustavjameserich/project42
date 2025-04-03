import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Calendar, CheckCircle, ChartBar, Award, Play } from "lucide-react";
import { Course, Subscription } from "@shared/schema";
import { useLocation } from "wouter";
import { formatPrice } from "@/lib/utils";

export default function DashboardPage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  
  const { data: courses, isLoading: coursesLoading } = useQuery<Course[]>({
    queryKey: ["/api/user/courses"],
  });
  
  const { data: subscription, isLoading: subscriptionLoading } = useQuery<Subscription>({
    queryKey: ["/api/user/subscription"],
  });
  
  const isLoading = coursesLoading || subscriptionLoading;
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const getSubscriptionBadge = () => {
    if (!subscription) return null;
    
    const planType = subscription.planType;
    if (planType === 'monthly') {
      return <Badge className="bg-primary">Monthly</Badge>;
    } else if (planType === 'annual') {
      return <Badge className="bg-secondary-600">Annual</Badge>;
    }
    return null;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.firstName || user?.username}</h1>
            <p className="text-gray-600 mt-2">Track your learning progress and continue where you left off.</p>
          </div>
          
          <Tabs defaultValue="courses">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="courses">My Courses</TabsTrigger>
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
            </TabsList>
            
            {/* My Courses */}
            <TabsContent value="courses">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                  // Loading skeletons
                  [...Array(3)].map((_, index) => (
                    <Card key={index}>
                      <Skeleton className="h-48 w-full rounded-t-lg" />
                      <CardHeader className="pb-2">
                        <Skeleton className="h-6 w-4/5" />
                        <Skeleton className="h-4 w-full" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-3/4" />
                      </CardContent>
                      <CardFooter>
                        <Skeleton className="h-9 w-full" />
                      </CardFooter>
                    </Card>
                  ))
                ) : courses && courses.length > 0 ? (
                  // Show courses
                  courses.map((course) => (
                    <Card key={course.id} className="overflow-hidden">
                      <div className="relative h-48">
                        <img 
                          src={course.imageUrl} 
                          alt={course.title} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                          <div className="flex items-center text-white">
                            <BookOpen className="h-4 w-4 mr-2" />
                            <span className="text-sm">Continue learning</span>
                          </div>
                        </div>
                      </div>
                      <CardHeader>
                        <CardTitle>{course.title}</CardTitle>
                        <CardDescription className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{course.duration} hours of content</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-primary h-2.5 rounded-full w-[25%]"></div>
                          </div>
                          <p className="text-sm text-gray-500">25% completed</p>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className="w-full"
                          onClick={() => navigate(`/courses/${course.id}`)}
                        >
                          Continue Learning
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  // No courses message
                  <div className="col-span-full text-center py-12">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No courses yet</h3>
                    <p className="text-gray-500 mb-4">You haven't purchased any courses yet.</p>
                    <Button 
                      onClick={() => navigate("/")}
                    >
                      Browse Courses
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Subscription */}
            <TabsContent value="subscription">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>Subscription Status</CardTitle>
                        {getSubscriptionBadge()}
                      </div>
                      <CardDescription>Manage your subscription plan</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {isLoading ? (
                        <div className="space-y-4">
                          <Skeleton className="h-6 w-full" />
                          <Skeleton className="h-6 w-2/3" />
                          <Skeleton className="h-6 w-1/2" />
                        </div>
                      ) : subscription ? (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="border rounded-lg p-4">
                              <div className="text-sm text-gray-500 mb-1">Plan Type</div>
                              <div className="font-medium">
                                {subscription.planType === 'monthly' ? 'Monthly Subscription' : 'Annual Subscription'}
                              </div>
                            </div>
                            <div className="border rounded-lg p-4">
                              <div className="text-sm text-gray-500 mb-1">Status</div>
                              <div className="font-medium flex items-center">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                                Active
                              </div>
                            </div>
                            <div className="border rounded-lg p-4">
                              <div className="text-sm text-gray-500 mb-1">Start Date</div>
                              <div className="font-medium">
                                {formatDate(subscription.startDate)}
                              </div>
                            </div>
                            <div className="border rounded-lg p-4">
                              <div className="text-sm text-gray-500 mb-1">Next Billing Date</div>
                              <div className="font-medium">
                                {formatDate(subscription.endDate)}
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <div className="flex items-start">
                              <div className="bg-amber-100 rounded-full p-1.5 mr-3">
                                <Calendar className="h-5 w-5 text-amber-600" />
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-amber-900 mb-1">Upcoming Renewal</h4>
                                <p className="text-sm text-amber-700">
                                  Your subscription will automatically renew on {formatDate(subscription.endDate)}.
                                </p>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-8">
                          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
                            <svg className="h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5z" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 mb-1">No Active Subscription</h3>
                          <p className="text-gray-500 mb-4 max-w-md mx-auto">
                            Subscribe to get unlimited access to all courses and premium features.
                          </p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      {subscription ? (
                        <>
                          <Button variant="outline">Cancel Subscription</Button>
                          <Button>Upgrade Plan</Button>
                        </>
                      ) : (
                        <Button 
                          className="w-full"
                          onClick={() => navigate("/#pricing")}
                        >
                          View Subscription Plans
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                </div>
                
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Subscription Benefits</CardTitle>
                      <CardDescription>What's included in your plan</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">Full access to all courses</span>
                        </li>
                        <li className="flex">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">Course certificates</span>
                        </li>
                        <li className="flex">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">Project files & resources</span>
                        </li>
                        <li className="flex">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">Community access</span>
                        </li>
                        {subscription?.planType === 'annual' && (
                          <li className="flex">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                            <span className="text-gray-700">Priority support</span>
                          </li>
                        )}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            {/* Progress */}
            <TabsContent value="progress">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Learning Activity</CardTitle>
                      <CardDescription>Your progress over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
                        <div className="text-center">
                          <ChartBar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">Learning activity will be displayed here</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Achievement Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <BookOpen className="h-5 w-5 text-primary mr-3" />
                          <span>Courses Enrolled</span>
                        </div>
                        <span className="font-medium">{courses?.length || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                          <span>Courses Completed</span>
                        </div>
                        <span className="font-medium">0</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Play className="h-5 w-5 text-blue-500 mr-3" />
                          <span>Hours of Learning</span>
                        </div>
                        <span className="font-medium">0</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Award className="h-5 w-5 text-amber-500 mr-3" />
                          <span>Certificates Earned</span>
                        </div>
                        <span className="font-medium">0</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Learning Goals</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Daily Study Goal</span>
                          <span className="text-sm font-medium">30 min / 1 hr</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-primary h-2.5 rounded-full w-[50%]"></div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Weekly Course Completion</span>
                          <span className="text-sm font-medium">0 / 1</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-primary h-2.5 rounded-full w-[0%]"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
