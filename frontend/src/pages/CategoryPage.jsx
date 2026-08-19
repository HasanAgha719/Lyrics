import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import lyricsData from '../data/lyrics.js';

const CategoryPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();

  const [peopleGroups, setPeopleGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    // Find all lyrics belonging to this category
    const categoryLyrics = lyricsData.filter(
      (lyric) =>
        lyric.category?.toLowerCase() === category?.toLowerCase()
    );

    // Group lyrics by person
    const counts = categoryLyrics.reduce((acc, lyric) => {
      const person = lyric.person?.trim();

      if (!person) return acc;

      if (!acc[person]) {
        acc[person] = 0;
      }

      acc[person]++;

      return acc;
    }, {});

    // Create person groups automatically
    const groups = Object.keys(counts)
      .map((person) => ({
        name: person,
        count: counts[person]
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    setPeopleGroups(groups);
    setLoading(false);
  }, [category]);

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
          {category}
        </span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 className="title-large">
          {category}
        </h1>

        <p className="subtitle">
          Select a personality to view dedicated{' '}
          {category?.toLowerCase()}
        </p>
      </div>

      {/* Person Groups */}
      {peopleGroups.length > 0 ? (
        <div className="people-grid">

          {peopleGroups.map((group) => (
            <div
              key={group.name}
              className="person-card"
              onClick={() =>
                navigate(
                  `/category/${encodeURIComponent(
                    category
                  )}/person/${encodeURIComponent(
                    group.name
                  )}`
                )
              }
            >

              <div className="person-card-info">

                <span className="person-name">
                  {group.name}
                </span>

                <span className="person-count">
                  {group.count}{' '}
                  {group.count === 1 ? 'item' : 'items'}
                </span>

              </div>

              <div className="item-right-arrow">
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </div>

            </div>
          ))}

        </div>
      ) : (

        /* No people yet */
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
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>

          <span className="empty-state-title">
            No Personalities Found
          </span>

          <p className="empty-state-description">
            There are currently no lyrics recorded under "
            {category}".
          </p>

          <button
            className="btn-back-home"
            onClick={() => navigate('/')}
          >
            Back to Home
          </button>

        </div>
      )}

    </div>
  );
};

export default CategoryPage;