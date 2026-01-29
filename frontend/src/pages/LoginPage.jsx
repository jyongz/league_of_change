import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const success = login(username, password);
    if (success) {
      navigate('/', { replace: true });
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="brand login-brand">
          <img src={logo} alt="Street League Logo" className="brand-logo" />
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
