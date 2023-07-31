import { axiosInstance, axiosUploadFileInstance } from "./axiosInstance";


function createMiniTest(formData) {
  return axiosUploadFileInstance.post('/mini-tests', formData)
}

function updateMiniTest(miniTestId, formData) {
  return axiosUploadFileInstance.patch(`/mini-tests/${miniTestId}`, formData)
}

function updateMiniTestNoThumbnail(miniTestId, formData) {
  return axiosInstance.patch(`/mini-tests/no-thumbnail/${miniTestId}`, formData)
}

function searchMiniTest(keywords, page, limit){
  return axiosInstance.get(`/mini-tests`, {
    params: {
      keywords, page, limit
    }
  })
}

function getMiniTestById(miniTestId) {
  return axiosInstance.get(`/mini-tests/${miniTestId}`)
}

function deleteMiniTestById(miniTestId) {
  return axiosInstance.delete(`/mini-tests/${miniTestId}`)
}


export {
  searchMiniTest,
  getMiniTestById,
  updateMiniTest,
  updateMiniTestNoThumbnail,
  createMiniTest,
  deleteMiniTestById,
}
