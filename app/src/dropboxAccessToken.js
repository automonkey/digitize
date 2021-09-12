export default {

  isSet() {
    return !!getAccessToken();
  },

  getAccessToken,

  setAccessToken(token) {
    localStorage.setItem('dropbox-token', token);
  },

  clearAccessToken() {
    localStorage.removeItem('dropbox-token');
  }
};

function getAccessToken() {
  return localStorage.getItem('dropbox-token');
}
