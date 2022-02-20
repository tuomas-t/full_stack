const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper.test')
const User = require('../models/user')
const bcrypt = require('bcrypt')

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('testi_salis', 10)
  const user = new User({
    username: 'root',
    name: "haloo",
    passwordHash
  })
  await user.save()
})

test('cannot create username if password or username is invalid', async () => {
  const usersBefore = await helper.getUsers()

  const badUsername = {
    username: 'tt',
    name: 'testi',
    password: '123456',
  }

  const badPassword = {
    username: 'testi',
    name: 'testi',
    password: '12',
  }

  let result = await api.post('/api/users').send(badUsername)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  expect(result.body.error).toContain('username is too short (min length is 3 characters)')

  const usersAfter = await helper.getUsers()
  expect(usersAfter).toHaveLength(usersBefore.length)

  result = await api.post('/api/users').send(badPassword)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  expect(result.body.error).toContain('password is too short (min length is 3 characters)')
})


afterAll(() => {
  mongoose.connection.close()
})