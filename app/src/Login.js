import Dropbox from 'dropbox';
import React, { Component } from 'react';
import './DocumentUploadComponent.css';

class Login extends Component {
  render() {

    const dbx = new Dropbox({ clientId: 'ebbf5ibg99u8ytt' });
    const authUrl = dbx.getAuthenticationUrl(`${window.location.origin}/upload`);

    return (
      <div className="Login">
        <a href={authUrl}>login with Dropbox</a>
      </div>
    );
  }


}

export default Login;
