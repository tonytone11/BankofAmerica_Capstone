// const express = require("express");
// const axios = require("axios");
// const cors = require("cors");
// const dotenv = require("dotenv");

// dotenv.config();

// if (!process.env.YOUTUBE_API_KEY) {
//   console.error("WARNING: YouTube API key is not working");
//   process.exit(1);
// }

// const app = express();
// const PORT = process.env.PORT || 3003;

// app.use(cors());
// app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("YouTube API server is running!");
// });

// // YouTube API URL
// const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3/search";

// // Route to search for YouTube videos
// app.get("/api/youtube/search", async (req, res) => {
//   const { q, safeSearch } = req.query;

//   if (!q) {
//     return res.status(400).json({ success: false, message: "Query parameter is required" });
//   }

//   try {
//     const response = await axios.get(YOUTUBE_API_URL, {
//       params: {
//         part: "snippet",
//         maxResults: 10,
//         q: q,
//         type: "video",
//         safeSearch: safeSearch || "strict", 
//         key: process.env.YOUTUBE_API_KEY,
//       },
//     });

//     res.json({
//       success: true,
//       items: response.data.items,
//     });
//   } catch (error) {
//     console.error("YouTube API Error:", error.message);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch data from YouTube API",
//       error: error.message,
//     });
//   }
// });

// // Route to fetch video details
// app.get("/api/youtube/videos", async (req, res) => {
//   const { id, safeSearch } = req.query;

//   if (!id) {
//     return res.status(400).json({ success: false, message: "ID parameter is required" });
//   }

//   try {
//     const response = await axios.get("https://www.googleapis.com/youtube/v3/videos", {
//       params: {
//         part: "contentDetails,statistics,snippet",
//         id: id,
//         safeSearch: safeSearch || "strict",
//         key: process.env.YOUTUBE_API_KEY,
//       },
//     });

//     res.json({
//       success: true,
//       items: response.data.items,
//     });
//   } catch (error) {
//     console.error("YouTube API Error:", error.message);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch video details",
//       error: error.message,
//     });
//   }
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
