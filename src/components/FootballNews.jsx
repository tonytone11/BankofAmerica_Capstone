import React, { useState, useEffect } from "react";

export default function FootballNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time with setTimeout
    const timer = setTimeout(() => {
      // Hardcoded news items
      setNews([
        {
          title: "Training videos: Enjoy our newest feature",
          source: "FutureStars Blog"
        },
        {
          title: "FutureStars makes great impact in low-income communities",
          source: "FutureStars Blog"
        }
      ]);
      setLoading(false);
    }, 0); // Small delay to simulate loading

    return () => clearTimeout(timer);
  }, []);

  const renderNews = () => {
    return news.map((item, index) => (
      <div key={index} className="news-item">
        <h4>{item.title}</h4>
        <p className="news-meta">{item.source}</p>
      </div>
    ));
  };

  return (
    <div className="card news-card">
      <div className="card-header">FutureStars NEWS</div>
      <div className="card-content">
        {loading ? (
          <p className="loading">Loading news...</p>
        ) : (
          renderNews()
        )}
      </div>
    </div>
  );
}

