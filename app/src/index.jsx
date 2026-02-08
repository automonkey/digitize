import React from 'react';
import { createRoot } from 'react-dom/client';
import {BrowserRouter as Router} from 'react-router-dom';
import './index.css';
import {AppRoutes} from "./routes";

const root = createRoot(document.getElementById('root'));
root.render(
  <Router>
    <AppRoutes />
  </Router>
);
