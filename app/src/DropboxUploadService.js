import Dropbox from 'dropbox';
import dropboxAccessToken from './dropboxAccessToken';

export default class DropboxUploadService {
  constructor() {
    this.dbx = new Dropbox({ accessToken: dropboxAccessToken.getAccessToken() });
  }

  async uploadFile(file, name, tag) {

    const filePath = `/${tag ? `${tag}/` : ''}${name}`;

    try {
      await this.dbx.filesUpload({path: filePath, contents: file, autorename: true});
    } catch (err) {
      throw new Error('Failed to upload record to dropbox');
    }
  }

  async fetchTags() {
    try {
      let response = await this.dbx.filesListFolder({path: ''});
      return response.entries
        .filter(item => item['.tag'] === 'folder')
        .map(item => item.name);
    } catch (err) {
      throw new Error('Failed to fetch tags');
    }
  }
}
