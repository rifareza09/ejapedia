import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { ChevronLeft, ChevronRight, Settings, Moon, Sun, Lock } from 'lucide-react';
import { LoadingSpinner } from '../components/common/Skeleton';
import api from '../services/api';
import useLocalStorage from '../hooks/useLocalStorage';
import './Reader.css';

const Reader = () => {
  const { slug, chapter } = useParams();
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useLocalStorage('readerDarkMode', true);
  const [showSettings, setShowSettings] = useState(false);
  const [readingProgress] = useLocalStorage('readingProgress', {});
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch chapter pages
        const res = await api.getChapterPages(slug, chapter);
        // Handle vharasc API response structure
        let pagesData = [];
        
        if (res.data?.data?.images && Array.isArray(res.data.data.images)) {
          pagesData = res.data.data.images.map((img, idx) => ({
            id: idx + 1,
            image: img
          }));
        } else if (res.data?.images && Array.isArray(res.data.images)) {
          pagesData = res.data.images.map((img, idx) => ({
            id: idx + 1,
            image: img
          }));
        } else if (Array.isArray(res.data?.data)) {
          pagesData = res.data.data.map((img, idx) => ({
            id: idx + 1,
            image: img
          }));
        }
        
        setPages(pagesData);
        
        // Also fetch chapter list for next/prev navigation
        const chaptersRes = await api.getMangaChapters(slug);
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
      } catch (error) {
        // For now, show demo pages if any error
        // In production, distinguish between auth errors and other errors
        const demoPages = [
          { id: 1, image: 'https://picsum.photos/350/500?random=1' },
          { id: 2, image: 'https://picsum.photos/350/500?random=2' },
          { id: 3, image: 'https://picsum.photos/350/500?random=3' }
        ];
        setPages(demoPages);
        setAuthError(true);
      } finally {
        setLoading(false);
      }
    };

    if (slug && chapter) {
      fetchData();
    }
  }, [slug, chapter]);

  const handlePrevChapter = () => {
    // Go to next chapter (newer, since chapters sorted latest-first)
    const currentIdx = chapters.findIndex(ch => ch.slug === chapter);
    if (currentIdx > 0 && chapters[currentIdx - 1]) {
      navigate(`/reader/${slug}/${chapters[currentIdx - 1].slug}`);
    }
  };

  const handleNextChapter = () => {
    // Go to previous chapter (older, since chapters sorted latest-first)
    const currentIdx = chapters.findIndex(ch => ch.slug === chapter);
    if (currentIdx < chapters.length - 1 && chapters[currentIdx + 1]) {
      navigate(`/reader/${slug}/${chapters[currentIdx + 1].slug}`);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div style={{ backgroundColor: darkMode ? 'var(--bg-primary)' : '#f5f5f5', minHeight: '100vh' }}>
      <div className="readerHeader">
        <button className="readerIconButton" onClick={() => navigate(`/detail/${slug}`)}>
          <ChevronLeft size={24} />
        </button>
        <h2 style={{ margin: 0 }}>Chapter {chapter}</h2>
        <button className="readerIconButton" onClick={() => setShowSettings(!showSettings)}>
          <Settings size={24} />
        </button>
      </div>

      {showSettings && (
        <div className="readerSettings">
          <button className="settingButton" onClick={toggleDarkMode}>
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      )}

      <div className="readerContainer">
        {authError && (
          <div style={{
            backgroundColor: 'rgba(255, 107, 107, 0.1)',
            border: '1px solid #ff6b6b',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px',
            textAlign: 'center'
          }}>
            <Lock size={32} style={{ color: '#ff6b6b', marginBottom: '10px' }} />
            <h3 style={{ color: '#ff6b6b', margin: '10px 0' }}>Konten Memerlukan Autentikasi</h3>
            <p style={{ color: 'var(--text-secondary)', margin: '0' }}>
              API mengharuskan autentikasi untuk membaca chapter. Menampilkan demo halaman...
            </p>
          </div>
        )}
        
        <div className="chapterPages">
          {pages.length > 0 ? (
            pages.map((page, index) => (
              <div
                key={index}
                style={{
                  width: '100%',
                  marginBottom: '10px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  backgroundColor: '#000'
                }}
              >
                {page.image ? (
                  <img 
                    src={page.image} 
                    alt={`Page ${page.id}`}
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block'
                    }}
                    onError={(e) => {
                      e.target.src = 'https://picsum.photos/350/500?random=' + page.id;
                    }}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '500px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#222',
                    color: '#666',
                    fontSize: '18px'
                  }}>
                    Page {page.id}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '40px' }}>
              Halaman tidak ditemukan.
            </p>
          )}
        </div>
      </div>

      <div className="readerFooter">
        <button className="btn btn-secondary" onClick={handlePrevChapter}>
          <ChevronLeft size={20} /> Chapter Sebelumnya
        </button>
        <button className="btn btn-secondary" onClick={handleNextChapter}>
          Chapter Berikutnya <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Reader;
