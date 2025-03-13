import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Training.css";

const Training = () => {
  const [featuredVideo, setFeaturedVideo] = useState(null);
  const [popularVideos, setPopularVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [error, setError] = useState(null);

  // Get YouTube API key from environment variable
  const API_KEY = import.meta.env.YOUTUBE_API_KEY;

  // Default search query for soccer training videos
  const defaultQuery = "soccer training techniques";
  const categories = [
    "All",
    "Dribbling",
    "Shooting",
    "Passing",
    "Position",
    "Fitness",
  ];

  // Fetch videos on component mount
  useEffect(() => {
    fetchVideos(defaultQuery);
  }, []);

  // Function to fetch videos from YouTube API
  const fetchVideos = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:5000/api/youtube/search", {
        params: {
          q: query,
          safeSearch: "strict",
        },
      });

      // Get video details for duration and view count
      const videoIds = response.data.items.map((item) => item.id.videoId).join(",");
      const videoDetailsResponse = await axios.get("http://localhost:5000/api/youtube/videos", {
        params: {
          id: videoIds,
          key: API_KEY,
        },
      });

      // Process the responses
      const videos = videoDetailsResponse.data.items.map((item) => {
        const duration = item.contentDetails.duration;
        const durationMatch = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        const hours = durationMatch[1] ? durationMatch[1] + ":" : "";
        const minutes = durationMatch[2] ? durationMatch[2] : "0";
        const seconds = durationMatch[3] ? durationMatch[3].padStart(2, "0") : "00";
        const formattedDuration = `${hours}${minutes}:${seconds}`;

        const viewCount = parseInt(item.statistics.viewCount);
        const formattedViewCount =
          viewCount > 1000000
            ? (viewCount / 1000000).toFixed(1) + "M"
            : viewCount > 1000
            ? (viewCount / 1000).toFixed(0) + "K"
            : viewCount;

        return {
          id: item.id,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.high.url,
          channelTitle: item.snippet.channelTitle,
          duration: formattedDuration,
          views: formattedViewCount,
        };
      });

      // Set the first video as featured and the rest as popular
      if (videos.length > 0) {
        setFeaturedVideo(videos[0]);
        setPopularVideos(videos.slice(1, 4));
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
      setError("Failed to fetch videos. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      fetchVideos(searchTerm);
      setSearchTerm("");
    }
  };

  // Handle category click
  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    const query =
      category === "All"
        ? defaultQuery
        : `soccer ${category.toLowerCase()} training`;
    fetchVideos(query);
  };

  // Function to play YouTube video
  const playVideo = (videoId) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank");
  };

  return (
    <div className="page-container">
      <main className="training-container">
        <div className="page-title">
          <h1>Training Videos</h1>
          <p className="subtitle">
            Develop your skills with expert guidance from top-quality training resources
          </p>
        </div>

        <form className="search-container" onSubmit={handleSearch}>
          <div className="search-bar">
            <span className="search-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="11" cy="11" r="8" stroke="#94a3b8" strokeWidth="2" />
                <line x1="16" y1="16" x2="20" y2="20" stroke="#94a3b8" strokeWidth="2" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search for skills, techniques, drills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </form>

        <div className="category-nav">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-pill ${activeCategory === category ? "active" : ""}`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading">Loading videos...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <>
            {featuredVideo && (
              <section className="featured-section">
                <h2>Featured Training</h2>
                <div
                  className="featured-video"
                  onClick={() => playVideo(featuredVideo.id)}
                  style={{
                    backgroundImage: `url(${featuredVideo.thumbnail})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="play-button">
                    <div className="play-icon"></div>
                    <span>PLAY</span>
                  </div>
                </div>
                <h3 className="featured-title">{featuredVideo.title}</h3>
                <p className="video-meta">
                  {featuredVideo.channelTitle} • {featuredVideo.duration} • {featuredVideo.views} views
                </p>
                <button className="save-button">+ Save Video</button>
              </section>
            )}

            <section className="popular-section">
              <h2>Popular Videos</h2>
              <div className="video-grid">
                {popularVideos.map((video) => (
                  <div className="video-card" key={video.id}>
                    <div
                      className="video-thumbnail"
                      onClick={() => playVideo(video.id)}
                      style={{
                        backgroundImage: `url(${video.thumbnail})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <div className="thumbnail-play-button">
                        <div className="thumbnail-play-icon"></div>
                      </div>
                    </div>
                    <div className="video-info">
                      <h4>{video.title}</h4>
                      <p>{video.channelTitle} • {video.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                className="view-more-button"
                onClick={() => fetchVideos(`${activeCategory === "All" ? "" : activeCategory + " "}soccer training more`)}
              >
                View More
              </button>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Training;



