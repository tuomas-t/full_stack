const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const password = request.body.password
  if (password.length < 3) {
    response.status(400).send({ 'error': 'password is too short (min length is 3 characters)' })
  }
  const user = new User({
    username: request.body.username,
    name: request.body.name,
    passwordHash: await bcrypt.hash(password, 10)
  })

  try {
    const saved = await user.save()
    response.status(201).json(saved.toJSON())
  } catch {
    response.status(400).send({ 'error': 'username is too short (min length is 3 characters)' })
  }
})

usersRouter.get('/', async (request, response) => {
  const allUsers = await User.find({}).populate('blogs', { url:1, title: 1, author:1, id:1 })
  response.json(allUsers.map(user => user.toJSON()))
})

module.exports = usersRouter