import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router';
import { configure as configureEnzyme, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import DocumentUploadComponent from './DocumentUploadComponent';
import dropboxAccessToken from './dropboxAccessToken';
import paths from './paths';

beforeAll(() => {
  configureEnzyme({ adapter: new Adapter() });
});

describe('when access token is set', () => {

  let component;
  beforeEach(() => {
    spyOn(dropboxAccessToken, 'isSet').and.returnValue(true);
    component = new TestRunner();
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
    const div = document.createElement('div');
    this.component = mount(<DocumentUploadComponent />, div);
  }

  submitButtonEnabled() {
    return this.component.find('#submitBtn').props().disabled !== true;
  }

  setRecordName(name) {
    this.component.find('input#userSuppliedName').simulate('change', { target: { value: name } });
  }

  selectFile() {
    this.component.find('input#fileSelection').simulate('change', { target: { files: [ 'some-file' ] } });
  }
}
