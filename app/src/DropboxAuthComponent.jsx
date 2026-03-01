import React, { useLayoutEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import paths from './paths';

const DropboxAuthComponent = () => {
  const { isAuthenticated, setDropboxAccessToken } = useAuth();

  useLayoutEffect(() => {
    const qs = new URLSearchParams(window.location.hash.slice(1));
    const token = qs.get('access_token');
    if (token) setDropboxAccessToken(token);
  }, [setDropboxAccessToken]);

  const destination = isAuthenticated ? paths.documentUpload : paths.login;

  return (
    <Navigate to={destination} replace />
  );
};

export default DropboxAuthComponent;
