// /api/fetchTopHeadlines.js
import { toast } from "sonner";

const API_KEY = process.env.NEWS_API;
const BASE_URL = "https://newsapi.org/v2/top-headlines?";

export default async function handler(req, res) {
  const { country, category, pageSize = 10, page = 1 } = req.query;

  try {
    const url = `${BASE_URL}country=${country}&category=${category}&pageSize=${pageSize}&page=${page}&apiKey=${API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch news");
    }

    const data = await response.json();
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

    return res.status(200).json({
      articles: newResults,
      totalResults: newResults.length,
    });
  } catch (error) {
    console.error("Error fetching top headlines:", error);
    toast.error("Failed to load news. Please try again later.");
    return res.status(500).json({ error: "Failed to load news" });
  }
}
