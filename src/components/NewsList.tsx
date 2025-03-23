import React, { useState, useEffect } from "react";
import NewsCard from "./NewsCard";
import Loader from "./Loader";
import { NewsArticle, fetchTopHeadlines, categories } from "@/services/newsApi";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface NewsListProps {
  initialCategory?: string;
}

const NewsList: React.FC<NewsListProps> = ({ initialCategory = "WORLD" }) => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const loadNews = async (resetList = false) => {
    try {
      setLoading(true);
      setError(null);

      const currentPage = resetList ? 1 : page;
      const response = await fetch(
        `/api/fetchGeneralNews?country=gb&category=${selectedCategory}`
      );
      const { articles: newArticles, totalResults } = await response.json();

      console.log(articles);

      // Add category to each article
      const articlesWithCategory = newArticles.map((article) => ({
        ...article,
        category: selectedCategory,
      }));

      setArticles((prevArticles) =>
        resetList
          ? articlesWithCategory
          : [...prevArticles, ...articlesWithCategory]
      );
      setTotalResults(totalResults);
      setHasMore(currentPage * 10 < totalResults);

      if (!resetList) {
        setPage(currentPage + 1);
      } else {
        setPage(2);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load news");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews(true);
  }, [selectedCategory]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (error) {
    return (
      <div className="text-center py-16 px-4">
        <div className="glass-effect p-6 max-w-md mx-auto rounded-xl">
          <h2 className="text-xl font-medium mb-4 text-destructive">
            Failed to load news
          </h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => loadNews(true)}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Category selector */}
      <div className="mb-6 overflow-x-auto scrollbar-hide pb-3">
        <div className="flex space-x-2 px-4 lg:px-0">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
              }`}
            >
              {category.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Articles grid */}
      {articles.length > 0 ? (
        <div className="px-4 lg:px-0 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                onClick={() => loadNews()}
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
            Showing {articles.length} of {totalResults} articles
          </div>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader size="large" text="Loading top headlines..." />
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No articles found</p>
        </div>
      )}
    </div>
  );
};

export default NewsList;
