import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import dropboxAccessToken from './dropboxAccessToken';
import DropboxUploadService from './DropboxUploadService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(dropboxAccessToken.isSet());

  const refreshAuthenticatedState = useCallback(() => {
    setIsAuthenticated(dropboxAccessToken.isSet());
  }, []);

  const setDropboxAccessToken = useCallback((token) => {
    dropboxAccessToken.setAccessToken(token);
    refreshAuthenticatedState();
  }, [refreshAuthenticatedState]);

  const logout = useCallback(() => {
    dropboxAccessToken.clearAccessToken();
    refreshAuthenticatedState();
  }, [refreshAuthenticatedState]);

  const authContext = useMemo(() => ({ isAuthenticated, setDropboxAccessToken, logout }), [isAuthenticated, setDropboxAccessToken, logout]);

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export const useDropboxService = () => {
  const { isAuthenticated, logout } = useAuth();
  return useMemo(() => new DropboxUploadService(logout), [isAuthenticated, logout]);
};
