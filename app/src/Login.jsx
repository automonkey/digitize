import { DropboxAuth } from 'dropbox';
import React, { useState, useEffect } from 'react';
import './DocumentUploadComponent.css';
import paths from './paths';

const Login = () => {
  const [authUrl, setAuthUrl] = useState(null);

  useEffect(() => {
    const dbxAuth = new DropboxAuth({ clientId: 'ebbf5ibg99u8ytt' });
    dbxAuth.getAuthenticationUrl(`${window.location.origin}${paths.dropboxAuthToken}`)
      .then(url => setAuthUrl(url));
  }, []);

  if (!authUrl) {
    return <div className="Login">Loading...</div>;
  }

  return (
    <div className="Login">
      <a href={authUrl}>login with Dropbox</a>
    </div>
  );
};

export default Login;
