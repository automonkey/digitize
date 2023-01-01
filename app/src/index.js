import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import {Routes} from "./routes";

ReactDOM.render(
  <Router>
    <Routes />
  </Router>,
document.getElementById('root'));
registerServiceWorker();
