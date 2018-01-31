import Dropbox from 'dropbox';

class DropboxUploadService {
  uploadFile(file, name) {
    let dbx = new Dropbox({ accessToken: localStorage.getItem('dropbox-token') });
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
