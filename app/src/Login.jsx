import Dropbox from 'dropbox';
import React from 'react';
import './DocumentUploadComponent.css';
import paths from './paths';

const Login = () => {
  const dbx = new Dropbox({ clientId: 'ebbf5ibg99u8ytt' });
  const authUrl = dbx.getAuthenticationUrl(`${window.location.origin}${paths.dropboxAuthToken}`);

  return (
    <div className="Login">
      <a href={authUrl}>login with Dropbox</a>
    </div>
  );
};

export default Login;
