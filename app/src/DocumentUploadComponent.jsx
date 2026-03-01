import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './DocumentUploadComponent.css';
import Toast from './Toast';
import { useDropboxService } from './AuthContext';
import RecordNameGenerator from './RecordNameGenerator';
import ImageScaler from './ImageScaler';

const DocumentUploadComponent = () => {
  const dropboxUploadService = useDropboxService();
  const recordNameGenerator = useMemo(() => new RecordNameGenerator(), []);
  const imageScaler = useMemo(() => new ImageScaler(), []);

  const [uploading, setUploading] = useState(false);
  const [recordName, setRecordName] = useState('');
  const [files, setFiles] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    dropboxUploadService.fetchTags().then(setTags).catch(() => {});
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

    try {
      const originalFile = files[0];
      const scaledFile = await imageScaler.scaleFile(originalFile);

      setProcessing(false);
      setUploading(true);
      await Promise.all([
        dropboxUploadService.uploadFile(scaledFile, scaledImageFilename, selectedTag),
        dropboxUploadService.uploadFile(originalFile, fullResImageFilename, selectedTag)
      ]);
      setToasts(prev => [...prev, { id: Date.now(), message: `'${recordName}' uploaded successfully`, type: 'success' }]);
    } catch (err) {
      setToasts(prev => [...prev, { id: Date.now(), message: `Failed to upload '${recordName}'`, type: 'error' }]);
    }
    setUploading(false);
    setProcessing(false);
  }, [recordName, files, selectedTag, recordNameGenerator, imageScaler, dropboxUploadService]);

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
      <div className="toast-container">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Toast
                message={t.message}
                type={t.type}
                onClose={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DocumentUploadComponent;
