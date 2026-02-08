import React, { useLayoutEffect } from 'react';
import { Navigate } from 'react-router-dom';
import paths from './paths';

const DropboxAuthComponent = () => {
  useLayoutEffect(() => {
    const qs = new URLSearchParams(window.location.hash.substr(1));
    localStorage.setItem('dropbox-token', qs.get('access_token'));
  }, []);

  return (
    <Navigate to={paths.documentUpload} replace />
  );
};

export default DropboxAuthComponent;
