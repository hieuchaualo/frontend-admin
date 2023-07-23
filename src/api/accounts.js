import { axiosInstance, axiosUploadFileInstance } from "./axiosInstance"

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
  return axiosUploadFileInstance.patch(`/accounts/avatar`, formBody)
}


function updateAccount(formBody) {
  return axiosInstance.patch('/accounts', formBody)
}

export {
  createAccount,
  getAccount,
  loginAccount,
  updateAccountAvatar,
  updateAccount,
};
