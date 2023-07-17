/**
 * @param {Number} number
 * @returns string in currency format `12,345,678`
 */
function toCurrencyFormat(number) {
  const addedComma = (number).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').toString();
  // if you need to remove dot affter comma
  return addedComma.substring(0, addedComma.length - 3);
}

/**
 * @param {String} currency string in currency format `12,345,678`
 * @returns number format `12345678`
 */
function toNumberFormat(currency) {
  if (currency) return Number(currency.replace(/,/g, ''));
  return currency;
}

export {
  toNumberFormat,
  toCurrencyFormat,
};
