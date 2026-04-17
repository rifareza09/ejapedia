import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import HeroBanner from '../components/home/HeroBanner';
import Section from '../components/layout/Section';
import MangaCard from '../components/common/MangaCard';
import { SectionSkeleton } from '../components/common/Skeleton';
import api from '../services/api';

const Home = () => {
  const [trending, setTrending] = useState([]);
  const [latest, setLatest] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchHome = async () => {
      setLoading(true);
      try {
        const [trendingRes, latestRes] = await Promise.all([
          api.getTrendingManga(1),
          api.getLatestManga(1)
        ]);

        const trendingData = trendingRes?.data?.data || [];
        const latestData = latestRes?.data?.data || [];

        setTrending(trendingData);
        setLatest(latestData);
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHome();
  }, []);

  return (
    <Layout>
      {!loading && trending.length > 0 && <HeroBanner items={trending.slice(0, 5)} />}

      <div className="container">
        {loading ? (
          <>
            <SectionSkeleton />
            <SectionSkeleton />
          </>
        ) : (
          <>
            {latest.length > 0 && (
              <Section title="Komik Terbaru">
                {latest.slice(0, 12).map(item => (
                  <MangaCard key={item.id || item.param} manga={item} />
                ))}
              </Section>
            )}

            {trending.length > 0 && (
              <Section title="Trending Minggu Ini">
                {trending.slice(0, 12).map(item => (
                  <MangaCard key={item.id || item.param} manga={item} />
                ))}
              </Section>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Home;
