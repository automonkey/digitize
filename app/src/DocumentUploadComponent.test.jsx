import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import {render, screen, fireEvent, waitFor, getByLabelText, act} from '@testing-library/react'
import { vi } from 'vitest';
import dropboxAccessToken from './dropboxAccessToken';
import DropboxUploadService from './DropboxUploadService';
import RecordNameGenerator from './RecordNameGenerator';
import ImageScaler from './ImageScaler';
import {AppRoutes} from "./routes";
import {AuthProvider} from "./AuthContext";

vi.mock('dropbox', () => ({
  Dropbox: vi.fn(function() {}),
  DropboxAuth: vi.fn(function() {
    return {
      getAuthenticationUrl: () => Promise.resolve('https://mock-auth-url')
    };
  })
}));
vi.mock('./DropboxUploadService');
vi.mock('./RecordNameGenerator');
vi.mock('./ImageScaler');

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

    await testRunner.component.setRecordName('some-name');
    expect(testRunner.component.submitButton()).toBeDisabled();

    await testRunner.component.selectFile();
    expect(testRunner.component.submitButton()).toBeEnabled();

    await testRunner.component.setRecordName('');
    expect(testRunner.component.submitButton()).toBeDisabled();
  });

  it('should disable submit button while uploading file', async () => {
    await testRunner.run();

    await testRunner.component.setRecordName('some-name');
    await testRunner.component.selectFile();
    await testRunner.component.pressSubmitButton();

    expect(testRunner.component.submitButton()).toBeDisabled();
  });

  it('should show success toast after upload completes', async () => {
    await testRunner.run();

    await testRunner.component.setRecordName('my-doc');
    await testRunner.component.selectFile();
    await testRunner.component.pressSubmitButton();
    await testRunner.triggerUploadComplete();

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent("'my-doc' uploaded successfully");
    });
  });

  it('should show error toast when upload fails', async () => {
    testRunner.makeUploadFail();
    await testRunner.run();

    await testRunner.component.setRecordName('my-doc');
    await testRunner.component.selectFile();
    await testRunner.component.pressSubmitButton();

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent("Failed to upload 'my-doc'");
    });
  });

  it('should enable submit button when file upload fails', async () => {
    testRunner.makeUploadFail();
    await testRunner.run();

    await testRunner.component.setRecordName('some-name');
    await testRunner.component.selectFile();
    await testRunner.component.pressSubmitButton();

    await waitFor(() => expect(testRunner.component.submitButton()).toBeEnabled());
  });

  it('should enable submit button when file upload completes', async () => {
    await testRunner.run();

    await testRunner.component.setRecordName('some-name');
    await testRunner.component.selectFile();
    await testRunner.component.pressSubmitButton();
    await testRunner.triggerUploadComplete();

    await waitFor(() => expect(testRunner.component.submitButton()).toBeEnabled());
  });

  it('should upload both scaled and full resolution versions', async () => {
    await testRunner.run();

    await testRunner.component.setRecordName('test-record');
    await testRunner.component.selectFile();
    await testRunner.component.pressSubmitButton();
    await testRunner.triggerUploadComplete();

    await waitFor(() => expect(testRunner.uploadFileMock).toHaveBeenCalledTimes(2));
    expect(testRunner.uploadFileMock).toHaveBeenCalledWith(expect.anything(), 'test-record.jpg', null);
    expect(testRunner.uploadFileMock).toHaveBeenCalledWith(expect.anything(), 'test-record_fullRes.jpg', null);
  });

  it('should display tags', async () => {
    testRunner.makeUploadServiceReturnTags(['a-tag', 'another-tag']);
    await testRunner.run();

    await waitFor(() => {
      const tags = testRunner.component.tags();
      expect(getByLabelText(tags, 'a-tag')).toBeVisible();
      expect(getByLabelText(tags, 'another-tag')).toBeVisible();
    });
  });

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

    expect(screen.getByText('login with Dropbox')).toBeVisible();
  });

  it('should not attempt to fetch tags', async () => {
    await testRunner.run();

    expect(testRunner.fetchTagsMock.mock.calls.length).toBe(0);
  })

});

class TestRunner {
  constructor() {
    this.fetchTagsMock = vi.fn();
    this.fetchTagsMock.mockResolvedValue(['some-tag', 'some-other-tag']);
    this.stubUploadService();
    this.stubRecordNameGenerator();
    this.stubImageScaler();
  }

  stubRecordNameGenerator() {
    RecordNameGenerator.mockImplementation(function() {
      return {
        generate: (name) => ({
          scaledImageFilename: name + '.jpg',
          fullResImageFilename: name + '_fullRes.jpg'
        })
      };
    });
  }

  stubImageScaler() {
    ImageScaler.mockImplementation(function() {
      return {
        scaleFile: (file) => Promise.resolve(file)
      };
    });
  }

  makeUploadServiceReturnTags(tags) {
    this.fetchTagsMock.mockResolvedValue(tags);
  }

  makeUploadFail() {
    this.uploadFileMock.mockRejectedValue(new Error('upload failed'));
  }

  async run() {
    await act(async () => {
      render(<MemoryRouter><AuthProvider><AppRoutes /></AuthProvider></MemoryRouter>);
    });
    this.component = new ComponentTester();
  }

  stubUploadService() {
    const fileUploadCompleted = new Promise(resolve => {
      this.triggerUploadCompleted = resolve;
    });

    this.uploadFileMock = vi.fn().mockImplementation(async () => {
      await fileUploadCompleted;
    });

    const uploadFileMock = this.uploadFileMock;
    const fetchTagsMock = this.fetchTagsMock;
    DropboxUploadService.mockImplementation(function() {
      return {
        fetchTags: fetchTagsMock,
        uploadFile: uploadFileMock
      };
    });
  }

  async triggerUploadComplete() {
    this.triggerUploadCompleted();
  }
}

class ComponentTester {

  submitButton() {
    return screen.getByRole('button', { name: /submit|processing|uploading/i });
  }

  async setRecordName(name) {
    const input = screen.getByLabelText('Name');
    await act(async () => {
      fireEvent.change(input, {target: {value: name}});
    });
  }

  async selectFile() {
    const input = screen.getByLabelText('File');
    await act(async () => {
      fireEvent.change(input, { target: { files: [ 'some-file' ] } });
    });
  }

  async pressSubmitButton() {
    await act(async () => {
      fireEvent.click(this.submitButton());
    });
  }

  tags() {
    return screen.getByRole("group", { name: 'Tag' });
  }
}
