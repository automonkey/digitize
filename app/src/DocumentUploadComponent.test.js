import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router';
import DocumentUploadComponent from './DocumentUploadComponent';
import dropboxAccessToken from './dropboxAccessToken';
import paths from './paths';

describe('when access token is set', () => {

  beforeEach(() => {
    spyOn(dropboxAccessToken, 'isSet').and.returnValue(true);
  });

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<DocumentUploadComponent />, div);
  });
});

describe('when access token is not set', () => {

  beforeEach(() => {
    spyOn(dropboxAccessToken, 'isSet').and.returnValue(false);
  });

  it('should redirect to /login if no access token', () => {
    const div = document.createElement('div');

    const router = ReactDOM.render((
      <MemoryRouter initialEntries={[ { pathname: paths.documentUpload } ]} >
        <DocumentUploadComponent />
      </MemoryRouter>
    ), div);
    expect(router.history.location.pathname).toBe(paths.login)
  });
});
