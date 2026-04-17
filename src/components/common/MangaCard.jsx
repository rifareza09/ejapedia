import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import './MangaCard.css';

const MangaCard = ({ manga }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/detail/${manga.param}`);
  };

  // Default placeholder image jika thumbnail kosong
  const thumbnailUrl = manga.thumbnail || manga.cover || manga.image || manga.poster || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="300"%3E%3Crect fill="%23333" width="200" height="300"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="%23fff" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E';

  return (
    <div className="mangaCard" onClick={handleClick} role="button" tabIndex={0}>
      <div className="posterWrapper">
        <img
          src={thumbnailUrl}
          alt={manga.title || 'Manga'}
          className="posterImage"
          loading="lazy"
        />
        {manga.rating && (
          <div className="ratingBadge">
            <Star size={12} fill="#fbbf24" stroke="none" />
            {manga.rating}
          </div>
        )}
        <div className="overlay">
          <h3 className="mangaTitle">{manga.title}</h3>
          {manga.latest_chapter && (
            <p className="mangaMeta">Ch. {manga.latest_chapter}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MangaCard;
