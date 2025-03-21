
import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from '@/components/Header';

const NotFound: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen pt-20">
      <Header />
      
      <main className="flex flex-col items-center justify-center px-4 py-16 md:py-24">
        <div className="text-center max-w-md mx-auto">
          <div className="relative mb-8">
            <h1 className="text-9xl font-bold text-primary/10">404</h1>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <h2 className="text-2xl font-bold">Page Not Found</h2>
            </div>
          </div>
          
          <p className="text-muted-foreground mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild variant="default">
              <Link to="/" className="inline-flex items-center">
                <ArrowLeft size={16} className="mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
