import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const setToken = (t) => {
  token = `bearer ${t}`
}

const create = async (blogObj) => {
  const conf = {
    headers: { Authorization: token },
  }
  const res = await axios.post(baseUrl, blogObj, conf)
  return res.data
}

const update = async (id, blogObj) => {
  const response = await axios.put(`${baseUrl}/${id}`, blogObj)
  return response.data
}

const deleteBlog = async (id) => {
  const config = {
    headers: { Authorization: token },
  }
  await axios.delete(`${baseUrl}/${id}`, config)
}

export default {
  getAll: getAll,
  create: create,
  update: update,
  setToken: setToken,
  deleteBlog: deleteBlog,
}
