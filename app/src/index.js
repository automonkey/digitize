import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './index.css';
import './DocumentUploadComponent.css';
import DocumentUploadComponent from './DocumentUploadComponent';
import Login from './Login';
import registerServiceWorker from './registerServiceWorker';
import DropboxAuthComponent from './DropboxAuthComponent';
import paths from './paths';

ReactDOM.render(
  <Router>
    <Switch>
      <Route exact path={paths.documentUpload} component={DocumentUploadComponent}/>
      <Route path={paths.login} component={Login}/>
      <Route path={paths.dropboxAuthToken} component={DropboxAuthComponent}/>
    </Switch>
  </Router>,
document.getElementById('root'));
registerServiceWorker();
