import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import './Stats.css';

function Stats({ apiUrl }) {
  const { code } = useParams();
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/api/links/${code}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Link not found');
        }
        throw new Error('Failed to fetch stats');
      }
      const data = await response.json();
      setLink(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, code]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const shortUrl = `${window.location.origin}/${code}`;

  if (loading) {
    return (
      <div className="stats-page">
        <div className="loading">Loading stats...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stats-page">
        <div className="error-state">
          <h2>Error</h2>
          <p>{error}</p>
          <Link to="/" className="btn btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="stats-page">
      <div className="stats-header">
        <Link to="/" className="back-link">← Back to Dashboard</Link>
        <h2>Link Statistics</h2>
      </div>

      <div className="stats-card">
        <div className="stat-section">
          <h3>Short Code</h3>
          <div className="stat-value code-value">
            <code>{link.code}</code>
            <button
              className="btn-icon"
              onClick={() => copyToClipboard(link.code)}
              title="Copy code"
            >
              📋
            </button>
          </div>
        </div>

        <div className="stat-section">
          <h3>Short URL</h3>
          <div className="stat-value url-value">
            <a href={shortUrl} target="_blank" rel="noopener noreferrer">
              {shortUrl}
            </a>
            <button
              className="btn-icon"
              onClick={() => copyToClipboard(shortUrl)}
              title="Copy URL"
            >
              📋
            </button>
          </div>
        </div>

        <div className="stat-section">
          <h3>Target URL</h3>
          <div className="stat-value">
            <a
              href={link.target_url}
              target="_blank"
              rel="noopener noreferrer"
              className="target-url"
            >
              {link.target_url}
            </a>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-label">Total Clicks</div>
            <div className="stat-number">{link.click_count || 0}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Last Clicked</div>
            <div className="stat-text">{formatDate(link.last_clicked_at)}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Created At</div>
            <div className="stat-text">{formatDate(link.created_at)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stats;

