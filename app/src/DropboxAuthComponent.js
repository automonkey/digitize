import React, { Component } from 'react';
import { Redirect } from 'react-router';
import paths from './paths';

class DropboxAuthComponent extends Component {

  componentWillMount() {
    const qs = new URLSearchParams(window.location.hash.substr(1));
    localStorage.setItem('dropbox-token', qs.get('access_token'));
  }

  render() {
    return (
      <Redirect to={paths.documentUpload}/>
    );
  }
}

export default DropboxAuthComponent;
