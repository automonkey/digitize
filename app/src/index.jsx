import React from 'react';
import { createRoot } from 'react-dom/client';
import {BrowserRouter as Router} from 'react-router-dom';
import './index.css';
import {AppRoutes} from "./routes";
import {AuthProvider} from "./AuthContext";

const root = createRoot(document.getElementById('root'));
root.render(
  <Router>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </Router>
);
