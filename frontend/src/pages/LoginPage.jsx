import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const success = login(username, password);
    if (!success) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="brand login-brand">
          <span className="brand-mark">LC</span>
          <div className="brand-text">
            <p className="brand-title">Street League</p>
            <p className="brand-subtitle">Portal Access</p>
          </div>
        </div>
        
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Sign In</h2>
          {error && <p className="login-error">{error}</p>}
          
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="Enter username"
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Enter password"
              required 
            />
          </div>
          
          <button type="submit" className="cta-button login-button">
            Login
          </button>
        </form>

        <p className="login-hint">
          Demo: Admin123 (Admin), Coach123 (Coach), Fundraiser123 (Viewer) / Password!
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
