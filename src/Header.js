import React from 'react';
import Login from './login';
import favicon from './favicon.png';

function Header() {
  return (
    <header className="app-header">
      <img src={favicon} alt="Site Stories Icon" className="header-icon" />
      <h1>Site Stories</h1>
      <Login />
    </header>
  );
}

export default Header;