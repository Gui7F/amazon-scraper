import express from "express"
import axios from "axios";
import { JSDOM } from "jsdom";
import type {Product} from './types/Products';
import cors from 'cors'

const app = express();
const PORT = 3000;
app.use(cors());
const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...",
  "Mozilla/5.0 (X11; Linux x86_64)...",
];

app.get("/api/scrape", async (req, res) => {
  const keyword = req.query.keyword as string;

  if (!keyword) {
    return res.status(400).json({ error: "Keyword is required." });
  }

  const searchURL = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;

try {
  const headers = {
    "User-Agent": userAgents[Math.floor(Math.random() * userAgents.length)],
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    Referer: "https://www.amazon.com/",
    Connection: "keep-alive",
  };

  const response = await axios.get(searchURL, { headers });


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
