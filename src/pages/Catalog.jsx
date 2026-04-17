import React, { useState, useEffect, useRef, useCallback } from 'react';
import Layout from '../components/layout/Layout';
import MangaCard from '../components/common/MangaCard';
import { SectionSkeleton, SkeletonCard } from '../components/common/Skeleton';
import api from '../services/api';
import './Catalog.css';

const Catalog = () => {
  const [mangas, setMangas] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingGenres, setLoadingGenres] = useState(true);
  const observer = useRef();

  // Fetch genres on mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genreList = await api.getGenres();
        // Filter hanya genre yang punya count > 0
        const filtered = genreList.filter(g => parseInt(g.count) > 0);
        setGenres(filtered);
      } catch (error) {
        console.error('Failed to fetch genres:', error);
      } finally {
        setLoadingGenres(false);
      }
    };

    fetchGenres();
  }, []);

  // Fetch initial manga
  useEffect(() => {
    window.scrollTo(0, 0);
    setPage(1);
    const fetchInitial = async () => {
      setLoading(true);
      try {
        let res;
        if (selectedGenre) {
          res = await api.getMangaByGenre(selectedGenre, 1);
        } else {
          res = await api.getTrendingManga(1);
        }
        setMangas(res.data?.data || []);
        setHasMore(!!res.data?.next_page);
      } catch (error) {
        console.error('Failed to fetch catalog:', error);
        setMangas([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInitial();
  }, [selectedGenre]);

  // Load more pages
  useEffect(() => {
    if (page <= 1) return;

    const fetchMore = async () => {
      setLoadingMore(true);
      try {
        let res;
        if (selectedGenre) {
          res = await api.getMangaByGenre(selectedGenre, page);
        } else {
          res = await api.getTrendingManga(page);
        }
        setMangas(prev => [...prev, ...(res.data?.data || [])]);
        setHasMore(!!res.data?.next_page);
      } catch (error) {
        console.error('Failed to load more:', error);
      } finally {
        setLoadingMore(false);
      }
    };

    fetchMore();
  }, [page, selectedGenre]);

  const lastMangaRef = useCallback(node => {
    if (loadingMore || !hasMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setPage(prev => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loadingMore, hasMore]);

  return (
    <Layout>
      <div className="container" style={{ paddingTop: '20px' }}>
        <h1 style={{ marginBottom: '10px' }}>Katalog Komik</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
          {selectedGenre 
            ? `Komik Genre: ${genres.find(g => g.slug === selectedGenre)?.title || selectedGenre}`
            : 'Semua Komik Trending'}
        </p>

        {/* Genre Filter */}
        <div className="genreFilter">
          <button
            className={`genreTag ${!selectedGenre ? 'active' : ''}`}
            onClick={() => setSelectedGenre(null)}
          >
            Semua
          </button>

          {loadingGenres ? (
            <p style={{ color: 'var(--text-secondary)' }}>Memuat genre...</p>
          ) : (
            genres.map(genre => (
              <button
                key={genre.slug}
                className={`genreTag ${selectedGenre === genre.slug ? 'active' : ''}`}
                onClick={() => setSelectedGenre(genre.slug)}
                title={`${genre.count} komik`}
              >
                {genre.title}
              </button>
            ))
          )}
        </div>

        {/* Manga Grid */}
        {loading ? (
          <SectionSkeleton />
        ) : mangas.length > 0 ? (
          <div className="grid" style={{ marginTop: '30px' }}>
            {mangas.map((item, index) => {
              if (mangas.length === index + 1) {
                return (
                  <div ref={lastMangaRef} key={item.id || item.param}>
                    <MangaCard manga={item} />
                  </div>
                );
              }
              return <MangaCard key={item.id || item.param} manga={item} />;
            })}
          </div>
        ) : (
          <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
            Tidak ada komik ditemukan dalam genre ini.
          </p>
        )}

        {loadingMore && (
          <div className="grid">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {!hasMore && !loading && mangas.length > 0 && (
          <p style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>
            Tidak ada komik lagi yang bisa dimuat.
          </p>
        )}
      </div>
    </Layout>
  );
};

export default Catalog;
