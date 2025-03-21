
import { toast } from "sonner";

// News article interface
export interface NewsArticle {
  id?: string;
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
  category?: string;
}

// Define the available categories
export const categories = [
  "general",
  "business",
  "entertainment",
  "health",
  "science",
  "sports",
  "technology"
];

// Free News API URL using newsapi.org
// Note: For production, you should use a server-side proxy because this API doesn't allow direct browser requests in production
const API_KEY = "2c6818afc7b7470caafa45f1bf922247";
const BASE_URL = "https://newsapi.org/v2";

/**
 * Fetches top headlines for a specific country and category
 * @param country The country code (default: 'us')
 * @param category The news category (default: 'general')
 * @param pageSize Number of articles to fetch (default: 20)
 * @param page Page number (default: 1)
 */
export const fetchTopHeadlines = async (
  country: string = "us",
  category: string = "general",
  pageSize: number = 20,
  page: number = 1
): Promise<{ articles: NewsArticle[], totalResults: number }> => {
  try {
    const url = `${BASE_URL}/top-headlines?country=${country}&category=${category}&pageSize=${pageSize}&page=${page}&apiKey=${API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch news");
    }
    
    const data = await response.json();
    return {
      articles: data.articles,
      totalResults: data.totalResults
    };
  } catch (error) {
    console.error("Error fetching top headlines:", error);
    toast.error("Failed to load news. Please try again later.");
    throw error;
  }
};

/**
 * Searches for news articles
 * @param query The search query
 * @param pageSize Number of articles to fetch (default: 20)
 * @param page Page number (default: 1)
 */
export const searchNews = async (
  query: string,
  pageSize: number = 20,
  page: number = 1
): Promise<{ articles: NewsArticle[], totalResults: number }> => {
  try {
    const url = `${BASE_URL}/everything?q=${encodeURIComponent(query)}&pageSize=${pageSize}&page=${page}&apiKey=${API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to search news");
    }
    
    const data = await response.json();
    return {
      articles: data.articles,
      totalResults: data.totalResults
    };
  } catch (error) {
    console.error("Error searching news:", error);
    toast.error("Failed to search news. Please try again later.");
    throw error;
  }
};

/**
 * Fetches news article details (in a real app, this would fetch from a backend)
 * In this implementation, we simply use the article ID to identify the article
 * In a real app, this would fetch the full article from a backend
 * @param id The article ID
 */
export const fetchArticleById = async (id: string): Promise<NewsArticle | null> => {
  // NOTE: NewsAPI doesn't provide an endpoint to fetch a single article by ID
  // In a real app, you would fetch this from your own backend or database
  // For demo purposes, we'll use localStorage as a simple cache
  try {
    const cachedData = localStorage.getItem(`article_${id}`);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    return null;
  } catch (error) {
    console.error("Error fetching article by ID:", error);
    toast.error("Failed to load article. Please try again later.");
    return null;
  }
};

/**
 * Saves an article to localStorage for demo purposes
 * In a real app, this would be saved to a backend
 * @param article The article to save
 */
export const saveArticle = (article: NewsArticle): void => {
  try {
    if (!article.id) {
      article.id = Date.now().toString();
    }
    localStorage.setItem(`article_${article.id}`, JSON.stringify(article));
  } catch (error) {
    console.error("Error saving article:", error);
  }
};
