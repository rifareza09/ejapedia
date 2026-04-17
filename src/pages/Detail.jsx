import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Star, Heart, ChevronRight } from 'lucide-react';
import { LoadingSpinner } from '../components/common/Skeleton';
import MangaCard from '../components/common/MangaCard';
import api from '../services/api';
import useLocalStorage from '../hooks/useLocalStorage';
import './Detail.css';

const Detail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useLocalStorage('favorites', []);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const detailRes = await api.getMangaDetail(slug);
        // detailRes structure: {data: {data: ...}}
        const mangaArray = detailRes.data?.data || [];
        const mangaData = Array.isArray(mangaArray) ? mangaArray[0] : mangaArray;
        setDetail(mangaData);

        const chaptersRes = await api.getMangaChapters(slug);
        // chaptersRes structure: {data: {data: [...]}}
        let chapterArray = chaptersRes.data?.data || [];
        
        // Sort chapters by SLUG number (the slug contains the true chapter number)
        // Extract chapter number from slug patterns like "manga-chapter-180" or "manga-chapter-00-1"
        chapterArray = chapterArray.sort((a, b) => {
          // Extract first number sequence from slug
          const aMatch = a.slug?.match(/(\d+)/);
          const bMatch = b.slug?.match(/(\d+)/);
          
          const aNum = aMatch ? parseInt(aMatch[1]) : 0;
          const bNum = bMatch ? parseInt(bMatch[1]) : 0;
          
          return bNum - aNum; // Sort REVERSE by slug number so Chapter 1 label = actual Chapter 1
        });
        
        setChapters(chapterArray);

        // Cek apakah di favorit
        setIsFavorite(favorites.some(fav => fav.param === slug));
      } catch (error) {
        console.error('Detail fetch failed:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchDetail();
    }
  }, [slug, favorites]);

  const handleToggleFavorite = () => {
    if (isFavorite) {
      setFavorites(favorites.filter(fav => fav.param !== slug));
    } else {
      setFavorites([...favorites, { ...detail, param: slug }]);
    }
    setIsFavorite(!isFavorite);
  };

  const handleReadChapter = (chapterSlug) => {
    navigate(`/reader/${slug}/${chapterSlug}`);
  };

  if (loading) return <Layout><LoadingSpinner /></Layout>;
  if (!detail) return <Layout><div className="container">Komik tidak ditemukan</div></Layout>;

  return (
    <Layout>
      <div className="container detailContainer" style={{ marginTop: '20px' }}>
        <div className="detailHeader">
          <div className="detailCover">
            <img 
              src={detail.thumbnail || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="250" height="350"%3E%3Crect fill="%23333" width="250" height="350"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="%23fff" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E'} 
              alt={detail.title} 
            />
          </div>
          <div className="detailInfo">
            <h1>{detail.title}</h1>
            {detail.nativeTitle && (
              <p className="detailMeta" style={{ fontSize: '0.9em', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                {detail.nativeTitle}
              </p>
            )}
            
            <div style={{ marginBottom: '15px' }}>
              {detail.status && (
                <p className="detailMeta">
                  <strong>Status:</strong> {detail.status}
                </p>
              )}
              {detail.author && (
                <p className="detailMeta">
                  <strong>Author:</strong> {detail.author}
                </p>
              )}
              {detail.rating && (
                <p className="detailMeta">
                  <Star size={16} fill="#fbbf24" stroke="none" style={{ display: 'inline', marginRight: '5px' }} />
                  {detail.rating}
                </p>
              )}
            </div>

            {detail.genre && detail.genre.length > 0 && (
              <div className="genres">
                {detail.genre.map(g => (
                  <span key={g} className="genreTag">{g}</span>
                ))}
              </div>
            )}

            <button
              className={`btn ${isFavorite ? 'btn-primary' : 'btn-secondary'}`}
              onClick={handleToggleFavorite}
              style={{ marginTop: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
              {isFavorite ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}
            </button>
          </div>
        </div>

        {detail.synopsis && (
          <div className="synopsis">
            <h2>Sinopsis</h2>
            <p>{detail.synopsis}</p>
          </div>
        )}

        <div className="chaptersSection">
          <h2>Daftar Chapter</h2>
          <div className="chapterList">
            {chapters.length > 0 ? (
              chapters.map((chapter, index) => {
                // Extract chapter number from slug (the true chapter number)
                const slugMatch = chapter.slug?.match(/(\d+)/);
                const chapterNum = slugMatch ? parseInt(slugMatch[1]) : chapter.chapter;
                
                return (
                  <div
                    key={index}
                    className="chapterItem"
                    onClick={() => handleReadChapter(chapter.slug)}
                  >
                    <div>
                      <p className="chapterTitle">Chapter {chapterNum}</p>
                      {chapter.release && (
                        <p className="chapterDate">{new Date(chapter.release).toLocaleDateString('id-ID')}</p>
                      )}
                    </div>
                    <ChevronRight size={20} color="var(--text-secondary)" />
                  </div>
                );
              })
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>Belum ada chapter.</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Detail;
