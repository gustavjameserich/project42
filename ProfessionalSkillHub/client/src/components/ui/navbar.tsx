import { useState } from "react";
import { useLocation, Link } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, User, LogOut, BookOpen, Home, CreditCard } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const NavLinks = () => (
    <>
      <Link href="/">
        <a className={cn(
          "text-gray-500 hover:text-primary px-3 py-2 text-sm font-medium",
          location === "/" && "text-gray-900 border-b-2 border-primary"
        )}>
          Home
        </a>
      </Link>
      <Link href="/#courses">
        <a className="text-gray-500 hover:text-primary px-3 py-2 text-sm font-medium">
          Courses
        </a>
      </Link>
      <Link href="/#pricing">
        <a className="text-gray-500 hover:text-primary px-3 py-2 text-sm font-medium">
          Pricing
        </a>
      </Link>
      <Link href="#">
        <a className="text-gray-500 hover:text-primary px-3 py-2 text-sm font-medium">
          About
        </a>
      </Link>
    </>
  );

  const MobileNavLinks = () => (
    <>
      <Link href="/">
        <a className={cn(
          "flex items-center text-gray-500 hover:bg-gray-50 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium",
          location === "/" && "bg-primary/10 text-primary"
        )}>
          <Home className="h-5 w-5 mr-2" />
          Home
        </a>
      </Link>
      <Link href="/#courses">
        <a className="flex items-center text-gray-500 hover:bg-gray-50 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium">
          <BookOpen className="h-5 w-5 mr-2" />
          Courses
        </a>
      </Link>
      <Link href="/#pricing">
        <a className="flex items-center text-gray-500 hover:bg-gray-50 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium">
          <CreditCard className="h-5 w-5 mr-2" />
          Pricing
        </a>
      </Link>
      <Link href="#">
        <a className="flex items-center text-gray-500 hover:bg-gray-50 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium">
          About
        </a>
      </Link>
      
      {user ? (
        <>
          <Link href="/dashboard">
            <a className="flex items-center text-gray-500 hover:bg-gray-50 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium">
              <User className="h-5 w-5 mr-2" />
              Dashboard
            </a>
          </Link>
          <button 
            onClick={handleLogout}
            className="flex w-full items-center text-red-600 hover:bg-red-50 px-3 py-2 rounded-md text-base font-medium"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Log out
          </button>
        </>
      ) : (
        <>
          <Link href="/auth">
            <a className="w-full">
              <Button variant="outline" className="w-full justify-start">
                Log in
              </Button>
            </a>
          </Link>
          <Link href="/auth">
            <a className="w-full">
              <Button className="w-full justify-start">
                Sign up
              </Button>
            </a>
          </Link>
        </>
      )}
    </>
  );

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <a className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-primary">DevMastery</span>
              </a>
            </Link>
            <nav className="hidden md:ml-8 md:flex md:space-x-4">
              <NavLinks />
            </nav>
          </div>
          
          <div className="flex items-center">
            {user ? (
              <div className="hidden md:flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        {user.firstName?.charAt(0) || user.username.charAt(0)}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="flex items-center p-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        {user.firstName?.charAt(0) || user.username.charAt(0)}
                      </div>
                      <div className="ml-2">
                        <p className="text-sm font-medium">{user.firstName || user.username}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <Link href="/dashboard">
                      <a>
                        <DropdownMenuItem className="cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          <span>Dashboard</span>
                        </DropdownMenuItem>
                      </a>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-500">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/auth">
                  <Button variant="outline">
                    Log in
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button>
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
            
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden ml-2">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <div className="flex flex-col h-full">
                  <div className="py-4">
                    <Link href="/">
                      <a className="flex items-center" onClick={() => setIsOpen(false)}>
                        <span className="text-xl font-bold text-primary">DevMastery</span>
                      </a>
                    </Link>
                  </div>
                  <div className="flex flex-col space-y-3 py-4" onClick={() => setIsOpen(false)}>
                    <MobileNavLinks />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
