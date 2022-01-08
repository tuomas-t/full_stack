const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper.test')
const Blog = require('../models/blog')


beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})


test('blogs are returned as json', async () => {
  await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const allBlogs = await api.get('/api/blogs')
  expect(allBlogs).toHaveLength(helper.initialBlogs.length)
})

test('ids are actually called id', async () => {
  const allBlogs = await api.get('/api/blogs')
  expect(allBlogs[0].id).toBeDefined()
})

test('a blog can be added', async () => {
  const newObj = {
    title: 'Teeest',
    author: 'testeri',
    url: 'fdwewf',
    likes: 100,
  }

  await api.post('/api/blogs').send(newObj)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const allBlogs = await helper.getBlogs()
  const titles = allBlogs.map(r => r.title)

  expect(allBlogs).toHaveLength(helper.initialBlogs.length + 1)
  expect(titles).toContain('Teeest')
})

test('if likes are not provided, likes = 0', async () => {
  const newObj = {
    title: 'Teeest',
    author: 'testeri',
    url: 'fdwewf'
  }

  await api.post('/api/blogs').send(newObj)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const allBlogs = await helper.getBlogs()
  const likes = allBlogs.map(r => r.likes)
  expect(likes.at(-1)).toBe(0)
})

test('if title or url missing, responds with 400 Bad Request', async () => {
  const noTitle = {
    author: 'testeri',
    url: 'fdwewf'
  }

  const noUrl = {
    title: 'title',
    author: 'testeri'
  }

  await api.post('/api/blogs').send(noTitle).expect(400)
  await api.post('/api/blogs').send(noUrl).expect(400)
})

test('a blog can be deleted', async () => {
  const allBlogs = await helper.getBlogs()
  const deleteThis = allBlogs[0]

  await api.delete(`/api/blogs/${deleteThis.id}`)
    .expect(204)

  const blogsNow = await helper.getBlogs()

  expect(blogsNow).toHaveLength(helper.initialBlogs.length - 1)
})

afterAll(() => {
  mongoose.connection.close()
})