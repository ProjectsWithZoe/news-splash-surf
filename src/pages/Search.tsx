import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import NewsCard from "@/components/NewsCard";
import Loader from "@/components/Loader";
import { searchNews } from "@/services/newsApi";
import { Button } from "@/components/ui/button";
import { ChevronDown, Search as SearchIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalResults, setTotalResults] = useState(0);

  // Search for articles
  const performSearch = async (resetList = false) => {
    if (!query) return;

    setLoading(true);
    setError(null);

    try {
      const currentPage = resetList ? 1 : page;
      const { articles: searchResults, totalResults } = await searchNews(
        query,
        10,
        currentPage
      );

      setArticles((prevArticles) =>
        resetList ? searchResults : [...prevArticles, ...searchResults]
      );
      setTotalResults(totalResults);
      setHasMore(currentPage * 10 < totalResults);

      if (!resetList) {
        setPage(currentPage + 1);
      } else {
        setPage(2);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search news");
      toast.error("Failed to search for news. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Search when query changes
  useEffect(() => {
    if (query) {
      performSearch(true);
    }

    // Scroll to top
    window.scrollTo(0, 0);
  }, [query]);

  return (
    <div className="min-h-screen pt-20">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <section className="mb-8 pt-4">
          <h1 className="text-4xl font-bold text-center font-serif mb-2">
            Search Results
          </h1>
          {query && (
            <p className="text-center text-muted-foreground max-w-2xl mx-auto">
              Showing results for{" "}
              <span className="font-medium text-foreground">"{query}"</span>
            </p>
          )}
          <Separator className="my-8" />
        </section>

        {error ? (
          <div className="text-center py-16 px-4">
            <div className="glass-effect p-6 max-w-md mx-auto rounded-xl">
              <h2 className="text-xl font-medium mb-4 text-destructive">
                Search failed
              </h2>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button onClick={() => performSearch(true)}>Try Again</Button>
            </div>
          </div>
        ) : loading && articles.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Loader size="large" text={`Searching for "${query}"...`} />
          </div>
        ) : articles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {articles.map((article, index) => (
                <NewsCard
                  key={`${article.url}-${index}`}
                  article={article}
                  index={index}
                />
              ))}
            </div>

            {/* Load more button */}
            {hasMore && (
              <div className="mt-10 text-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => performSearch()}
                  disabled={loading}
                  className="rounded-full px-6 font-medium shadow-subtle"
                >
                  {loading ? (
                    <Loader size="small" className="mr-2" />
                  ) : (
                    <ChevronDown size={18} className="mr-2" />
                  )}
                  Load More
                </Button>
              </div>
            )}

            {/* Results count */}
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Showing {articles.length} of {totalResults} results
            </div>
          </>
        ) : query ? (
          <div className="text-center py-16">
            <div className="glass-effect p-6 max-w-md mx-auto rounded-xl">
              <SearchIcon
                size={48}
                className="mx-auto mb-4 text-muted-foreground"
              />
              <h2 className="text-xl font-medium mb-2">No results found</h2>
              <p className="text-muted-foreground mb-6">
                We couldn't find any articles matching "{query}". Try using
                different keywords.
              </p>
              <Button
                variant="default"
                onClick={() => (window.location.href = "/")}
              >
                Browse Headlines
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">
              Enter a search term to find articles
            </p>
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

export default Search;
