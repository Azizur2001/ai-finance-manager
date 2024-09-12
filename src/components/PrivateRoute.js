// src/components/PrivateRoute.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../firebase';

const PrivateRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    isAuthenticated((loggedIn) => {
      setAuth(loggedIn);
      setLoading(false);
      if (!loggedIn) {
        navigate('/login');
      }
    });
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return auth ? children : null;
};

export default PrivateRoute;
