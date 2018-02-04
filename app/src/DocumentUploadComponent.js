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
      <div className="App">
        <form id="image-capture">
          <input type="text" name="userSuppliedName" />
          <input type="file" accept="image/*;capture=camera" />
        </form>
        <button onClick={this.uploadClicked}>submit</button>
      </div>
    );
  }

  async uploadClicked() {
    const name = document.querySelector('input[name="userSuppliedName"]').value;
    const fileInput = document.querySelector('input[type="file"]');
    const recordName = this.recordNameGenerator.generate(name);
    const uploadService = new DropboxUploadService();

    let uploaded = false;
    try {
      await uploadService.uploadFile(fileInput.files[0], recordName);
      uploaded = true;
    } catch (err) {
    }
    console.log(`${uploaded ? "Uploaded" : "Failed to upload"} record '${name}'`)
  }
}

export default DocumentUploadComponent;
