import React, { useEffect } from "react";
import Header from "@/components/Header";
import NewsList from "@/components/NewsList";
import { Separator } from "@/components/ui/separator";

const Index: React.FC = () => {
  const date = new Date();
  const todaysDate = date.toUTCString().split(" ");
  const formattedDate =
    todaysDate[0] +
    " " +
    todaysDate[1] +
    " " +
    todaysDate[2] +
    " " +
    todaysDate[3];
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-8">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <section className="mb-8 pt-4">
          <h1 className="text-4xl font-bold text-center font-serif mb-2">
            Daily News
          </h1>
          <h1 className="text-4xl font-bold text-center text-red-500 font-serif mb-2">
            {formattedDate}
          </h1>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto">
            Stay informed with the latest Trumpless / Muskless headlines and
            breaking news from around the world.
          </p>
          <Separator className="my-8" />
        </section>

        <NewsList />
      </main>

      <footer className="mt-20 py-8 border-t">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Daily News. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
