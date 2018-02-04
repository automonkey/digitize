import Dropbox from 'dropbox';
import dropboxAccessToken from './dropboxAccessToken';

class DropboxUploadService {
  async uploadFile(file, name) {
    let dbx = new Dropbox({ accessToken: dropboxAccessToken.getAccessToken() });

    try {
      await dbx.filesUpload({path: `/${name}`, contents: file, autorename: true});
    } catch (err) {
      throw new Error('Failed to upload record to dropbox');
    }
  }
}

export default DropboxUploadService;
