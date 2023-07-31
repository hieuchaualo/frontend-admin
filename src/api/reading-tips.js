import { axiosInstance, axiosUploadFileInstance } from "./axiosInstance";


function createReadingTip(formData) {
  return axiosUploadFileInstance.post('/reading-tips', formData)
}

function updateReadingTip(readingTipId, formData) {
  return axiosUploadFileInstance.patch(`/reading-tips/${readingTipId}`, formData)
}

function updateReadingTipNoThumbnail(readingTipId, formData) {
  return axiosInstance.patch(`/reading-tips/no-thumbnail/${readingTipId}`, formData)
}

function searchReadingTip(keywords, page, limit) {
  return axiosInstance.get(`/reading-tips`, {
    params: {
      keywords, page, limit
    }
  })
}

function getReadingTipById(readingTipId) {
  return axiosInstance.get(`/reading-tips/${readingTipId}`)
}

function deleteReadingTipById(readingTipId) {
  return axiosInstance.delete(`/reading-tips/${readingTipId}`)
}


export {
  searchReadingTip,
  getReadingTipById,
  updateReadingTip,
  updateReadingTipNoThumbnail,
  createReadingTip,
  deleteReadingTipById,
}
