import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play, Star } from 'lucide-react';
import './HeroBanner.css';

const HeroBanner = ({ items = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (items.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [items.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  if (items.length === 0) return null;

  return (
    <div className="heroContainer">
      {items.map((item, index) => {
        const bgImage = item.thumbnail || item.cover || '';
        return (
          <div
            key={item.id || item.param}
            className={`heroSlide ${index === currentIndex ? 'active' : ''}`}
            style={{ backgroundImage: bgImage ? `url(${bgImage})` : 'linear-gradient(135deg, #333, #555)' }}
          >
          <div className="heroOverlay">
            <div className="heroContent">
              <h1 className="heroTitle">{item.title}</h1>
              <div className="heroInfo">
                {item.rating && (
                  <span className="heroRating">
                    <Star size={16} fill="#fbbf24" stroke="none" />
                    {item.rating}
                  </span>
                )}
                {item.latest_chapter && <span>Ch. {item.latest_chapter}</span>}
              </div>
              <div className="heroActions">
                <button
                  onClick={() => navigate(`/detail/${item.param}`)}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Play size={20} fill="currentColor" />
                  Baca Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
        );
      })}

      <button className="navButton navPrev" onClick={prevSlide}>
        <ChevronLeft size={24} />
      </button>
      <button className="navButton navNext" onClick={nextSlide}>
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default HeroBanner;
