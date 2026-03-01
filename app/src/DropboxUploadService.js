import { Dropbox } from 'dropbox';
import dropboxAccessToken from './dropboxAccessToken';

export class DropboxServiceError extends Error {
  constructor(message, cause) {
    super(message, { cause });
    this.name = 'DropboxServiceError';
  }
}

export default class DropboxUploadService {
  constructor(onAuthError) {
    this.dbx = new Dropbox({ accessToken: dropboxAccessToken.getAccessToken() });
    this.onAuthError = onAuthError;
  }

  async uploadFile(file, name, tag) {

    const filePath = `/${tag ? `${tag}/` : ''}${name}`;

    try {
      await this.dbx.filesUpload({path: filePath, contents: file, autorename: true});
    } catch (err) {
      if (err.status === 401 && this.onAuthError) this.onAuthError();
      throw new DropboxServiceError('Failed to upload file', err);
    }
  }

  async fetchTags() {
    try {
      let response = await this.dbx.filesListFolder({path: ''});
      return response.result.entries
        .filter(item => item['.tag'] === 'folder')
        .map(item => item.name);
    } catch (err) {
      if (err.status === 401 && this.onAuthError) this.onAuthError();
      throw new DropboxServiceError('Failed to fetch tags', err);
    }
  }
}
