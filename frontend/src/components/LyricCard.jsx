import React from 'react';
import { useNavigate } from 'react-router-dom';

const LyricCard = ({ lyric, index }) => {
  const navigate = useNavigate();

  // Helper to format leading zero
  const formatNumber = (num) => {
    return num < 10 ? `0${num}` : num;
  };

  return (
    <div
      className="item-row"
      onClick={() => navigate(`/lyrics/${lyric.id}`)}
    >
      <div className="item-left">
        <span className="item-number">
          {formatNumber(index + 1)}
        </span>

        <div className="item-info">
          <span className="item-title">
            {lyric.title}
          </span>

          <div className="item-meta">
            <span>{lyric.category}</span>

            <span className="bullet-separator">
              &bull;
            </span>

            <span>{lyric.person}</span>

            {lyric.reciter && (
              <>
                <span className="bullet-separator">
                  &bull;
                </span>

                <span>{lyric.reciter}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="item-right-arrow">
        <svg
          width="20"
          height="20"
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
  );
};

export default LyricCard;