import React from 'react';
import { Link } from 'react-router-dom';
import { useUserSession } from './UserSessionContext';

function Header() {
  const { user } = useUserSession();

  return (
    <header className="main-header">
      <div className="brand-and-nav">
        <div className="brand">
          <div>Convention</div>
          <div>Pal</div>
        </div>
        <div className="vertical-divider"></div>
      <nav>
        <Link className="home-button" to="/">
          Home
        </Link>
        <Link className="inventory-button" to="/inventory">
          Inventory
        </Link>
        <Link className="convention-button" to="/convention">
          Conventions
        </Link>
        {user ? (
          <span className="welcome-message">Welcome, {user.name}</span>
        ) : (
          <>
            <Link className="register-button" to="/register">
              Register
            </Link>
            <Link className="login-button" to="/login">
              Login
            </Link>
          </>
        )}
      </nav>
      </div>
    </header>
  );
}

export default Header;
