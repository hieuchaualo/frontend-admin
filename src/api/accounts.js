import { axiosInstance } from "./axiosInstance"

function createAccount() {
  return axiosInstance.get('/accounts/create')
}

function getAccount() {
  return axiosInstance.get('/accounts')
}

function loginAccount(formBody) {
  return axiosInstance.post('/accounts/login', formBody)
}

function updateAccountAvatar(formBody) {
  return axiosInstance.post('/accounts/avatar', formBody)
}

function updateAccountName(formBody) {
  return axiosInstance.post('/accounts/avatar', formBody)
}

export {
  createAccount,
  getAccount,
  loginAccount,
  updateAccountAvatar,
  updateAccountName,
};