/**
 * @returns {Boolean} is has access token in local storage or not
 */
function isHasAccessToken() {
  const token = localStorage.getItem('jwt_token');
  return Boolean(token);
}

export {
  isHasAccessToken,
};
