/**
 * @param {String} stringValue value in string
 * @do replace extra space to space
 * @do remove ` ~ ! @ # $ % ^ & * ( ) _ / \ : ; . ,  [ ] < > { } ?
 */
function removeSpecialCharacter(stringValue) {
  return stringValue
    .trimStart()
    .replace(/\s+/g, ' ')
    // eslint-disable-next-line no-useless-escape
    .replace(/[&\/\\;,()_$~%@^=|[\]`.'":*?!<>{}]/g, '');
}

export {
  removeSpecialCharacter,
};
