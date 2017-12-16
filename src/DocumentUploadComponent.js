import React, { Component } from 'react';
import './DocumentUploadComponent.css';
import DropboxUploadService from './DropboxUploadService';

class DocumentUploadComponent extends Component {
  render() {
    return (
      <div className="App">
        <form id="image-capture">
          <input type="file"  accept="image/*;capture=camera" />
        </form>
        <button onClick={this.uploadImage}>submit</button>
      </div>
    );
  }

  uploadImage() {
    const input = document.querySelector('input[type=file]');
    new DropboxUploadService().uploadFile(input.files[0]);
  }
}

export default DocumentUploadComponent;
