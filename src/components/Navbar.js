import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src="/images/danischoollogo.png" alt="Dani School" className="logo-image" />
          <span className="logo-text">Social IQ</span>
        </Link>
        <div className="nav-menu">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            <span className="nav-icon">🏠</span>
            <span className="nav-text">홈</span>
          </Link>
          <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>
            <span className="nav-icon">ℹ️</span>
            <span className="nav-text">소개</span>
          </Link>
          <Link to="/signup" className={`nav-link ${location.pathname === '/signup' ? 'active' : ''}`}>
            <span className="nav-icon">👤</span>
            <span className="nav-text">회원가입</span>
          </Link>
          <Link to="/login" className={`nav-link highlight ${location.pathname === '/login' ? 'active' : ''}`}>
            <span className="nav-icon">🔑</span>
            <span className="nav-text">로그인</span>
          </Link>
          <button 
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="테마 변경"
          >
            <span className="theme-icon">
              {isDarkMode ? '🌙' : '☀️'}
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 