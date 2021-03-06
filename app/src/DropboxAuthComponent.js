import React, { Component } from 'react';
import { Redirect } from 'react-router';
import querystring from 'querystring';
import paths from './paths';

class DropboxAuthComponent extends Component {

  componentWillMount() {
    const qs = querystring.parse(window.location.hash.substr(1));
    localStorage.setItem('dropbox-token', qs['access_token']);
  }

  render() {
    return (
      <Redirect to={paths.documentUpload}/>
    );
  }
}

export default DropboxAuthComponent;
