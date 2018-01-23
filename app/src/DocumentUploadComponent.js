import React, { Component } from 'react';
import './DocumentUploadComponent.css';
import DropboxUploadService from './DropboxUploadService';
import RecordNameGenerator from './RecordNameGenerator';

class DocumentUploadComponent extends Component {

  constructor() {
    super();
    this.recordNameGenerator = new RecordNameGenerator();
    this.uploadClicked = this.uploadClicked.bind(this);
  }

  render() {
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

  uploadClicked() {
    const name = document.querySelector('input[name="userSuppliedName"]').value;
    const fileInput = document.querySelector('input[type="file"]');
    const recordName = this.recordNameGenerator.generate(name);
    new DropboxUploadService().uploadFile(fileInput.files[0], recordName);
  }
}

export default DocumentUploadComponent;
