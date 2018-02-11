import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router';
import { configure as configureEnzyme, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import DocumentUploadComponent from './DocumentUploadComponent';
import dropboxAccessToken from './dropboxAccessToken';
import paths from './paths';
import dropboxUploadService from './dropboxUploadService';

beforeAll(() => {
  configureEnzyme({ adapter: new Adapter() });
  spyOn(dropboxAccessToken, 'getAccessToken').and.returnValue('fake-access-token');
});

describe('when access token is set', () => {

  let testRunner;
  let component;
  beforeEach(() => {
    spyOn(dropboxAccessToken, 'isSet').and.returnValue(true);
    testRunner = new TestRunner();
    component = testRunner.component;
  });

  it('should initially have submit button disabled', () => {
    expect(component.submitButtonEnabled()).toBeFalsy();
  });

  it('should enable submit button only when record name entered and file selected', () => {
    component.setRecordName('some-name');
    expect(component.submitButtonEnabled()).toBeFalsy();

    component.selectFile();
    expect(component.submitButtonEnabled()).toBeTruthy();

    component.setRecordName('');
    expect(component.submitButtonEnabled()).toBeFalsy();
  });

  it('should disable form while uploading file', async () => {
    component.setRecordName('some-name');
    component.selectFile();
    component.pressSubmitButton();

    expect(component.formEntryEnabled()).toBeFalsy();
  });

  it('should enable form when file upload completes', async () => {
    component.setRecordName('some-name');
    component.selectFile();
    component.pressSubmitButton();
    await testRunner.triggerUploadComplete();

    expect(component.formEntryEnabled()).toBeTruthy();
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

class TestRunner {
  constructor() {
    this.stubFileUpload();

    const div = document.createElement('div');
    this.component = new ComponentTester(mount(<DocumentUploadComponent />, div))
  }

  stubFileUpload() {
    const fileUploadCompleted = new Promise(resolve => {
      this.triggerUploadCompleted = resolve;
    });
    spyOn(dropboxUploadService, 'uploadFile').and.callFake(async () => {
      await fileUploadCompleted;
    });
  }

  async triggerUploadComplete() {
    this.triggerUploadCompleted();

    await allowResolvedAsycOperationsToComplete();
    this.component.forceRender();

    async function allowResolvedAsycOperationsToComplete() {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
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

  forceRender() {
    this.component.update();
  }
}
