/* eslint-disable import/no-anonymous-default-export */
import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAnecdotes = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async (content) => {
  const newAnecdote = { content, votes: 0 }
  const response = await axios.post(baseUrl, newAnecdote)
  return response.data
}

const update = async (object, id) => {
  const response = await axios.put(`${baseUrl}/${id}`, object)
  return response.data
}

export default { getAnecdotes, create, update }