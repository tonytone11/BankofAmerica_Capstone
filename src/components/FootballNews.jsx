import React, { useState, useEffect } from "react";

export default function FootballNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://content.guardianapis.com/search?q=football&section=football&show-fields=headline,trailText&api-key=test"  
        );

        if (!response.ok) {
          throw new Error("Failed to fetch news");
        }

        const data = await response.json();
        
        if (data.response && data.response.results && data.response.results.length > 0) {
          // Transform Guardian API data to our format
          const transformedNews = data.response.results.map(item => ({
            title: item.fields.headline,
            source: "The Guardian"
          }));
          
          setNews(transformedNews);
        } else {
          setUsingFallback(true);
          useFallbackData();
        }
      } catch (err) {
        console.error("Error fetching news:", err.message);
        setError("Failed to load news.");
        setUsingFallback(true);
        useFallbackData();
      } finally {
        setLoading(false);
      }
    };

    const useFallbackData = () => {
      // Fallback news items
      setNews([
        {
          title: "UEFA launches new youth development program",
          source: "UEFA.com"
        },
        {
          title: "Top academy graduates making an impact this season",
          source: "FutureStars Blog"
        }
      ]);
    };

    fetchNews();
  }, []);

  const renderNews = () => {
    return news.slice(0, 2).map((item, index) => (
      <div key={index} className="news-item">
        <h4>{item.title}</h4>
        <p className="news-meta">{item.source}</p>
      </div>
    ));
  };

  return (
    <div className="card news-card">
      <div className="card-header">FOOTBALL NEWS</div>
      <div className="card-content">
        {loading ? (
          <p className="loading">Loading news...</p>
        ) : error ? (
          <div className="news-error">
            <p>{error}</p>
            {usingFallback && (
              <>
                <p className="fallback-notice">Using backup data:</p>
                {renderNews()}
              </>
            )}
          </div>
        ) : (
          <>
            {usingFallback && <p className="fallback-notice">Using backup data:</p>}
            {renderNews()}
          </>
        )}
      </div>
    </div>
  );
}

