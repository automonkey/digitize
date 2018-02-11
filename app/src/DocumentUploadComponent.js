import React, { Component } from 'react';
import { Redirect } from 'react-router';
import './DocumentUploadComponent.css';
import DropboxUploadService from './DropboxUploadService';
import RecordNameGenerator from './RecordNameGenerator';
import dropboxAccessToken from './dropboxAccessToken';
import paths from './paths';

class DocumentUploadComponent extends Component {

  constructor() {
    super();
    this.recordNameGenerator = new RecordNameGenerator();
    this.uploadClicked = this.uploadClicked.bind(this);
    this.recordNameUpdated = this.recordNameUpdated.bind(this);
    this.fileSelectionUpdated = this.fileSelectionUpdated.bind(this);
    this.submitButtonShouldBeDisabled = this.submitButtonShouldBeDisabled.bind(this);

    this.state = {
      recordName: '',
      files: []
    };
  }

  render() {
    if(!dropboxAccessToken.isSet()) {
      return (
        <div>
          <Redirect to={paths.login}/>
        </div>
      );
    }

    return (
      <div className="DocumentUploadComponent">
        <form id="image-capture">
          <input id="userSuppliedName" type="text" onChange={this.recordNameUpdated} value={this.state.recordName} />
          <input id="fileSelection" type="file" accept="image/*;capture=camera" onChange={this.fileSelectionUpdated} />
          <button id="submitBtn" disabled={this.submitButtonShouldBeDisabled()} onClick={this.uploadClicked}>submit</button>
        </form>
      </div>
    );

  }

  submitButtonShouldBeDisabled() {
    return !(this.state.recordName && this.state.files.length);
  }

  fileSelectionUpdated(e) {
    this.setState({files: e.target.files});
  }

  recordNameUpdated(e) {
    this.setState({recordName: e.target.value});
  }

  async uploadClicked() {
    const recordName = this.recordNameGenerator.generate(this.state.recordName);
    const uploadService = new DropboxUploadService();

    let uploaded = false;
    try {
      await uploadService.uploadFile(this.state.files[0], recordName);
      uploaded = true;
    } catch (err) {
    }
    console.log(`${uploaded ? "Uploaded" : "Failed to upload"} record '${this.state.recordName}'`)
  }
}

export default DocumentUploadComponent;
