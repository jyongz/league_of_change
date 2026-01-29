import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

const DEMO_USERS = [
  { username: 'Coach123', password: 'Password!', role: 'coach', name: 'Alex Coach', staffId: 'STF-001' },
  { username: 'Admin123', password: 'Password!', role: 'admin', name: 'Jordan Admin', staffId: 'STF-003' },
  { username: 'Fundraiser123', password: 'Password!', role: 'viewer', name: 'Sam Viewer' },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (username, password) => {
    const foundUser = DEMO_USERS.find(u => u.username === username && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
