/* eslint-disable no-unused-vars */
import React, { useState  } from 'react'

const Blog = ({ blog, likeBlog, deleteBlog, user }) => {
  const [viewDetails, setViewDetails] = useState(true)

  const blogStyle = {
    paddingTop: 2,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 2
  }

  const handleDetails = () => {
    setViewDetails(!viewDetails)
  }

  if (viewDetails) {
    return (
      <div style={blogStyle}>
        <div>
          {blog.title} {blog.author} <button onClick={handleDetails}>view</button>
        </div>
      </div>
    )
  } else {
    return (
      <div style={blogStyle}>
        <div>
          <p>{blog.title} {blog.author} <button onClick={handleDetails}>hide</button></p>
          <p>{blog.url}</p>
          <p>likes {blog.likes} <button id='like' onClick={likeBlog}>like</button></p>
          <p>{blog.user.name}</p>
          {blog.user.username === user.username ?
            <button id='delete' onClick={deleteBlog}>remove</button> : null}
        </div>
      </div>
    )
  }
}

export default Blog