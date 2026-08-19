import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar.jsx';
import LyricCard from '../components/LyricCard.jsx';
import SavedGroup from '../components/SavedGroup.jsx';
import { getSavedLyricIds } from '../utils/storage.js';
import lyricsData from '../data/lyrics.js';

const Home = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [savedLyrics, setSavedLyrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  // Load categories and saved lyrics from local data
  useEffect(() => {
    setLoading(true);

    // Get unique categories from lyrics data
  const allCategories = [
  'Nouhay',
  'Salaam',
  'Marsiya',
  'Manqabat',
  'Qasiday',
  'Munajaat',
  'Ziyarat',
  'Duas'
];

setCategories(allCategories);

    // Get saved lyric IDs from localStorage
    const savedIds = getSavedLyricIds();

    // Find saved lyrics from local JSON data
    const saved = lyricsData.filter((lyric) =>
      savedIds.includes(lyric.id)
    );

    setSavedLyrics(saved);

    setLoading(false);
  }, []);

  // Local search
  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      setSearchResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);

    // Small debounce for smooth searching
    const delayDebounceFn = setTimeout(() => {
      const results = lyricsData.filter((lyric) => {
        const title = lyric.title?.toLowerCase() || '';
        const category = lyric.category?.toLowerCase() || '';
        const person = lyric.person?.toLowerCase() || '';
        const original = lyric.lyrics?.original?.toLowerCase() || '';
        const transliteration =
          lyric.lyrics?.transliteration?.toLowerCase() || '';

        return (
          title.includes(query) ||
          category.includes(query) ||
          person.includes(query) ||
          original.includes(query) ||
          transliteration.includes(query)
        );
      });

      setSearchResults(results);
      setSearching(false);
    }, 150);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>

      {/* Search Input */}
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
      />

      {searchQuery ? (
        /* Search Results Mode */
        <div>
          <h2 className="section-title">
            Search Results{' '}
            {searching && (
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 'normal',
                  color: 'var(--text-muted)'
                }}
              >
                (Searching...)
              </span>
            )}
          </h2>

          {searchResults.length > 0 ? (
            <div className="list-container">
              {searchResults.map((lyric, index) => (
                <LyricCard
                  key={lyric.id}
                  lyric={lyric}
                  index={index}
                />
              ))}
            </div>
          ) : (
            !searching && (
              <div className="empty-state">
                <svg
                  className="empty-state-icon"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                  <path d="M8 11h6" />
                </svg>

                <span className="empty-state-title">
                  No Lyrics Found
                </span>

                <p className="empty-state-description">
                  We couldn't find matches for "{searchQuery}".
                  Try another title, person, category, or lyric phrase.
                </p>
              </div>
            )
          )}
        </div>
      ) : (
        /* Default Home Mode */
        <div>

          {/* Main Categories */}
          <h2 className="section-title">
            Categories
          </h2>

          <div className="categories-grid">
            {categories.map((category) => (
              <div
                key={category}
                className="category-card"
                onClick={() =>
                  navigate(
                    `/category/${encodeURIComponent(category)}`
                  )
                }
              >
                <span className="category-title">
                  {category}
                </span>
              </div>
            ))}
          </div>

          {/* Saved Lyrics */}
          <h2 className="section-title">
            Saved Lyrics
          </h2>

          <div className="glass-panel">
            <SavedGroup lyrics={savedLyrics} />
          </div>

        </div>
      )}
    </div>
  );
};

export default Home;