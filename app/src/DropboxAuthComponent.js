import React, { Component } from 'react';
import { Redirect } from 'react-router';
import querystring from 'querystring';

class DropboxAuthComponent extends Component {

  componentWillMount() {
    const qs = querystring.parse(window.location.hash.substr(1));
    localStorage.setItem('dropbox-token', qs['access_token']);
  }

  render() {
    return (
      <Redirect to="/upload"/>
    );
  }
}

export default DropboxAuthComponent;
