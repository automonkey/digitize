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

describe('DropboxAuthComponent', () => {

  beforeEach(() => {
    dropboxAccessToken.clearAccessToken();
    DropboxUploadService.mockImplementation(function() {
      return {
        fetchTags: vi.fn().mockResolvedValue([]),
        uploadFile: vi.fn()
      };
    });
  });

  afterEach(() => {
    window.location.hash = '';
    dropboxAccessToken.clearAccessToken();
  });

  it('should store the access token and redirect to authenticated page', async () => {
    window.location.hash = '#access_token=fake-token&token_type=bearer';

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/dbauth']}>
          <AuthProvider><AppRoutes /></AuthProvider>
        </MemoryRouter>
      );
    });

    expect(dropboxAccessToken.isSet()).toBe(true);
    expect(screen.getByRole('button', { name: 'Log out' })).toBeVisible();
  });

  it('should redirect to login when access token is missing from hash', async () => {
    window.location.hash = '';

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/dbauth']}>
          <AuthProvider><AppRoutes /></AuthProvider>
        </MemoryRouter>
      );
    });

    expect(dropboxAccessToken.isSet()).toBe(false);
    expect(screen.getByText('login with Dropbox')).toBeVisible();
  });
});
