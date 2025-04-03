import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "wouter";
import { CircleCheck, SquareDashedMousePointer } from "lucide-react";

export function PricingSection() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const handleSelectSingleCourse = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    navigate("/");
  };

  const handleSelectMonthlySubscription = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    navigate("/checkout/monthly");
  };

  const handleSelectAnnualSubscription = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    navigate("/checkout/annual");
  };

  return (
    <section id="pricing" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Pricing</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Choose the Perfect Plan for You
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Flexible options designed to meet your learning needs and budget.
          </p>
        </div>

        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:grid-cols-3">
          {/* Basic Plan */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900">Single Course</h3>
              <p className="mt-1 text-sm text-gray-500">Perfect if you're looking to learn a specific skill.</p>
              <p className="mt-4">
                <span className="text-3xl font-extrabold text-gray-900">$89</span>
                <span className="text-sm font-medium text-gray-500 ml-2">one-time</span>
              </p>
              <Button 
                onClick={handleSelectSingleCourse} 
                className="mt-6 w-full"
              >
                Purchase Course
              </Button>
            </div>
            <div className="pt-6 pb-8 px-6">
              <h4 className="text-sm font-medium text-gray-900 tracking-wide uppercase">What's included</h4>
              <ul className="mt-4 space-y-3">
                <li className="flex">
                  <CircleCheck className="text-green-500 flex-shrink-0 h-5 w-5" />
                  <span className="ml-3 text-sm text-gray-500">Full access to selected course</span>
                </li>
                <li className="flex">
                  <CircleCheck className="text-green-500 flex-shrink-0 h-5 w-5" />
                  <span className="ml-3 text-sm text-gray-500">Course certificate</span>
                </li>
                <li className="flex">
                  <CircleCheck className="text-green-500 flex-shrink-0 h-5 w-5" />
                  <span className="ml-3 text-sm text-gray-500">Lifetime access</span>
                </li>
                <li className="flex">
                  <CircleCheck className="text-green-500 flex-shrink-0 h-5 w-5" />
                  <span className="ml-3 text-sm text-gray-500">Project files & resources</span>
                </li>
                <li className="flex text-gray-300">
                  <SquareDashedMousePointer className="text-gray-400 flex-shrink-0 h-5 w-5" />
                  <span className="ml-3 text-sm">Community access</span>
                </li>
                <li className="flex text-gray-300">
                  <SquareDashedMousePointer className="text-gray-400 flex-shrink-0 h-5 w-5" />
                  <span className="ml-3 text-sm">Priority support</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="bg-white border border-primary-200 rounded-lg shadow-lg divide-y divide-gray-200 border-2 relative">
            <div className="absolute -top-5 inset-x-0 flex justify-center">
              <Badge className="bg-primary px-4 py-1 text-sm font-semibold">Popular</Badge>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900">Monthly Subscription</h3>
              <p className="mt-1 text-sm text-gray-500">Access all courses and advance your skills faster.</p>
              <p className="mt-4">
                <span className="text-3xl font-extrabold text-gray-900">$29</span>
                <span className="text-sm font-medium text-gray-500 ml-2">/month</span>
              </p>
              <Button 
                onClick={handleSelectMonthlySubscription} 
                className="mt-6 w-full"
              >
                Start Monthly Plan
              </Button>
            </div>
            <div className="pt-6 pb-8 px-6">
              <h4 className="text-sm font-medium text-gray-900 tracking-wide uppercase">What's included</h4>
              <ul className="mt-4 space-y-3">
                <li className="flex">
                  <CircleCheck className="text-green-500 flex-shrink-0 h-5 w-5" />
                  <span className="ml-3 text-sm text-gray-500">Full access to all courses</span>
                </li>
                <li className="flex">
                  <CircleCheck className="text-green-500 flex-shrink-0 h-5 w-5" />
                  <span className="ml-3 text-sm text-gray-500">Course certificates</span>
                </li>
                <li className="flex">
                  <CircleCheck className="text-green-500 flex-shrink-0 h-5 w-5" />
                  <span className="ml-3 text-sm text-gray-500">Access while subscribed</span>
                </li>
                <li className="flex">
                  <CircleCheck className="text-green-500 flex-shrink-0 h-5 w-5" />
                  <span className="ml-3 text-sm text-gray-500">Project files & resources</span>
                </li>
                <li className="flex">
                  <CircleCheck className="text-green-500 flex-shrink-0 h-5 w-5" />
                  <span className="ml-3 text-sm text-gray-500">Community access</span>
                </li>
                <li className="flex text-gray-300">
                  <SquareDashedMousePointer className="text-gray-400 flex-shrink-0 h-5 w-5" />
                  <span className="ml-3 text-sm">Priority support</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900">Annual Subscription</h3>
              <p className="mt-1 text-sm text-gray-500">Complete access with premium features and support.</p>
              <p className="mt-4">
                <span className="text-3xl font-extrabold text-gray-900">$199</span>
                <span className="text-sm font-medium text-gray-500 ml-2">/year</span>
              </p>
              <Button 
                onClick={handleSelectAnnualSubscription} 
                className="mt-6 w-full"
              >
                Start Annual Plan
              </Button>
            </div>
            <div className="pt-6 pb-8 px-6">
              <h4 className="text-sm font-medium text-gray-900 tracking-wide uppercase">What's included</h4>
              <ul className="mt-4 space-y-3">
                <li className="flex">
                  <CircleCheck className="text-green-500 flex-shrink-0 h-5 w-5" />
                  <span className="ml-3 text-sm text-gray-500">Full access to all courses</span>
                </li>
                <li className="flex">
                  <CircleCheck className="text-green-500 flex-shrink-0 h-5 w-5" />
                  <span className="ml-3 text-sm text-gray-500">Course certificates</span>
                </li>
                <li className="flex">
                  <CircleCheck className="text-green-500 flex-shrink-0 h-5 w-5" />
                  <span className="ml-3 text-sm text-gray-500">Access while subscribed</span>
                </li>
                <li className="flex">
                  <CircleCheck className="text-green-500 flex-shrink-0 h-5 w-5" />
                  <span className="ml-3 text-sm text-gray-500">Project files & resources</span>
                </li>
                <li className="flex">
                  <CircleCheck className="text-green-500 flex-shrink-0 h-5 w-5" />
                  <span className="ml-3 text-sm text-gray-500">Community access</span>
                </li>
                <li className="flex">
                  <CircleCheck className="text-green-500 flex-shrink-0 h-5 w-5" />
                  <span className="ml-3 text-sm text-gray-500">Priority support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
