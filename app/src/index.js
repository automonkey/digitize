import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './index.css';
import DocumentUploadComponent from './DocumentUploadComponent';
import Login from './Login';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <Router>
    <Switch>
      <Route exact path="/" component={Login}/>
      <Route path="/upload" component={DocumentUploadComponent}/>
    </Switch>
  </Router>,
document.getElementById('root'));
registerServiceWorker();
