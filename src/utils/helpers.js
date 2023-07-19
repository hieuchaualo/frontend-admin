import { API_BASE_URI } from "./constants"

const timestampToDate = (timestamp) => new Date(timestamp)
    .toLocaleString('en-GB', { hour12: false, })
    .replace(',', ' -')

const toImgUrl = (path) => `${API_BASE_URI}/${path}`

/**
 * @param {String} timerId identify name of debounces
 * @param {Function} func function will call after delay time
 * @param {Number} delay delay time in ms, default `300ms`
 * @returns function after delay
 */
const timerIdsMap = {};
const debounce = (timerId, func, delay = 300) => {
  return (...args) => {
    clearTimeout(timerIdsMap[timerId]);
    timerIdsMap[timerId] = setTimeout(() => func(...args), delay);
  };
};


export {
    timestampToDate,
    toImgUrl,
    debounce,
}