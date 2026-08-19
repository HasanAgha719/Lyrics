import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SavedGroup from '../components/SavedGroup.jsx';
import { getSavedLyricIds } from '../utils/storage.js';
import lyricsData from '../data/lyrics.js';

const SavedLyricsPage = () => {
  const [savedLyrics, setSavedLyrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const savedIds = getSavedLyricIds();

    // Find saved lyrics directly from local JSON data
    const saved = lyricsData.filter((lyric) =>
      savedIds.includes(lyric.id)
    );

    setSavedLyrics(saved);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <Link to="/" className="breadcrumb-link">
          Home
        </Link>

        <span>/</span>

        <span
          style={{
            color: 'var(--text-main)',
            fontWeight: 500
          }}
        >
          Saved Lyrics
        </span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 className="title-large">
          Saved Lyrics
        </h1>

        <p className="subtitle">
          Your bookmarked items, grouped and organized for quick access offline/locally
        </p>
      </div>

      {/* Saved Lyrics */}
      <div
        className="glass-panel"
        style={{
          minHeight: '300px'
        }}
      >
        <SavedGroup lyrics={savedLyrics} />
      </div>
    </div>
  );
};

export default SavedLyricsPage;