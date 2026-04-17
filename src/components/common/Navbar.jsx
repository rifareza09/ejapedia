import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Heart } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
import api from '../../services/api';
import './Navbar.css';

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const debouncedSearchTerm = useDebounce(searchQuery, 500);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedSearchTerm.trim()) {
        try {
          const res = await api.searchManga(debouncedSearchTerm);
          setSearchResults(res.data?.data || []);
          setShowDropdown(true);
        } catch (error) {
          console.error('Search error:', error);
        }
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    };

    fetchResults();
  }, [debouncedSearchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setShowDropdown(false);
      setSearchQuery('');
    }
  };

  const handleResultClick = (manga) => {
    navigate(`/detail/${manga.param}`);
    setShowDropdown(false);
    setSearchQuery('');
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) setTimeout(() => document.querySelector('.searchInput')?.focus(), 100);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <span>EJABACA</span>
      </Link>

      <div className={`navLinks ${isMobileMenuOpen ? 'open' : ''}`}>
        <Link to="/" className="navLink">Beranda</Link>
        <Link to="/catalog" className="navLink">Katalog</Link>
        <Link to="/favorites" className="navLink">Favorit</Link>
      </div>

      <div className="rightSection">
        <div ref={searchRef} style={{ position: 'relative' }}>
          <form className={`searchContainer ${isSearchOpen ? 'active' : ''}`} onSubmit={handleSearchSubmit}>
            <button type="button" className="iconButton" onClick={toggleSearch}>
              <Search size={20} />
            </button>
            <input
              type="text"
              className={`searchInput ${isSearchOpen ? 'open' : ''}`}
              placeholder="Cari komik..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchResults.length > 0) setShowDropdown(true);
              }}
            />
          </form>

          {showDropdown && searchResults.length > 0 && (
            <div className="searchDropdown">
              {searchResults.slice(0, 8).map((item) => (
                <div
                  key={item.id || item.param}
                  className="searchItem"
                  onClick={() => handleResultClick(item)}
                >
                  <img src={item.thumbnail} alt={item.title} className="searchThumbnail" />
                  <div className="searchInfo">
                    <p className="searchTitle">{item.title}</p>
                    {item.latest_chapter && (
                      <p className="searchMeta">Ch. {item.latest_chapter}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button className="hamburgerMenu" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
