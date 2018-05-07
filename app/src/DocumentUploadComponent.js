import React, { Component } from 'react';
import { Redirect } from 'react-router';
import './DocumentUploadComponent.scss';
import DropboxUploadService from './DropboxUploadService';
import RecordNameGenerator from './RecordNameGenerator';
import dropboxAccessToken from './dropboxAccessToken';
import paths from './paths';

import './DocumentUploadComponent.scss';

class DocumentUploadComponent extends Component {

  constructor() {
    super();

    this.dropboxUploadService = new DropboxUploadService();
    this.recordNameGenerator = new RecordNameGenerator();
    this.uploadClicked = this.uploadClicked.bind(this);
    this.recordNameUpdated = this.recordNameUpdated.bind(this);
    this.fileSelectionUpdated = this.fileSelectionUpdated.bind(this);
    this.tagSelected = this.tagSelected.bind(this);
    this.submitButtonShouldBeDisabled = this.submitButtonShouldBeDisabled.bind(this);

    this.state = {
      uploading: false,
      recordName: '',
      files: [],
      tags: [],
      selectedTag: null
    };
  }

  async componentWillMount() {
    if(dropboxAccessToken.isSet()) {
      const tags = await this.dropboxUploadService.fetchTags();
      this.setState({'tags': tags});
    }
  }

  render() {
    if(!dropboxAccessToken.isSet()) {
      return (
        <div>
          <Redirect to={paths.login}/>
        </div>
      );
    }

    const tagSelections = this.state.tags.map(tag => {
      return  [
        <input id={tag} type="radio" name="tag" key={tag} value={tag} onChange={this.tagSelected} />,
        <label class="tag" for={tag}>{tag}</label>,
        <span class="tagg">sadsdsad</span>
      ];
    });

    return (
      <div className="DocumentUploadComponent">
        <form id="image-capture">
          <fieldset id="uploadForm" disabled={this.state.uploading}>
            <input id="userSuppliedName" type="text" onChange={this.recordNameUpdated} value={this.state.recordName} />
            <input id="fileSelection" type="file" accept="image/*;capture=camera" onChange={this.fileSelectionUpdated} />
            {tagSelections}
            <button id="submitBtn" disabled={this.submitButtonShouldBeDisabled()} onClick={this.uploadClicked}>submit</button>
          </fieldset>
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

  tagSelected(e) {
    this.setState({selectedTag: e.target.value});
  }

  async uploadClicked() {
    this.setState({'uploading': true});
    const recordName = this.recordNameGenerator.generate(this.state.recordName);

    let uploaded = false;
    try {
      await this.dropboxUploadService.uploadFile(this.state.files[0], recordName, this.state.selectedTag);
      uploaded = true;
    } catch (err) {
    }
    this.setState({'uploading': false});
    console.log(`${uploaded ? "Uploaded" : "Failed to upload"} record '${this.state.recordName}'`)
  }
}

export default DocumentUploadComponent;
