import React from 'react';

export const SkeletonCard = () => (
  <div style={{
    aspectRatio: '2/3',
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: 'var(--border-radius)',
    animation: 'pulse 1.5s infinite'
  }}></div>
);

export const SectionSkeleton = () => (
  <div style={{ padding: '20px 0' }}>
    <div style={{ width: '200px', height: '30px', backgroundColor: 'var(--bg-secondary)', marginBottom: '20px', borderRadius: '4px', animation: 'pulse 1.5s infinite' }}></div>
    <div className="grid">
      {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
    </div>
  </div>
);

export const LoadingSpinner = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '50px 20px',
    gap: '15px',
    flexDirection: 'column'
  }}>
    <div className="spinner" style={{ width: '50px', height: '50px' }}></div>
    <p style={{ color: 'var(--text-secondary)' }}>Memuat...</p>
  </div>
);
