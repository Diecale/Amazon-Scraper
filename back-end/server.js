import express from "express";
import axios from "axios";
import { JSDOM } from "jsdom";
import cors from "cors";

const app = express();
app.use(cors());

// Endpoint to scrape Amazon products
app.get("/api/scrape", async (req, res) => {
  const keyword = req.query.keyword;

  if (!keyword) {
    return res.status(400).json({ error: "Keyword is required" });
  }

  try {
    // Fetch Amazon search results page
    const response = await axios.get(
      `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      }
    );
    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    // Extract product data
    const productListings = [];
    document.querySelectorAll(".s-main-slot .s-result-item").forEach((item) => {
      const title =
        item
          .querySelector(
            ".a-size-base-plus.a-spacing-none.a-color-base.a-text-normal"
          )
          ?.textContent.trim() || "N/A";
      const rating =
        item.querySelector("span.a-icon-alt")?.textContent || "No rating";
      const reviews =
        item.querySelector("span.a-size-base")?.textContent || "0 reviews";
      const imageUrl = item.querySelector("img.s-image")?.src || "No image";

      productListings.push({ title, rating, reviews, imageUrl });
    });

    res.json(productListings);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error fetching data", details: error.message });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
