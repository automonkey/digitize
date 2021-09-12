import Dropbox from 'dropbox';
import DropboxUploadService from './DropboxUploadService';
import dropboxAccessToken from './dropboxAccessToken';

jest.mock('dropbox');

beforeAll(() => {
  dropboxAccessToken.setAccessToken("fake-access-token");
});

describe('uploadFile()', () => {

  let mockFn = jest.fn();
  let uploadService = null;
  beforeAll(() => {
    Dropbox.mockImplementation(() => {
      return {
        filesUpload: mockFn
      }
    });
    uploadService = new DropboxUploadService();
  });

  beforeEach(() => {
    mockFn.mockClear();
  });

  it('should upload file to root dir when no tag supplied', async () => {
    await uploadService.uploadFile(null, 'some-file-name.jpg');

    let fileInfo = mockFn.mock.calls[0][0];
    expect(fileInfo.path).toEqual('/some-file-name.jpg');
  });

  it('should upload file to tag directory when tag is supplied', async () => {
    await uploadService.uploadFile(null, 'some-file-name.jpg', 'some-tag');

    let fileInfo = mockFn.mock.calls[0][0];
    expect(fileInfo.path).toEqual('/some-tag/some-file-name.jpg');
  });
});

describe('fetchTags()', () => {
  it('should fetch and filter top level folders', async () => {

    Dropbox.mockImplementation(() => {
      return {
        filesListFolder: async function() {
          return aDropboxFilesList()
            .with(aDropboxFileRecord().withName('Bank').withType('folder').build())
            .with(aDropboxFileRecord().withName('someFile').withType('file').build())
            .with(aDropboxFileRecord().withName('anotherFolder').withType('folder').build())
            .with(aDropboxFileRecord().withName('anotherFile').withType('file').build())
            .build();
        }
      };
    });

    const uploadService = new DropboxUploadService();
    const tags = await uploadService.fetchTags();

    expect(tags).toEqual(expect.arrayContaining(['Bank', 'anotherFolder']));
  });
});

function aDropboxFilesList() {
  return new DropboxFilesListFolderResultBuilder();
}

class DropboxFilesListFolderResultBuilder {
  constructor() {
    this.entries = [];
  }

  with(entry) {
    this.entries.push(entry);
    return this;
  }

  build() {
    return {
      entries: this.entries,
      cursor: 'klhjkjlhKkjKjlhKljhHkljKJHkj8877897223-dsfkjsfhdkljhKJHflkjhklsdfhkjhfdskLJH' +
              'kfjdsfhkjsdfkjlfdhjkl0sf0893kndfs3298434298kjdsflkjfhdkflsdhf234521-dsfsfsdf',
      has_more: false
    }
  }
}

function aDropboxFileRecord() {
  return new DropboxFilesFileMetadataBuilder();
}

class DropboxFilesFileMetadataBuilder {
  constructor() {
    this.name = 'some-file-name';
    this.type = 'file';
  }

  withType(type) {
    this.type = type;
    return this;
  }

  withName(name) {
    this.name = name;
    return this;
  }

  build() {
    let entry = {
      '.tag': this.type,
      name: this.name,
      path_lower: `/${this.name.toLowerCase()}`,
      path_display: `/${this.name}`,
      id: 'id:s0p3db1aAAAAAAAVw'
    };

    if (this.type === 'file') {
      entry['client_modified'] = '2018-03-12T16:35:54Z';
      entry['server_modified'] = '2018-03-12T16:35:54Z';
      entry['rev'] = 'b46209d000';
      entry['size'] = 1994901;
      entry['content_hash'] = '31c6b31d5538aaa2f49071c6223cfe0fdac1693dd09c1714423d13f5d8a979dd';
    }

    return entry;
  }
}
