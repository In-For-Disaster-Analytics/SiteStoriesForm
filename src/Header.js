import React, { useState, useEffect } from "react";
import Login from "./login";
import favicon from "./favicon.png";
import LoginModal from "./loginModal";
import { useApp } from "./store/AppContext";

function Header() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const auth = useApp();
  const { state, dispatch } = auth;
  const { isLoggedIn, username } = state;

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    const jwtExpiration = localStorage.getItem("jwt_expiration");
    if (jwt && new Date(jwtExpiration) > new Date()) {
      dispatch({
        type: 'LOGIN',
        payload: {
          username: localStorage.getItem('userName'),
          jwt,
          jwtExpiration
        }
      });
    }
  }, [dispatch]);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('jwt_expiration');
    localStorage.removeItem('userName');
    dispatch({ type: 'LOGOUT' });
  };
  return (
    <header className="app-header">
      <img src={favicon} alt="Site Stories Icon" className="header-icon" />
      <h1>Site Stories</h1>
      {auth.state.isAuthenticated ? (
        <div className="user-greeting">
          Hello, {username}
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      ) : (
        <>
          {window.innerWidth > 768 ? (
            <Login onLoginSuccess={() => {}} />
          ) : (
            <button onClick={() => setShowLoginModal(true)} className="login-button" type="submit">
              Login
            </button>
          )}
          {showLoginModal && (
            <LoginModal onClose={() => setShowLoginModal(false)} />
          )}
        </>
      )}
    </header>
  );
}

export default Header;