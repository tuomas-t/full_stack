import axios from 'axios'
const baseUrl = 'api/blogs'

const getAll = async (blog_id) => {
  const response = await axios.get(`${baseUrl}/${blog_id}/comments`)
  return response.data
}

const create = async (blog_id, comment) => {
  const res = await axios.post(`${baseUrl}/${blog_id}/comments`, comment)
  return res.data
}

export default {
  getAll: getAll,
  create: create
}
