import { toast } from "sonner";
import dotenv from "dotenv";

dotenv.config();

// Define the available categories
export const categories = [
  "general",
  "business",
  "entertainment",
  "health",
  "science",
  "sports",
  "technology",
];

// Free News API URL using newsapi.org
// Note: For production, you should use a server-side proxy because this API doesn't allow direct browser requests in production
const API_KEY = process.env.NEWS_API;
const BASE_URL = "https://newsapi.org/v2/top-headlines?";
const date = new Date();
const formattedDate = date.toISOString().split("T")[0];
console.log(formattedDate);

export const fetchTopHeadlines = async (country, category, pageSize, page) => {
  try {
    const url = `${BASE_URL}/?country=${country}&category=${category}&pageSize=${pageSize}&page=${page}&apiKey=${API_KEY}`;
    //const url = `${BASE_URL}country=us&from=${formattedDate}&apiKey=${API_KEY}`;
    console.log(url);
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch news");
    }

    const data = await response.json();
    console.log(data.articles);
    const excludedItems = [
      "Trump",
      "trump",
      "USA",
      "America",
      "Elon",
      "Musk",
      "DOGE",
      "Tesla",
      "US",
    ];

    const newResults = data.articles.filter((article) => {
      return !excludedItems.some((excluded) =>
        article.title.includes(excluded)
      );
    });
    console.log(newResults);
    return {
      articles: newResults,
      totalResults: newResults.length,
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
export const searchNews = async (query, pageSize, page) => {
  try {
    const url = `${BASE_URL}/everything?q=${encodeURIComponent(
      query
    )}&pageSize=${pageSize}&page=${page}&apiKey=${API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to search news");
    }

    const data = await response.json();
    return {
      articles: data.articles,
      totalResults: data.totalResults,
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
export const fetchArticleById = async (id) => {
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

export const saveArticle = (article) => {
  try {
    if (!article.id) {
      article.id = Date.now().toString();
    }
    localStorage.setItem(`article_${article.id}`, JSON.stringify(article));
  } catch (error) {
    console.error("Error saving article:", error);
  }
};
