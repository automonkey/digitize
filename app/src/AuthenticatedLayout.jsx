import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';
import paths from './paths';

const AuthenticatedLayout = () => {
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={paths.login} replace />;
  }

  return (
    <>
      <header>
        <nav aria-label="Account">
          <button type="button" onClick={logout}>Log out</button>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default AuthenticatedLayout;
