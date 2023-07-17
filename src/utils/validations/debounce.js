/**
 * @param {Function} func function will call after delay time
 * @param {Number} delay delay time in ms, default `300ms`
 * @returns function after delay
 */
let timerId;
const debounce = (func, delay = 400) => {
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => func(...args), delay);
  };
};

export {
  debounce,
};
