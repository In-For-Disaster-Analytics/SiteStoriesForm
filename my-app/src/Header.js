import React from 'react';
import Login from './login';

function Header() {
  return (
    <header className="app-header">
      <h1>Site Stories</h1>
      <Login />
    </header>
  );
}

export default Header;