import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import NewsCard from "@/components/NewsCard";
//import { NewsArticle } from '@/services/newsApi';
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const Bookmarks: React.FC = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load bookmarks from localStorage
  useEffect(() => {
    setLoading(true);

    try {
      const bookmarkKeys = Object.keys(localStorage).filter((key) =>
        key.startsWith("article_")
      );
      const savedBookmarks = bookmarkKeys.map((key) =>
        JSON.parse(localStorage.getItem(key) || "{}")
      );

      setBookmarks(savedBookmarks);
    } catch (error) {
      console.error("Error loading bookmarks:", error);
      toast.error("Failed to load bookmarks");
    } finally {
      setLoading(false);
    }

    // Scroll to top
    window.scrollTo(0, 0);
  }, []);

  const handleClearBookmarks = () => {
    // Confirm before clearing
    if (window.confirm("Are you sure you want to clear all bookmarks?")) {
      try {
        // Get all bookmark keys
        const bookmarkKeys = Object.keys(localStorage).filter((key) =>
          key.startsWith("article_")
        );

        // Remove each bookmark
        bookmarkKeys.forEach((key) => localStorage.removeItem(key));

        // Update state
        setBookmarks([]);
        toast.success("All bookmarks cleared");
      } catch (error) {
        console.error("Error clearing bookmarks:", error);
        toast.error("Failed to clear bookmarks");
      }
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <section className="mb-8 pt-4">
          <h1 className="text-4xl font-bold text-center font-serif mb-2">
            Your Bookmarks
          </h1>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto">
            Articles you've saved for later reading
          </p>
          <Separator className="my-8" />
        </section>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-pulse text-primary">
              <Bookmark size={48} />
            </div>
          </div>
        ) : bookmarks.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {bookmarks.map((article, index) => (
                <NewsCard
                  key={article.id || index}
                  article={article}
                  index={index}
                />
              ))}
            </div>

            <div className="text-center mt-8">
              <Button
                variant="outline"
                onClick={handleClearBookmarks}
                className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
              >
                Clear All Bookmarks
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="glass-effect p-6 max-w-md mx-auto rounded-xl">
              <Bookmark
                size={48}
                className="mx-auto mb-4 text-muted-foreground"
              />
              <h2 className="text-xl font-medium mb-2">No bookmarks yet</h2>
              <p className="text-muted-foreground mb-6">
                Save articles for later by clicking the bookmark icon when
                viewing an article.
              </p>
              <Button
                variant="default"
                onClick={() => (window.location.href = "/")}
              >
                Browse Headlines
              </Button>
            </div>
          </div>
        )}
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

export default Bookmarks;
