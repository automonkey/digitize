import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, act } from '@testing-library/react';
import { vi } from 'vitest';
import dropboxAccessToken from './dropboxAccessToken';
import DropboxUploadService from './DropboxUploadService';
import { AuthProvider } from './AuthContext';
import { AppRoutes } from './routes';

vi.mock('dropbox', () => ({
  Dropbox: vi.fn(function() {}),
  DropboxAuth: vi.fn(function() {
    return {
      getAuthenticationUrl: () => Promise.resolve('https://mock-auth-url')
    };
  })
}));
vi.mock('./DropboxUploadService');
vi.mock('./ImageScaler');

describe('AuthenticatedLayout', () => {

  beforeEach(() => {
    DropboxUploadService.mockImplementation(function() {
      return {
        fetchTags: vi.fn().mockResolvedValue([]),
        uploadFile: vi.fn()
      };
    });
  });

  describe('when authenticated', () => {
    beforeEach(() => {
      dropboxAccessToken.setAccessToken('fake-access-token');
    });

    it('should render Log out button', async () => {
      await act(async () => {
        render(<MemoryRouter><AuthProvider><AppRoutes /></AuthProvider></MemoryRouter>);
      });

      expect(screen.getByRole('button', { name: 'Log out' })).toBeVisible();
    });

    it('should render Log out button inside Account navigation landmark', async () => {
      await act(async () => {
        render(<MemoryRouter><AuthProvider><AppRoutes /></AuthProvider></MemoryRouter>);
      });

      const nav = screen.getByRole('navigation', { name: 'Account' });
      expect(nav).toBeVisible();
      expect(nav.querySelector('button')).toHaveTextContent('Log out');
    });

    it('should clear token and redirect to login when Log out is clicked', async () => {
      await act(async () => {
        render(<MemoryRouter><AuthProvider><AppRoutes /></AuthProvider></MemoryRouter>);
      });

      await act(async () => {
        screen.getByRole('button', { name: 'Log out' }).click();
      });

      expect(dropboxAccessToken.isSet()).toBe(false);
      expect(screen.getByText('login with Dropbox')).toBeVisible();
    });

    it('should redirect to login when fetchTags triggers an auth error', async () => {
      DropboxUploadService.mockImplementation(function(onAuthError) {
        return {
          fetchTags: vi.fn().mockImplementation(() => {
            onAuthError();
            return Promise.reject(new Error('auth error'));
          }),
          uploadFile: vi.fn()
        };
      });

      await act(async () => {
        render(<MemoryRouter><AuthProvider><AppRoutes /></AuthProvider></MemoryRouter>);
      });

      expect(dropboxAccessToken.isSet()).toBe(false);
      expect(screen.getByText('login with Dropbox')).toBeVisible();
    });

    afterEach(() => {
      dropboxAccessToken.clearAccessToken();
    });
  });

  describe('when not authenticated', () => {
    beforeAll(() => {
      dropboxAccessToken.clearAccessToken();
    });

    it('should redirect to login', async () => {
      await act(async () => {
        render(<MemoryRouter><AuthProvider><AppRoutes /></AuthProvider></MemoryRouter>);
      });

      expect(screen.getByText('login with Dropbox')).toBeVisible();
    });
  });
});
