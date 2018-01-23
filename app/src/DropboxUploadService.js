import Dropbox from 'dropbox';
import querystring from 'querystring';

class DropboxUploadService {
  uploadFile(file, name) {
    const accessToken = querystring.parse(window.location.hash.substr(1))['access_token'];

    let dbx = new Dropbox({ accessToken: accessToken });
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
