import { axiosInstance, axiosUploadFileInstance } from "./axiosInstance";


function createReadingTest(formData) {
  return axiosUploadFileInstance.post('/reading-tests/create', formData)
}

function getReadingTestById(readingTestId) {
  return axiosInstance.get(`/reading-tests/${readingTestId}`)
}

function deleteReadingTestById(readingTestId) {
  return axiosInstance.delete(`/reading-tests/${readingTestId}`)
}

function searchReadingTest(keywords = '', limit = 12, page = 1) {
  return axiosInstance.get('/reading-tests', {
    params: {
      keywords,
      limit,
      page,
    },
  })
}

function updateReadingTest(readingTestId, formData) {
  return axiosInstance.patch(`/reading-tests/${readingTestId}`, formData)
}

export {
  searchReadingTest,
  getReadingTestById,
  updateReadingTest,
  createReadingTest,
}
