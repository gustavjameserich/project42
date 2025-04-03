import { useParams, useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, CreditCard, Lock, AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { Course, PurchaseType } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/utils";

type CheckoutParams = {
  type: string;
  id?: string;
};

export default function CheckoutPage() {
  const { type, id } = useParams<CheckoutParams>();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Validate purchase type
  const purchaseType = type as PurchaseType;
  const isValidType = ["course", "monthly", "annual"].includes(purchaseType);
  
  // If type is course, we need the course ID and data
  const needsCourseData = purchaseType === "course";
  
  // Fetch course if needed
  const { data: course, isLoading: courseLoading } = useQuery<Course>({
    queryKey: [`/api/courses/${id}`],
    enabled: needsCourseData && !!id,
  });
  
  // Purchase mutation
  const purchaseMutation = useMutation({
    mutationFn: async () => {
      let data = { purchaseType };
      
      if (purchaseType === "course" && id) {
        data = { ...data, courseId: parseInt(id) };
      }
      
      const res = await apiRequest("POST", "/api/purchase", data);
      return await res.json();
    },
    onSuccess: () => {
      // Invalidate relevant queries
      if (purchaseType === "course") {
        queryClient.invalidateQueries({ queryKey: ["/api/user/courses"] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["/api/user/subscription"] });
      }
      
      // Show success toast
      toast({
        title: "Purchase Successful",
        description: purchaseType === "course" 
          ? "You now have access to this course"
          : "Your subscription has been activated",
      });
      
      // Redirect to dashboard
      navigate("/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Purchase Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const isLoading = courseLoading || purchaseMutation.isPending;
  
  // Calculate price based on purchase type
  const calculatePrice = () => {
    if (purchaseType === "course" && course) {
      return course.price;
    } else if (purchaseType === "monthly") {
      return 2900; // $29 per month
    } else if (purchaseType === "annual") {
      return 19900; // $199 per year
    }
    return 0;
  };
  
  const price = calculatePrice();
  
  // Get plan details for subscriptions
  const getPlanDetails = () => {
    if (purchaseType === "monthly") {
      return {
        name: "Monthly Subscription",
        description: "Access all courses and advance your skills faster.",
        billing: "Billed monthly",
        features: [
          "Full access to all courses",
          "Course certificates",
          "Access while subscribed",
          "Project files & resources",
          "Community access"
        ]
      };
    } else if (purchaseType === "annual") {
      return {
        name: "Annual Subscription",
        description: "Complete access with premium features and support.",
        billing: "Billed annually",
        features: [
          "Full access to all courses",
          "Course certificates",
          "Access while subscribed",
          "Project files & resources",
          "Community access",
          "Priority support"
        ]
      };
    }
    return null;
  };
  
  const planDetails = getPlanDetails();
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    purchaseMutation.mutate();
  };
  
  // Error state
  if (!isValidType || (needsCourseData && !id)) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold">Invalid Checkout</h1>
            <p className="mt-2">The checkout information provided is not valid.</p>
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
  
  // Main checkout page
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            className="mb-8"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Checkout</CardTitle>
                  <CardDescription>
                    Complete your purchase
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Payment information */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h3>
                      
                      <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
                        <div className="flex items-center">
                          <div className="w-10 h-6 mr-3 flex items-center">
                            <CreditCard className="h-6 w-6 text-gray-400" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Mock Payment</h4>
                            <p className="text-sm text-gray-500">
                              This is a simulated checkout. No real payment will be processed.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Card Number
                          </label>
                          <input
                            type="text"
                            className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 text-gray-900 focus:ring-primary focus:border-primary"
                            placeholder="4242 4242 4242 4242"
                            disabled
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Expiration Date
                          </label>
                          <input
                            type="text"
                            className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 text-gray-900 focus:ring-primary focus:border-primary"
                            placeholder="MM / YY"
                            disabled
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            CVC
                          </label>
                          <input
                            type="text"
                            className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 text-gray-900 focus:ring-primary focus:border-primary"
                            placeholder="123"
                            disabled
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500">
                        <Lock className="h-4 w-4 mr-1" />
                        <span>Your payment information is secure</span>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Billing information */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Billing Information</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name
                          </label>
                          <input
                            type="text"
                            className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 text-gray-900 focus:ring-primary focus:border-primary"
                            value={`${user?.firstName || ''} ${user?.lastName || ''}`}
                            disabled
                          />
                        </div>
                        
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 text-gray-900 focus:ring-primary focus:border-primary"
                            value={user?.email || ''}
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full py-6 text-lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>Complete Purchase</>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            {/* Order summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoading && needsCourseData ? (
                    <div className="space-y-4">
                      <div className="h-20 bg-gray-100 rounded animate-pulse"></div>
                      <div className="space-y-2">
                        <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse"></div>
                        <div className="h-4 w-1/2 bg-gray-100 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {needsCourseData && course ? (
                        <div className="flex mb-4">
                          <div className="w-20 h-12 bg-gray-100 rounded overflow-hidden mr-3 flex-shrink-0">
                            <img 
                              src={course.imageUrl} 
                              alt={course.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">{course.title}</h4>
                            <p className="text-sm text-gray-500">One-time purchase</p>
                          </div>
                        </div>
                      ) : planDetails && (
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 mb-1">{planDetails.name}</h4>
                          <p className="text-sm text-gray-500">{planDetails.billing}</p>
                        </div>
                      )}
                      
                      <Separator className="my-4" />
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Subtotal</span>
                          <span className="font-medium">{formatPrice(price)}</span>
                        </div>
                        
                        {planDetails && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Billing</span>
                            <span className="font-medium">{planDetails.billing}</span>
                          </div>
                        )}
                        
                        <Separator />
                        
                        <div className="flex justify-between text-lg font-medium">
                          <span>Total</span>
                          <span>{formatPrice(price)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-green-50 rounded-md p-4 mt-6">
                    <div className="flex">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-sm text-green-700">
                        30-Day Money-Back Guarantee
                      </span>
                    </div>
                  </div>
                  
                  {planDetails && (
                    <div className="mt-6">
                      <h4 className="font-medium text-gray-900 mb-3">What's included:</h4>
                      <ul className="space-y-2">
                        {planDetails.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
