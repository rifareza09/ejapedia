import React, { useEffect } from 'react';
import Layout from '../components/layout/Layout';
import MangaCard from '../components/common/MangaCard';
import useLocalStorage from '../hooks/useLocalStorage';

const Favorites = () => {
  const [favorites] = useLocalStorage('favorites', []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <div className="container" style={{ paddingTop: '20px' }}>
        <h1 style={{ marginBottom: '20px' }}>Komik Favorit Saya</h1>

        {favorites.length > 0 ? (
          <div className="grid">
            {favorites.map(manga => (
              <MangaCard key={manga.param} manga={manga} />
            ))}
          </div>
        ) : (
          <p style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: 'var(--text-secondary)'
          }}>
            Belum ada komik favorit. Mulai tambahkan komik ke favorit Anda!
          </p>
        )}
      </div>
    </Layout>
  );
};

export default Favorites;
