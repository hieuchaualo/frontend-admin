/**
 * @param {Number} value value input in number
 * @param {Number} min is value < min
 * @param {Number} max is value > max
 * @returns {boolean} if the value is valid in range
 */
function isValidMinMax(value, min = 0, max = Number.MAX_SAFE_INTEGER) {
  return !(value < min || value > max);
}

const regexNumber = /^\d*\.?\d*$/;
/**
 * @param {String} value value input in string
 * @returns value in `Number` || `false`
 */
function isNumber(value) {
  return regexNumber.test(value);
}

/**
 * @param {String} fileType
 * @returns {Boolean} file type is jpeg/jpg/png
 */
function isImageType(fileType) {
  return (fileType === 'image/jpeg' || fileType === 'image/jpg' || fileType === 'image/png');
}

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&.])[A-Za-z\d@$!%*#?&.]{8,}$/;
/**
 * @param {String} password
 * @returns {Boolean} Boolean it should contain at least one digit,
 * least one lower case, least one upper case,
 * least 8 from the mentioned characters
 */
function isValidPassword(password) {
  return PASSWORD_REGEX.test(password);
}

const EMAIL_REGEX = /\S+@\S+\.\S+/;
/**
 * @param {String} email
 * @returns {Boolean} Boolean
*/
function isValidEmail(email) {
  return EMAIL_REGEX.test(email);
}

export {
  isNumber,
  isValidMinMax,
  isImageType,
  isValidPassword,
  isValidEmail,
};
