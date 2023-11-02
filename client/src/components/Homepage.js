import React from 'react';
import { Link } from 'react-router-dom';
function Homepage() {
  return (
    <div>
      <h2>Welcome to Convention Pal</h2>
      <p>If it's your first time here make a new account, if not log in to access your inventory!</p>
      <Link to="/register">
        <button>Register</button>
      </Link>

      <Link to="/login">
        <button>Login</button>
      </Link>
    </div>
  );
}

export default Homepage;