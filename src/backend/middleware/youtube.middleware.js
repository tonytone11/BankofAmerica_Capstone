const axios = require('axios');

// YouTube API middleware factory
const createYoutubeMiddleware = (apiKey) => {
  if (!apiKey) {
    console.warn("WARNING: YouTube API key is not set. YouTube features will not work.");
  }

  // YouTube API URLs
  const YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";
  const YOUTUBE_VIDEOS_URL = "https://www.googleapis.com/youtube/v3/videos";

  return {
    searchVideos: async (req, res) => {
      const { q, safeSearch } = req.query;

      if (!q) {
        return res.status(400).json({ success: false, message: "Query parameter is required" });
      }

      if (!apiKey) {
        return res.status(503).json({ success: false, message: "YouTube API service is unavailable" });
      }

      try {
        const response = await axios.get(YOUTUBE_SEARCH_URL, {
          params: {
            part: "snippet",
            maxResults: 10,
            q: q,
            type: "video",
            safeSearch: safeSearch || "strict", 
            key: apiKey,
          },
        });

        res.json({
          success: true,
          items: response.data.items,
        });
      } catch (error) {
        console.error("YouTube API Error:", error.message);
        res.status(500).json({
          success: false,
          message: "Failed to fetch data from YouTube API",
          error: error.message,
        });
      }
    },

    getVideoDetails: async (req, res) => {
      const { id, safeSearch } = req.query;

      if (!id) {
        return res.status(400).json({ success: false, message: "ID parameter is required" });
      }

      if (!apiKey) {
        return res.status(503).json({ success: false, message: "YouTube API service is unavailable" });
      }

      try {
        const response = await axios.get(YOUTUBE_VIDEOS_URL, {
          params: {
            part: "contentDetails,statistics,snippet",
            id: id,
            safeSearch: safeSearch || "strict",
            key: apiKey,
          },
        });

        res.json({
          success: true,
          items: response.data.items,
        });
      } catch (error) {
        console.error("YouTube API Error:", error.message);
        res.status(500).json({
          success: false,
          message: "Failed to fetch video details",
          error: error.message,
        });
      }
    }
  };
};

module.exports = createYoutubeMiddleware;