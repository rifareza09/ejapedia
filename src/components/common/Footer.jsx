import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{
      padding: '30px 20px',
      textAlign: 'center',
      color: 'var(--text-secondary)',
      marginTop: 'auto',
      borderTop: '1px solid var(--border-color)',
      backgroundColor: 'var(--bg-secondary)'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <p style={{ fontSize: '0.9rem', marginBottom: '15px', lineHeight: '1.6' }}>
          Platform kami mengagregasi data komik dari berbagai sumber API pihak ketiga.
          Semua konten adalah milik dari pemilik hak cipta masing-masing.
        </p>
        <p style={{ marginBottom: '10px' }}>
          <Link to="/disclaimer" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>
            Disclaimer & Kebijakan
          </Link>
        </p>
        <p style={{ fontSize: '0.85rem' }}>
          &copy; {new Date().getFullYear()} KOMIK. Built with React + Vite.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
