/* eslint-disable indent */
import commentService from '../services/comments'

const commentReducer = (state = [], action) => {
  switch (action.type) {
    case 'ADD_COMMENT':
      return [...state, action.data]
    case 'GET_COMMENTS':
        return action.data
    default:
      return state
  }
}

export const addComment = (blog_id, comment) => {
  return async (dispatch) => {
    const newComment = await commentService.create(blog_id, comment)
    dispatch({
      type: 'ADD_COMMENT',
      data: newComment,
    })
  }
}

export const getComments = () => {
    return async (dispatch) => {
      const comments = await commentService.getAll()
      dispatch({
        type: 'GET_COMMENTS',
        data: comments,
      })
    }
  }

export default commentReducer