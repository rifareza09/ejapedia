import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import MangaCard from '../components/common/MangaCard';
import { LoadingSpinner } from '../components/common/Skeleton';
import api from '../services/api';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (query) {
      const fetchSearch = async () => {
        setLoading(true);
        try {
          const res = await api.searchManga(query);
          setResults(res.data?.data || []);
        } catch (error) {
          console.error('Search failed:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchSearch();
    }
  }, [query]);

  return (
    <Layout>
      <div className="container" style={{ paddingTop: '20px' }}>
        <h1 style={{ marginBottom: '20px' }}>Hasil Pencarian: "{query}"</h1>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid">
            {results.length > 0 ? (
              results.map(item => (
                <MangaCard key={item.id || item.param} manga={item} />
              ))
            ) : (
              <p style={{ color: 'var(--text-secondary)', gridColumn: '1/-1' }}>Tidak ada hasil yang ditemukan.</p>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Search;
