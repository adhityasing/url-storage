import React, { useState, useEffect, useCallback } from 'react';
import './Dashboard.css';

function Dashboard({ apiUrl }) {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ target_url: '', code: '' });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fetchLinks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/api/links`);
      if (!response.ok) throw new Error('Failed to fetch links');
      const data = await response.json();
      setLinks(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    try {
      const payload = { target_url: formData.target_url };
      if (formData.code.trim()) {
        payload.code = formData.code.trim();
      }

      const response = await fetch(`${apiUrl}/api/links`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create link');
      }

      setSuccessMessage('Link created successfully!');
      setFormData({ target_url: '', code: '' });
      setShowForm(false);
      fetchLinks();
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (code) => {
    if (!window.confirm('Are you sure you want to delete this link?')) {
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/links/${code}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete link');

      setSuccessMessage('Link deleted successfully!');
      fetchLinks();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setSuccessMessage('Copied to clipboard!');
    setTimeout(() => setSuccessMessage(''), 2000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const truncateUrl = (url, maxLength = 50) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  };

  const filteredLinks = links.filter(link => {
    const search = searchTerm.toLowerCase();
    return (
      link.code.toLowerCase().includes(search) ||
      link.target_url.toLowerCase().includes(search)
    );
  });

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Link Dashboard</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add Link'}
        </button>
      </div>

      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      {error && <div className="alert alert-error">Error: {error}</div>}

      {showForm && (
        <div className="form-card">
          <h3>Create New Link</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="target_url">Target URL *</label>
              <input
                type="url"
                id="target_url"
                value={formData.target_url}
                onChange={(e) =>
                  setFormData({ ...formData, target_url: e.target.value })
                }
                placeholder="https://example.com"
                required
                disabled={formLoading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="code">Custom Code (optional, 6-8 alphanumeric)</label>
              <input
                type="text"
                id="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                placeholder="Leave empty for auto-generated"
                pattern="[A-Za-z0-9]{6,8}"
                disabled={formLoading}
              />
            </div>
            {formError && <div className="form-error">{formError}</div>}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={formLoading}
            >
              {formLoading ? 'Creating...' : 'Create Link'}
            </button>
          </form>
        </div>
      )}

      {links.length > 0 && (
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by code or URL..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      )}

      {loading ? (
        <div className="loading">Loading links...</div>
      ) : filteredLinks.length === 0 ? (
        <div className="empty-state">
          {links.length === 0 ? (
            <>
              <p>No links yet. Create your first short link!</p>
            </>
          ) : (
            <p>No links match your search.</p>
          )}
        </div>
      ) : (
        <div className="table-container">
          <table className="links-table">
            <thead>
              <tr>
                <th>Short Code</th>
                <th>Target URL</th>
                <th>Total Clicks</th>
                <th>Last Clicked</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLinks.map((link) => (
                <tr key={link.code}>
                  <td>
                    <div className="code-cell">
                      <code>{link.code}</code>
                      <button
                        className="btn-icon"
                        onClick={() =>
                          copyToClipboard(`${window.location.origin}/${link.code}`)
                        }
                        title="Copy link"
                      >
                        📋
                      </button>
                    </div>
                  </td>
                  <td>
                    <div className="url-cell" title={link.target_url}>
                      {truncateUrl(link.target_url)}
                    </div>
                  </td>
                  <td>{link.click_count || 0}</td>
                  <td>{formatDate(link.last_clicked_at)}</td>
                  <td>
                    <div className="actions">
                      <a
                        href={`/code/${link.code}`}
                        className="btn btn-small btn-secondary"
                      >
                        Stats
                      </a>
                      <button
                        className="btn btn-small btn-danger"
                        onClick={() => handleDelete(link.code)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Dashboard;

