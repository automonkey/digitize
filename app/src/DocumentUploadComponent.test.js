import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router';
import {render, screen, fireEvent, waitFor, getByLabelText} from '@testing-library/react'
import '@testing-library/jest-dom';
import DocumentUploadComponent from './DocumentUploadComponent';
import dropboxAccessToken from './dropboxAccessToken';
import paths from './paths';
import DropboxUploadService from './DropboxUploadService';

jest.mock('./DropboxUploadService');

describe('when access token is set', () => {

  beforeAll(() => {
    dropboxAccessToken.setAccessToken("fake-access-token");
  });

  let testRunner;
  beforeEach(() => {
    testRunner = new TestRunner();
  });

  it('should initially have submit button disabled', async () => {
    await testRunner.run();

    expect(testRunner.component.submitButton()).toBeDisabled();
  });

  it('should enable submit button only when record name entered and file selected', async () => {
    await testRunner.run();

    testRunner.component.setRecordName('some-name');
    expect(testRunner.component.submitButton()).toBeDisabled();

    testRunner.component.selectFile();
    expect(testRunner.component.submitButton()).toBeEnabled();

    testRunner.component.setRecordName('');
    expect(testRunner.component.submitButton()).toBeDisabled();
  });

  it('should disable submit button while uploading file', async () => {
    await testRunner.run();

    testRunner.component.setRecordName('some-name');
    testRunner.component.selectFile();
    testRunner.component.pressSubmitButton();

    expect(testRunner.component.submitButton()).toBeDisabled();
  });

  it('should enable submit button when file upload completes', async () => {
    await testRunner.run();

    testRunner.component.setRecordName('some-name');
    testRunner.component.selectFile();
    testRunner.component.pressSubmitButton();
    await testRunner.triggerUploadComplete();

    await waitFor(() => expect(testRunner.component.submitButton()).toBeEnabled());
  });

  it('should display tags', async () => {
    testRunner.makeUploadServiceReturnTags(['a-tag', 'another-tag']);
    await testRunner.run();

    const tags = testRunner.component.tags();
    expect(getByLabelText(tags, 'a-tag')).toBeVisible();
    expect(getByLabelText(tags, 'another-tag')).toBeVisible();
  });
});


describe('when access token is not set', () => {

  beforeAll(() => {
    dropboxAccessToken.clearAccessToken();
  });

  it('should redirect to /login', () => {
    const div = document.createElement('div');

    const router = ReactDOM.render((
      <MemoryRouter initialEntries={[ { pathname: paths.documentUpload } ]} >
        <DocumentUploadComponent />
      </MemoryRouter>
    ), div);

    expect(router.history.location.pathname).toBe(paths.login)
  });

  it('should not attempt to fetch tags', async () => {
    let testRunner = new TestRunner();
    await testRunner.run();

    expect(testRunner.fetchTagsMock.mock.calls.length).toBe(0);
  })

});

class TestRunner {
  constructor() {
    this.fetchTagsMock = jest.fn();
    this.fetchTagsMock.mockReturnValue(['some-tag', 'some-other-tag']);
    this.stubUploadService();
  }

  makeUploadServiceReturnTags(tags) {
    this.fetchTagsMock.mockReturnValue(tags);
  }

  async run() {
    render(<MemoryRouter><DocumentUploadComponent /></MemoryRouter>)
    this.component = new ComponentTester();
  }

  stubUploadService() {
    const fileUploadCompleted = new Promise(resolve => {
      this.triggerUploadCompleted = resolve;
    });

    DropboxUploadService.mockImplementation(() => {
      return {
        fetchTags: this.fetchTagsMock,
        async uploadFile() {
          await fileUploadCompleted;
        }
      };
    });
  }

  async triggerUploadComplete() {
    this.triggerUploadCompleted();
  }
}

class ComponentTester {

  submitButton() {
    return screen.getByRole('button', { name: 'submit' });
  }

  setRecordName(name) {
    const input = screen.getByLabelText('Name');
    fireEvent.change(input, {target: {value: name}});
  }

  selectFile() {
    const input = screen.getByLabelText('File');
    fireEvent.change(input, { target: { files: [ 'some-file' ] } });
  }

  pressSubmitButton() {
    fireEvent.click(this.submitButton());
  }

  tags() {
    return screen.getByRole("group", { name: 'Tag' });
  }
}
