import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router';
import { configure as configureEnzyme, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import DocumentUploadComponent from './DocumentUploadComponent';
import dropboxAccessToken from './dropboxAccessToken';
import paths from './paths';
import DropboxUploadService from './DropboxUploadService';

jest.mock('./DropboxUploadService');

beforeAll(() => {
  configureEnzyme({ adapter: new Adapter() });
  spyOn(dropboxAccessToken, 'getAccessToken').and.returnValue('fake-access-token');
});

describe('when access token is set', () => {

  let testRunner;
  beforeEach(() => {
    spyOn(dropboxAccessToken, 'isSet').and.returnValue(true);
    testRunner = new TestRunner();
  });

  it('should initially have submit button disabled', async () => {
    await testRunner.run();

    expect(testRunner.component.submitButtonEnabled()).toBeFalsy();
  });

  it('should enable submit button only when record name entered and file selected', async () => {
    await testRunner.run();

    testRunner.component.setRecordName('some-name');
    expect(testRunner.component.submitButtonEnabled()).toBeFalsy();

    testRunner.component.selectFile();
    expect(testRunner.component.submitButtonEnabled()).toBeTruthy();

    testRunner.component.setRecordName('');
    expect(testRunner.component.submitButtonEnabled()).toBeFalsy();
  });

  it('should disable form while uploading file', async () => {
    await testRunner.run();

    testRunner.component.setRecordName('some-name');
    testRunner.component.selectFile();
    testRunner.component.pressSubmitButton();

    expect(testRunner.component.formEntryEnabled()).toBeFalsy();
  });

  it('should display tags', async () => {
    testRunner.makeUploadServiceReturnTags(['a-tag', 'another-tag']);
    await testRunner.run();

    expect(testRunner.component.tags()).toEqual(expect.arrayContaining(['a-tag', 'another-tag']));
  });

  it('should enable form when file upload completes', async () => {
    await testRunner.run();

    testRunner.component.setRecordName('some-name');
    testRunner.component.selectFile();
    testRunner.component.pressSubmitButton();
    await testRunner.triggerUploadComplete();

    expect(testRunner.component.formEntryEnabled()).toBeTruthy();
  });
});

describe('when access token is not set', () => {

  beforeEach(() => {
    spyOn(dropboxAccessToken, 'isSet').and.returnValue(false);
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
    const div = document.createElement('div');
    this.component = new ComponentTester(mount(<MemoryRouter><DocumentUploadComponent /></MemoryRouter>, div));
    await allowResolvedAsycOperationsToComplete();
    this.component.forceRender();
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

    await allowResolvedAsycOperationsToComplete();
    this.component.forceRender();
  }
}

class ComponentTester {
  constructor(component) {
    this.component = component;
  }

  submitButtonEnabled() {
    return this.component.find('#submitBtn').props().disabled !== true;
  }

  formEntryEnabled() {
    return this.component.find('fieldset').props().disabled !== true;
  }

  setRecordName(name) {
    this.component.find('input#userSuppliedName').simulate('change', { target: { value: name } });
  }

  selectFile() {
    this.component.find('input#fileSelection').simulate('change', { target: { files: [ 'some-file' ] } });
  }

  pressSubmitButton() {
    this.component.find('#submitBtn').simulate('click');
  }

  tags() {
    return this.component.find('input[name="tag"]')
      .map(n => n.props().value);
  }

  forceRender() {
    this.component.update();
  }
}

async function allowResolvedAsycOperationsToComplete() {
  await new Promise(resolve => setTimeout(resolve, 0));
}
