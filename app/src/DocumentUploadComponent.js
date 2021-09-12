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
      const tagId = `${tag}-tag-selection`;
      const labelId = `${tag}-tag-selection-label`;
      return [
        <input id={tagId} type="radio" name="tag" key={tagId} value={tag} onChange={this.tagSelected} />,
        <label htmlFor={tagId} key={labelId}>{tag}</label>
      ]
    });

    return (
      <div className="DocumentUploadComponent">
        <form id="image-capture">
          <fieldset disabled={this.state.uploading}>
            <label htmlFor="userSuppliedName-input">Name</label>
            <input id="userSuppliedName-input" type="text" onChange={this.recordNameUpdated} value={this.state.recordName} />
            <label htmlFor="fileSelection-input">File</label>
            <input id="fileSelection-input" type="file" accept="image/*;capture=camera" onChange={this.fileSelectionUpdated} />
            <fieldset>
              <legend>Tag</legend>
              {tagSelections}
            </fieldset>
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
