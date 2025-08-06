import express from "express"
import axios from "axios";
import { JSDOM } from "jsdom";
import type {Product} from './types/Products';

const app = express();
const PORT = 3000;

app.get("/api/scrape", async (req, res) => {
  const keyword = req.query.keyword as string;

  if (!keyword) {
    return res.status(400).json({ error: "Keyword is required." });
  }

  const searchURL = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;

  try {
    const response = await axios.get(searchURL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        Referer: "https://www.amazon.com/",
        Connection: "keep-alive",
      },
    });

    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    const productNodes = document.querySelectorAll("div.s-main-slot > div");

    const products: Product[] = [];

    productNodes.forEach((node) => {
      const title = node.querySelector("h2 span")?.textContent?.trim();
      const rating = node.querySelector(".a-icon-alt")?.textContent?.trim();
      const reviews = node
        .querySelector("[aria-label$=' ratings']")
        ?.textContent?.trim();
      const image = node.querySelector("img.s-image")?.getAttribute("src");

      if (title && image) {
        products.push({
          title,
          rating: rating || "N/A",
          reviews: reviews || "N/A",
          image,
        });
      }
    });

    res.json(products);
  } catch (error) {
    console.error("Scraping error:", error);
    res.status(500).json({ error: "Failed to scrape Amazon data." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
