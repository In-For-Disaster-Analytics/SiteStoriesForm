import Login from "./login";
import favicon from "./favicon.png";
import LoginModal from "./loginModal";
import React, { useState } from "react";

function Header() {
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <header className="app-header">
      <img src={favicon} alt="Site Stories Icon" className="header-icon" />
      <h1>Site Stories</h1>
      {window.innerWidth > 768 ? (
        <Login />
      ) : (
        <button onClick={() => setShowLoginModal(true)}   className="login-button"
        type="submit">Login</button>
      )}
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </header>
  );
}

export default Header;
