import React from 'react';
import { MemoryRouter } from 'react-router';
import {render, screen, fireEvent, waitFor, getByLabelText} from '@testing-library/react'
import '@testing-library/jest-dom';
import dropboxAccessToken from './dropboxAccessToken';
import DropboxUploadService from './DropboxUploadService';
import {Routes} from "./routes";

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

  describe('and fetch tags fails', () => {
    it('should make user re-login', async () => {
      testRunner.makeUploadServiceGiveErrorFetchingTags();
      await testRunner.run();
      expect(screen.getByText('login with Dropbox'));
    })
  })
});


describe('when access token is not set', () => {

  beforeAll(() => {
    dropboxAccessToken.clearAccessToken();
  });

  let testRunner;
  beforeEach(() => {
    testRunner = new TestRunner();
  });

  it('should redirect to /login', async () => {
    await testRunner.run();

    expect(screen.getByText('login with Dropbox'));
  });

  it('should not attempt to fetch tags', async () => {
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

  makeUploadServiceGiveErrorFetchingTags() {
    this.fetchTagsMock.mockImplementation(() => {
      throw new Error();
    });
  }

  async run() {
    render(<MemoryRouter><Routes /></MemoryRouter>)
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
