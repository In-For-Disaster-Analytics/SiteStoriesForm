import Login from "./login";
import favicon from "./favicon.png";
import LoginModal from "./loginModal";
import React, { useState, useEffect } from "react";

function Header( {setUsername}) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUsernameLocal]= useState(localStorage.getItem('userName'))
  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    const jwtExpiration = localStorage.getItem("jwt_expiration");
    setIsLoggedIn(jwt && new Date(jwtExpiration) > new Date());
  }, []);

  return (
    <header className="app-header">
      <img src={favicon} alt="Site Stories Icon" className="header-icon" />
      <h1>Site Stories</h1>
      {isLoggedIn ? (
        <div className="user-greeting">Hello, {userName}</div>
      ) : (
        <>
          {window.innerWidth > 768 ? (
            <Login setUsername={setUsername} onLoginSuccess={() => setIsLoggedIn(true)} />
          ) : (
            <button onClick={() => setShowLoginModal(true)} className="login-button" type="submit">
              Login
            </button>
          )}
          {showLoginModal && (
            <LoginModal onClose={() => setShowLoginModal(false)} setUsername={setUsername} />
          )}
        </>
      ) }
    </header>
  );
}

export default Header;



