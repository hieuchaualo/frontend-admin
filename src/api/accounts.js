import { axiosInstance, axiosUploadFileInstance } from "./axiosInstance"

function getAccount() {
  return axiosInstance.get('/accounts')
}

function loginAccount(formBody) {
  return axiosInstance.post('/accounts/login', formBody)
}

function updateAccountAvatar(formBody) {
  return axiosUploadFileInstance.patch(`/accounts/avatar`, formBody)
}

function getAccountsList(keywords, limit, page) {
  return axiosInstance.get('/accounts/managements', {
    params: {
      keywords, limit, page
    }
  })
}

function createAccount(formBody) {
  return axiosInstance.post('/accounts/managements/register', formBody)
}

function updateAccount(id, formBody) {
  return axiosInstance.patch('/accounts/managements/' + id, formBody)
}

function deleteAnAccount(accountId) {
  return axiosInstance.delete('/accounts/managements/' + accountId)
}
export {
  createAccount,
  getAccount,
  loginAccount,
  updateAccountAvatar,
  updateAccount,
  getAccountsList,
  deleteAnAccount,
};
