import React from 'react';
import { useNavigate } from 'react-router-dom';

const SavedGroup = ({ lyrics }) => {
  const navigate = useNavigate();

  if (!lyrics || lyrics.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-state-title">
          No Saved Lyrics
        </span>

        <p className="empty-state-description">
          Lyrics you save will appear here, grouped by category and personality.
        </p>
      </div>
    );
  }

  // Group lyrics: Category -> Person -> Array of Lyrics
  const grouped = lyrics.reduce((acc, lyric) => {
    const { category, person } = lyric;

    if (!acc[category]) {
      acc[category] = {};
    }

    if (!acc[category][person]) {
      acc[category][person] = [];
    }

    acc[category][person].push(lyric);

    return acc;
  }, {});

  // Format double digit numbering
  const formatNumber = (num) => {
    return num < 10 ? `0${num}` : num;
  };

  return (
    <div className="saved-container">
      {Object.keys(grouped).map((category) => (
        <div
          key={category}
          className="saved-group-container"
        >
          <div className="saved-category-header">
            {category}
          </div>

          {Object.keys(grouped[category]).map((person) => (
            <div
              key={person}
              className="saved-person-group"
            >
              <div className="saved-person-header">
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>

                {person}
              </div>

              <div className="saved-items-list">
                {grouped[category][person]
                  .sort(
                    (a, b) =>
                      (a.orderNumber ?? 0) -
                      (b.orderNumber ?? 0)
                  )
                  .map((lyric, idx) => (
                    <div
                      key={lyric.id}
                      className="saved-item-row"
                      onClick={() =>
                        navigate(`/lyrics/${lyric.id}`)
                      }
                    >
                      <span className="saved-item-title">
                        <span
                          style={{
                            color: 'var(--primary)',
                            marginRight: '0.5rem',
                            fontFamily: 'monospace'
                          }}
                        >
                          {formatNumber(idx + 1)}
                        </span>

                        {lyric.title}
                      </span>

                      {lyric.reciter && (
                        <span className="saved-item-reciter">
                          {lyric.reciter}
                        </span>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default SavedGroup;