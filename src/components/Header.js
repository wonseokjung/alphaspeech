import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();

  return (
    <nav className="nav-bar">
      <Link 
        to="/" 
        className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
      >
        홈
      </Link>
      <Link 
        to="/about" 
        className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
      >
        소개
      </Link>
      <Link 
        to="/guide" 
        className={`nav-link ${location.pathname === '/guide' ? 'active' : ''}`}
      >
        이용가이드
      </Link>
      <Link 
        to="/research" 
        className={`nav-link ${location.pathname === '/research' ? 'active' : ''}`}
      >
        연구자료
      </Link>
      <Link 
        to="/contact" 
        className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}
      >
        문의하기
      </Link>
    </nav>
  );
}

export default Header; 