import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import LyricCard from '../components/LyricCard.jsx';
import lyricsData from '../data/lyrics.js';

const PersonPage = () => {
  const { category, person } = useParams();
  const navigate = useNavigate();

  const [lyrics, setLyrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const decodedCategory = decodeURIComponent(category);
    const decodedPerson = decodeURIComponent(person);

    // Normalize names so "Imam Hussain" and "Imam Hussain (ع)"
    // are treated as the same person.
    const normalizePerson = (name) => {
      return name
        .replace(/\s*\([^)]*\)\s*/g, '')
        .trim()
        .toLowerCase();
    };

    const normalizeCategory = (name) => {
      return name.trim().toLowerCase();
    };

    const personLyrics = lyricsData
      .filter(
        (lyric) =>
          normalizeCategory(lyric.category) ===
            normalizeCategory(decodedCategory) &&
          normalizePerson(lyric.person) ===
            normalizePerson(decodedPerson)
      )
      .sort((a, b) => {
        const orderA = a.orderNumber ?? 0;
        const orderB = b.orderNumber ?? 0;

        return orderA - orderB;
      });

    setLyrics(personLyrics);
    setLoading(false);
  }, [category, person]);

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

        <Link
          to={`/category/${encodeURIComponent(category)}`}
          className="breadcrumb-link"
        >
          {category}
        </Link>

        <span>/</span>

        <span
          style={{
            color: 'var(--text-main)',
            fontWeight: 500
          }}
        >
          {person}
        </span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 className="title-large">
          {person}
        </h1>

        <p className="subtitle">
          {category} dedicated to {person}
        </p>
      </div>

      {/* Lyrics */}
      {lyrics.length > 0 ? (
        <div className="list-container">
          {lyrics.map((lyric, index) => (
            <LyricCard
              key={lyric.id}
              lyric={lyric}
              index={index}
            />
          ))}
        </div>
      ) : (
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
            No Lyrics Found
          </span>

          <p className="empty-state-description">
            There are no lyrics found for "{person}" in the "{category}" category.
          </p>

          <button
            className="btn-back-home"
            onClick={() =>
              navigate(`/category/${encodeURIComponent(category)}`)
            }
          >
            Back to {category}
          </button>
        </div>
      )}
    </div>
  );
};

export default PersonPage;