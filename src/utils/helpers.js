import { API_BASE_URI, MINI_TEST_TYPE } from "./constants"

const timestampToDate = (timestamp) => new Date(timestamp)
    .toLocaleString('en-GB', { hour12: false, })
    .replace(',', ' -')

const toImgUrl = path => path ? `${API_BASE_URI}/${path}` : ''

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

const getMiniTestType = quiz => {
  const firstAnswer = quiz.answers[0].toLowerCase()
  if (firstAnswer === 'true' || firstAnswer === 'false' || firstAnswer === 'no given' || firstAnswer === 'no-given') return MINI_TEST_TYPE.TRUE_FALSE
  if (quiz.options.length) return MINI_TEST_TYPE.MULTIPLE_OPTIONS
  return MINI_TEST_TYPE.FILL_THE_BLANK
}

export {
    timestampToDate,
    toImgUrl,
    debounce,
    getMiniTestType,
}