import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getRelativeTime } from "@/utils/dateUtils";
import { saveArticle } from "@/services/newsApi";
import { ChevronRight, Clock, Share2, Bookmark } from "lucide-react";
import { toast } from "sonner";

interface NewsCardProps {
  index: number;
  compact?: boolean;
}

const NewsCard = ({ article, index, compact = false }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Generate a unique ID for the article if it doesn't have one
  if (!article.id) {
    article.id = btoa(article.url).replace(/=/g, "");
  }

  const handleSaveArticle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    saveArticle(article);
    toast.success("Article saved for later");
  };

  const handleShareArticle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (navigator.share) {
      navigator
        .share({
          title: article.title,
          text: article.description || "",
          url: article.url,
        })
        .then(() => toast.success("Article shared successfully"))
        .catch((error) => console.error("Error sharing article:", error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard
        .writeText(article.url)
        .then(() => toast.success("Article URL copied to clipboard"))
        .catch(() => toast.error("Failed to copy URL"));
    }
  };

  const animationDelay = `${index * 0.05}s`;

  if (compact) {
    return (
      <Link
        to={`/article/${article.id}`}
        className="block group"
        onClick={() => saveArticle(article)}
      >
        <div
          className="flex items-start gap-3 p-3 rounded-md card-hover"
          style={{ animationDelay }}
        >
          {article.photo_url && (
            <div className="relative h-16 w-16 flex-shrink-0 rounded-sm overflow-hidden">
              <img
                src={article.photo_url}
                alt={article.title}
                className={`h-full w-full object-cover transition-all duration-500 ${
                  isImageLoaded ? "blur-0" : "blur-sm"
                }`}
                onLoad={() => setIsImageLoaded(true)}
              />
            </div>
          )}
          <div className="flex-1">
            <h3 className="font-medium line-clamp-2 group-hover:text-primary text-balance transition-colors">
              {article.title}
            </h3>
            <div className="flex items-center mt-1 text-xs text-muted-foreground">
              <Clock size={12} className="mr-1" />
              {/*<span>{getRelativeTime(article.published_datetime_utc)}</span>*/}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div
      className="animate-slide-up opacity-0 overflow-hidden rounded-lg bg-card shadow-subtle card-hover"
      style={{
        animationDelay,
        animationFillMode: "forwards",
      }}
    >
      <Link
        to={`/article/${article.id}`}
        className="block group"
        onClick={() => saveArticle(article)}
      >
        {article.photo_url && (
          <div className="relative aspect-video w-full overflow-hidden">
            <img
              src={article.photo_url}
              alt={article.title}
              className={`h-full w-full object-cover transition-all duration-500 ${
                isImageLoaded ? "blur-0" : "blur-sm"
              }`}
              onLoad={() => setIsImageLoaded(true)}
            />
            {article.source_name && (
              <div className="absolute top-3 left-3">
                <span className="px-2 py-1 text-xs font-medium rounded-md glass-effect">
                  {article.source_name}
                </span>
              </div>
            )}
          </div>
        )}
        <div className="p-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {/*{getRelativeTime(article.published_datetime_utc)}*/}
            </span>
            {article.category && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                {article.category}
              </span>
            )}
          </div>
          <h2 className="text-xl font-medium mb-2 text-balance group-hover:text-primary transition-colors line-clamp-2">
            {article.title}
          </h2>
          {article.description && (
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2 text-balance">
              {article.description}
            </p>
          )}
          <div className="flex items-center justify-between pt-2 border-t border-border/40">
            <div className="flex items-center text-sm font-medium text-primary">
              Read more <ChevronRight size={16} className="ml-1" />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleShareArticle}
                className="p-2 rounded-full hover:bg-muted transition-colors"
                aria-label="Share article"
              >
                <Share2 size={16} />
              </button>
              <button
                onClick={handleSaveArticle}
                className="p-2 rounded-full hover:bg-muted transition-colors"
                aria-label="Save article"
              >
                <Bookmark size={16} />
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default NewsCard;
