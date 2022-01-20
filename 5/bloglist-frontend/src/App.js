import React, { useState, useEffect, useRef  } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import CreateBlogForm from './components/CreateBlogForm'
import Togglable from './components/Togglable'
import PropTypes from 'prop-types'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState([])
  const blogRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    if (window.localStorage.getItem('user')) {
      const user = JSON.parse(window.localStorage.getItem('user'))
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      blogService.setToken(user.token)
      window.localStorage.setItem('user', JSON.stringify(user))
      setUser(user)
      setMessage([`logged in as ${username}`, false])
      setTimeout(() => {setMessage([])}, 3000)
    } catch (e) {
      setMessage(['wrong credentials', true])
      setTimeout(() => {setMessage([])}, 3000)
    }
  }

  const createBlog = async (blogObj) => {
    try {
      const blog = await blogService.create(blogObj)
      setBlogs(blogs.concat(blog))
      setMessage([`A new blog '${blogObj.title}' by ${blogObj.author} was created`, false])
      setTimeout(() => {setMessage([])}, 3000)
    } catch (e) {
      setMessage(['Could not create a new blog', true])
      setTimeout(() => {setMessage([])}, 3000)
    }
  }

  const logout = () => {
    setUsername('')
    setPassword('')
    window.localStorage.removeItem('user')
  }

  const likeBlog = async (id) => {
    const blog = blogs.find(b => b.id === id)
    const likedBlog = { ...blog, likes: blog.likes + 1 }
    try {
      const updatedBlog = await blogService.update(id, likedBlog)
      setBlogs(blogs.map(b => b.id !== id ? b : updatedBlog))
      setMessage(['Liked!', false])
      setTimeout(() => {setMessage([])}, 3000)
    } catch (e) {
      setMessage(['Could not like blog', true])
      setTimeout(() => {setMessage([])}, 3000)
    }
  }

  const deleteBlog = (id) => {
    const blog = blogs.find(b => b.id === id)
    if (blog.user.username === user.username) {
      if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
        blogService.deleteBlog(id)
        setBlogs(blogs.filter(b => b.id !== id))
        setMessage(['Deleted', false])
        setTimeout(() => {setMessage([])}, 3000)
      }
    } else {
      setMessage(['Cannot delete a blog that is not yours', true])
      setTimeout(() => {setMessage([])}, 3000)
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Login to application</h2>
        <Notification message={message} />
        <LoginForm handleLogin={handleLogin} username={username} setUsername={setUsername} password={password} setPassword={setPassword} />
      </div>
    )
  } else {
    return (
      <div>
        <h2>Blogs</h2>
        <Notification message={message} />
        <p>{username} logged in <button onClick={() => logout()} >logout</button></p>
        <BlogList blogs={blogs} likeBlog={likeBlog} deleteBlog={deleteBlog} user={user} createBlog={createBlog} blogRef={blogRef} />
      </div>
    )
  }
}

const BlogList = ({ blogs, likeBlog, deleteBlog, user, createBlog, blogRef }) => {
  return (
    <div>
      <Togglable buttonLabel="create new blog" ref={blogRef}>
        <CreateBlogForm createBlog={createBlog} />
      </Togglable>
      {
        blogs.sort((a, b) => b.likes - a.likes).map(blog =>
          <Blog key={blog.id} blog={blog} likeBlog={() => likeBlog(blog.id)} deleteBlog={() => deleteBlog(blog.id)} user={user} />)
      }
    </div>
  )
}

const LoginForm = ({ handleLogin, username, setUsername, password, setPassword }) => {
  return (<div>
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          id='username'
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          id='password'
          type="password"
          value={password}
          name="Password"
          autoComplete="on"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit" id='login'>login</button>
    </form>
  </div>
  )
}

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  setPassword: PropTypes.func.isRequired,
  setUsername: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}

const Notification = ({ message }) => {
  if (message.length === 0) {
    return null
  }
  if (message[1]) {
    return (
      <div className="error">
        {message[0]}
      </div>
    )
  } else {
    return (
      <div className="success">
        {message[0]}
      </div>
    )
  }
}

export default App