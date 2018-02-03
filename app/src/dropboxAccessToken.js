function getAccessToken() {
  return localStorage.getItem('dropbox-token');
}

export default {

  isSet() {
    return !!getAccessToken();
  },

  getAccessToken,

  setAccessToken(token) {
    localStorage.setItem('dropbox-token', token);
  }
};
