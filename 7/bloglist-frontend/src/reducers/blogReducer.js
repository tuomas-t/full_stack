/* eslint-disable indent */
import blogService from '../services/blogs'

const blogReducer = (state = [], action) => {
  switch (action.type) {
    case 'CREATE_BLOG':
      return [...state, action.data]
    case 'LIKE':
      return state.map((b) => (b.id !== action.data.id ? b : action.data))
    case 'SET_BLOGS':
      return action.data
    case 'REMOVE_BLOG':
      return state.filter((b) => b.id !== action.data.id)
    default:
      return state
  }
}

export const addBlog = (blog) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(blog)
    dispatch({
      type: 'CREATE_BLOG',
      data: newBlog,
    })
  }
}

export const like = (blog) => {
  return async (dispatch) => {
    const updatedBlog = await blogService.update(
      blog.id,
      { ...blog, likes: blog.likes + 1 }
    )
    dispatch({
      type: 'LIKE',
      data: updatedBlog,
    })
  }
}

export const removeBlog = (blog) => {
  return async (dispatch) => {
    await blogService.deleteBlog(blog.id)
    dispatch({
      type: 'REMOVE_BLOG',
      data: blog,
    })
  }
}

export const setBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'SET_BLOGS',
      data: blogs,
    })
  }
}

export default blogReducer
