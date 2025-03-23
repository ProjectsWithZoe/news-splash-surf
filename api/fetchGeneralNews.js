// /api/fetchTopHeadlines.js
import { toast } from "sonner";

const API_KEY = process.env.NEWS_API;
const BASE_URL = "https://real-time-news-data.p.rapidapi.com/topic-headlines?";

export default async function handler(req, res) {
  const { country, category } = req.query;

  try {
    const url = `${BASE_URL}topic=${category}&country=${country}`;
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": process.env.RAPID_APIKEY,
        "x-rapidapi-host": process.env.RAPID_API_HOST,
      },
    };
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch news");
    }

    const data = await response.json();
    const results = data.data;
    console.log(results);
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
      "Horoscope",
    ];

    const newResults = results.articles.filter((article) => {
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
