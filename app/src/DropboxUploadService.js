import Dropbox from 'dropbox';
import dropboxAccessToken from './dropboxAccessToken';

class DropboxUploadService {
  uploadFile(file, name) {
    let dbx = new Dropbox({ accessToken: dropboxAccessToken.getAccessToken() });
    dbx.filesUpload({path: `/${name}`, contents: file, autorename: true})
    .then(function(response) {
      console.log(response);
    })
    .catch(function(error) {
      console.error(error);
    });
  }
}

export default DropboxUploadService;
