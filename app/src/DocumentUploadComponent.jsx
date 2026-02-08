import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import './DocumentUploadComponent.css';
import DropboxUploadService from './DropboxUploadService';
import RecordNameGenerator from './RecordNameGenerator';
import dropboxAccessToken from './dropboxAccessToken';
import paths from './paths';
import ImageScaler from './ImageScaler';

const DocumentUploadComponent = () => {
  const dropboxUploadService = useMemo(() => new DropboxUploadService(), []);
  const recordNameGenerator = useMemo(() => new RecordNameGenerator(), []);
  const imageScaler = useMemo(() => new ImageScaler(), []);

  const [uploading, setUploading] = useState(false);
  const [recordName, setRecordName] = useState('');
  const [files, setFiles] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [requireLogin, setRequireLogin] = useState(!dropboxAccessToken.isSet());
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchTags = async () => {
      if (dropboxAccessToken.isSet()) {
        try {
          const fetchedTags = await dropboxUploadService.fetchTags();
          setTags(fetchedTags);
        } catch (e) {
          setRequireLogin(true);
        }
      }
    };
    fetchTags();
  }, [dropboxUploadService]);

  const submitButtonShouldBeDisabled = useCallback(() => {
    return !(recordName && files.length) || processing;
  }, [recordName, files.length, processing]);

  const fileSelectionUpdated = useCallback((e) => {
    setFiles(e.target.files);
  }, []);

  const recordNameUpdated = useCallback((e) => {
    setRecordName(e.target.value);
  }, []);

  const tagSelected = useCallback((e) => {
    setSelectedTag(e.target.value);
  }, []);

  const uploadClicked = useCallback(async () => {
    setProcessing(true);
    const { scaledImageFilename, fullResImageFilename } = recordNameGenerator.generate(recordName);

    let uploaded = false;
    try {
      const originalFile = files[0];
      const scaledFile = await imageScaler.scaleFile(originalFile);

      setProcessing(false);
      setUploading(true);
      await Promise.all([
        dropboxUploadService.uploadFile(scaledFile, scaledImageFilename, selectedTag),
        dropboxUploadService.uploadFile(originalFile, fullResImageFilename, selectedTag)
      ]);
      uploaded = true;
    } catch (err) {
    }
    setUploading(false);
    setProcessing(false);
    console.log(`${uploaded ? "Uploaded" : "Failed to upload"} record '${recordName}'`)
  }, [recordName, files, selectedTag, recordNameGenerator, imageScaler, dropboxUploadService]);

  if (requireLogin) {
    return (
      <div>
        <Navigate to={paths.login} replace />
      </div>
    );
  }

  const tagSelections = tags.map(tag => {
    const tagId = `${tag}-tag-selection`;
    const labelId = `${tag}-tag-selection-label`;
    return [
      <input id={tagId} type="radio" name="tag" key={tagId} value={tag} onChange={tagSelected} />,
      <label htmlFor={tagId} key={labelId}>{tag}</label>
    ]
  });

  const onSubmit = async event => {
    event.preventDefault();
    await uploadClicked();
  };

  return (
    <div className="DocumentUploadComponent">
      <form id="image-capture" onSubmit={onSubmit}>
        <fieldset disabled={uploading || processing}>
          <label htmlFor="userSuppliedName-input">Name</label>
          <input id="userSuppliedName-input" type="text" onChange={recordNameUpdated} value={recordName} />
          <label htmlFor="fileSelection-input">File</label>
          <input id="fileSelection-input" type="file" accept="image/*;capture=camera" onChange={fileSelectionUpdated} />
          <fieldset>
            <legend>Tag</legend>
            {tagSelections}
          </fieldset>
          <button id="submitBtn" disabled={submitButtonShouldBeDisabled()}>
            {processing ? 'Processing...' : uploading ? 'Uploading...' : 'submit'}
          </button>
        </fieldset>
      </form>
    </div>
  );
};

export default DocumentUploadComponent;
