/* eslint-disable no-prototype-builtins */
import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import CreateBlogForm from './components/CreateBlogForm'
import Togglable from './components/Togglable'
import PropTypes from 'prop-types'
import Notification from './components/Notification'
import { addNotification } from './reducers/notificationReducer'
import { setBlogs, addBlog, like, removeBlog } from './reducers/blogReducer'
import { setUser } from './reducers/userReducer'
import { Table, Form, Button } from 'react-bootstrap'

import { Route, Switch, useRouteMatch, Link } from 'react-router-dom'

const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setBlogs())
  }, [])

  const blogs = useSelector((state) => state.blogs)
  const user = useSelector((state) => state.user)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const blogRef = useRef()

  const userBlogs = blogs.reduce(function (blogs, blog) {
    if (!blogs.hasOwnProperty(blog.user.id)) {
      blogs[blog.user.id] = [blog.user.username, 0]
    } else {
      blogs[blog.user.id][1]++
    }
    return blogs
  }, {})

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
      dispatch(setUser(user))
      setUsername('')
      setPassword('')
    } catch (e) {
      dispatch(addNotification('wrong credentials', true, 3))
    }
  }

  const createBlog = async (blogObj) => {
    try {
      dispatch(addBlog(blogObj))
      dispatch(
        addNotification(
          `A new blog '${blogObj.title}' by ${blogObj.author} was created`,
          false,
          3
        )
      )
    } catch (e) {
      dispatch(addNotification('Could not create a new blog', true, 3))
    }
  }

  const logout = () => {
    setUsername('')
    setPassword('')
    dispatch(setUser(null))
    blogService.setToken(null)
  }

  const likeBlog = async (id) => {
    const blog = blogs.find((b) => b.id === id)
    dispatch(like(blog))
    dispatch(addNotification('Liked!', false, 3))
  }

  const deleteBlog = (id) => {
    const blog = blogs.find((b) => b.id === id)
    if (blog.user.username === user.username) {
      if (window.confirm(`Remove blog '${blog.title}' by ${blog.author}?`)) {
        dispatch(removeBlog(blog))
        dispatch(addNotification('Deleted', false, 3))
      }
    } else {
      dispatch(
        addNotification('Cannot delete a blog that is not yours', true, 3)
      )
    }
  }

  const userMatch = useRouteMatch('/users/:id')
  const matchedUser = userMatch
    ? { user: userBlogs[userMatch.params.id], id: userMatch.params.id }
    : null

  const blogMatch = useRouteMatch('/blogs/:id')
  const matchedBlog = blogMatch
    ? blogs.find((b) => b.id === blogMatch.params.id)
    : null

  if (user === null) {
    return (
      <div className="container">
        <h2>Login to application</h2>
        <Notification />
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
      </div>
    )
  } else {
    return (
      <div className="container">
        <h2>Blogs</h2>
        <Notification />
        <Menu user={user} logout={logout} />

        <Switch>
          <Route path="/users/:id">{UserView(matchedUser, blogs)}</Route>
          <Route path="/users">{Users(userBlogs)}</Route>
          <Route path="/blogs/:id">
            {BlogView(matchedBlog, likeBlog, deleteBlog)}
          </Route>
          <Route path="/">{BlogList(blogs, createBlog, blogRef)}</Route>
        </Switch>
      </div>
    )
  }
}

const BlogList = (blogs, createBlog, blogRef) => {
  return (
    <div>
      <Togglable buttonLabel="create new blog" ref={blogRef}>
        <CreateBlogForm createBlog={createBlog} />
      </Togglable>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
    </div>
  )
}

const Users = (blogs) => {
  return (
    <div>
      <h2>Users</h2>
      <Table striped>
        <tbody>
          <tr>
            <th>blogs created</th>
          </tr>
          {Object.keys(blogs).map((user) => (
            <tr key={user}>
              <td>
                <Link to={`users/${user}`}>{blogs[user][0]}</Link>
              </td>
              <td>{blogs[user][1] + 1}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

const UserView = (user, blogs) => {
  if (!user || !user.user) {
    return null
  } else {
    return (
      <div>
        <h2>{user.user[0]}</h2>
        <h3>added blogs</h3>
        <ul>
          {blogs
            .filter((blog) => blog.user.id === user.id)
            .map((blog) => (
              <li key={blog.id}>{blog.title}</li>
            ))}
        </ul>
      </div>
    )
  }
}

const BlogView = (blog, likeBlog, deleteBlog) => {
  if (!blog) {
    return null
  } else {
    return (
      <div>
        <h2>
          {blog.title} {blog.author}
        </h2>
        <a href={blog.url}> {blog.url} </a>
        <p>
          {blog.likes} likes{' '}
          <button onClick={() => likeBlog(blog.id)}> like </button>
          <button onClick={() => deleteBlog(blog.id)}> Delete </button>
        </p>
        <p>Added by {blog.user.username} </p>
      </div>
    )
  }
}

const Menu = (user, logout) => {
  const padding = {
    paddingRight: 5,
    display: 'table-cell',
  }
  return (
    <div style={{ display: 'table' }}>
      <Link style={padding} to="/">
        blogs
      </Link>
      <Link style={padding} to="/users">
        users
      </Link>
      <div style={padding}>
        {user.username} logged in{' '}
        <button onClick={() => logout()}>logout</button>
      </div>
    </div>
  )
}

const LoginForm = ({
  handleLogin,
  username,
  setUsername,
  password,
  setPassword,
}) => {
  return (
    <div>
      <Form onSubmit={handleLogin}>
        <Form.Group>
          <Form.Label>username:</Form.Label>
          <Form.Control
            id="username"
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
          <Form.Label>password:</Form.Label>
          <Form.Control
            id="password"
            type="password"
            value={password}
            name="Password"
            autoComplete="on"
            onChange={({ target }) => setPassword(target.value)}
          />
          <Button variant="primary" type="submit" id="login">
            login
          </Button>
        </Form.Group>
      </Form>
    </div>
  )
}

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  setPassword: PropTypes.func.isRequired,
  setUsername: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
}

export default App
