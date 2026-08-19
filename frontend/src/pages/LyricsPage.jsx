import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  isLyricSaved,
  saveLyricId,
  unsaveLyricId
} from '../utils/storage.js';
import lyricsData from '../data/lyrics.js';

const LyricsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lyric, setLyric] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Language toggle
  // 'english' = original English version
  // 'urdu' = Urdu version
  const [language, setLanguage] = useState('english');

  // Bookmark state
  const [saved, setSaved] = useState(false);

  // Find lyric from local JSON data
  useEffect(() => {
    setLoading(true);
    setError(null);

    const foundLyric = lyricsData.find((item) => item.id === id);

    if (!foundLyric) {
      setError('Lyrics not found');
      setLyric(null);
      setLoading(false);
      return;
    }

    setLyric(foundLyric);
    setSaved(isLyricSaved(foundLyric.id));
    setLoading(false);
  }, [id]);

  // Save / unsave lyric
  const handleBookmarkToggle = () => {
    if (!lyric) return;

    if (saved) {
      unsaveLyricId(lyric.id);
      setSaved(false);
    } else {
      saveLyricId(lyric.id);
      setSaved(true);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  // Error state
  if (error || !lyric) {
    return (
      <div className="empty-state glass-panel">
        <svg
          className="empty-state-icon"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>

        <span className="empty-state-title">
          Error Loading Lyrics
        </span>

        <p className="empty-state-description">
          {error || 'An unexpected error occurred while loading the lyrics.'}
        </p>

        <button
          className="btn-back-home"
          onClick={() => navigate('/')}
        >
          Back to Home
        </button>
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

        <Link
          to={`/category/${encodeURIComponent(lyric.category)}`}
          className="breadcrumb-link"
        >
          {lyric.category}
        </Link>

        <span>/</span>

        <Link
          to={`/category/${encodeURIComponent(lyric.category)}/person/${encodeURIComponent(lyric.person)}`}
          className="breadcrumb-link"
        >
          {lyric.person}
        </Link>

        <span>/</span>

        <span
          style={{
            color: 'var(--text-main)',
            fontWeight: 500
          }}
        >
          {lyric.title}
        </span>
      </div>

      {/* Header Info */}
      <div className="lyrics-header">
        <h1
          className="title-large"
          style={{
            fontSize: '2.5rem',
            marginBottom: '0.25rem'
          }}
        >
          {lyric.title}
        </h1>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.2rem',
            color: 'var(--text-muted)'
          }}
        >


          {lyric.reciter && (
            <div>
              Reciter:{' '}
              <strong style={{ color: 'var(--text-main)' }}>
                {lyric.reciter}
              </strong>
            </div>
          )}
        </div>
      </div>

      {/* Actions Bar */}
      <div className="lyrics-actions-bar">

        {/* Language Toggle */}
        <div className="lang-toggle-group">
          <button
            className={`lang-btn ${
              language === 'english' ? 'active' : ''
            }`}
            onClick={() => setLanguage('english')}
          >
            English
          </button>

          <button
            className={`lang-btn lang-btn-urdu ${
              language === 'urdu' ? 'active' : ''
            }`}
            onClick={() => setLanguage('urdu')}
          >
            اردو
          </button>
        </div>

        {/* Save / Bookmark Button */}
        <button
          className={`bookmark-btn ${saved ? 'saved' : ''}`}
          onClick={handleBookmarkToggle}
        >
          <svg
            width="16"
            height="16"
            fill={saved ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
          </svg>

          {saved ? 'Saved' : 'Save Lyric'}
        </button>
      </div>

      {/* Lyrics */}
      <div
        className="glass-panel"
        style={{
          padding: '3rem 1.5rem',
          marginBottom: '2rem'
        }}
      >
        <div className="lyrics-content-container">

          {language === 'english' ? (
            <p
              className="lyrics-body english"
              style={{
                whiteSpace: 'pre-line'
              }}
            >
              {lyric.lyrics.original}
            </p>
          ) : (
            <p
              className="lyrics-body urdu"
              dir="rtl"
              style={{
                whiteSpace: 'pre-line'
              }}
            >
              {lyric.lyrics.transliteration}
            </p>
          )}

        </div>
      </div>
    </div>
  );
};

export default LyricsPage;