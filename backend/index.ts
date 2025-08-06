import express from "express"
import axios from "axios";
import { JSDOM } from "jsdom";
import type {Product} from './types/Products';
import cors from 'cors'

const app = express();
const PORT = 3000;
app.use(cors());

const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_7_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/117.0",
  "Mozilla/5.0 (Linux; Android 11; SM-G991U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Mobile Safari/537.36",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1"
];

app.get("/api/scrape", async (req, res) => {
  const keyword = req.query.keyword as string;

  if (!keyword) {
    return res.status(400).json({ error: "Keyword is required." });
  }

  const searchURL = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;

try {
const headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Upgrade-Insecure-Requests": "1",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-User": "?1",
  "Connection": "keep-alive",
  "Cookie": `session-id=132-5798828-0695755; session-id-time=2082787201l; i18n-prefs=USD; ubid-main=131-0193036-7793361; session-token=3HRGBGgyuYB4SjjCixp7LZ8Qa/Y5M0OM1wAOmsCUmIDN+ljRuEazc6fD4pS2FyqQdpDxtG2aY8P4a9ylYfnXCG0MrV+zwOH+N3p+TpFcvZEw5FOkuTNlDtO4VMLRWYAlBlgfPoQ7G4K8zCeyMwDNeQD5FBedCqQ531N3Me6lvBd2sKDdi/6CCCs8c8RyTYep5+Ovpx2Tti207PSY5QVesC4zqJedvy9q8OaFZhXgz5ndeuf7kXv3SJ3aM2IL5WqEl+rIeLkAXuXDFZKklTMHJ+NWNWxDd6fwngfGJLO6Ev5kW2oOzkoYeao1apX5jkEijCUaoqWXXhnIBTdepOflbgQPeZwZeTXh; sp-cdn="L5Z9:GB"; lc-main=pt_BR`,
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
