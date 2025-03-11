const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

// Check if API key is available
console.log("API Key loaded from .env:", process.env.VITE_YOUTUBE_API_KEY);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Check if API key is available
if (!process.env.VITE_YOUTUBE_API_KEY) {
  console.error("WARNING: YouTube API key is not working");
}

// Basic test route
app.get("/", (req, res) => {
  res.send("YouTube API server is running!");
});

// YouTube API URL
const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3/search";

// Route to search for YouTube videos
app.get("/api/youtube/search", async (req, res) => {
  const { query } = req.query;

  console.log("Received search request for:", query);
  console.log("API Key exists:", process.env.VITE_YOUTUBE_API_KEY);

  if (!query) {
    return res
      .status(400)
      .json({ success: false, message: "Query parameter is required" });
  }

  try {
    console.log("Making request to YouTube API...");
    const response = await axios.get(YOUTUBE_API_URL, {
      params: {
        part: "snippet",
        maxResults: 10,
        q: query,
        type: "video",
        key: process.env.VITE_YOUTUBE_API_KEY,
      },
    });

    console.log(
      "YouTube API response received, items:",
      response.data.items?.length
    );

    res.json({
      success: true,
      results: response.data.items,
    });
  } catch (error) {
    console.error("YouTube API Error:", error.message);

    if (error.response) {
      console.error("Error status:", error.response.status);
      console.error(
        "Error data:",
        JSON.stringify(error.response.data, null, 2)
      );
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch data from YouTube API",
      error: error.message,
      details: error.response?.data || "No additional details",
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
