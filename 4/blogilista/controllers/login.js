const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const user = await User.findOne({ username: request.body.username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(request.body.password, user.passwordHash)

  if (!user || !passwordCorrect) {
    return response.status(401).json({ error: 'invalid username or password' })
  }

  const uToken = {
    username: user.username,
    id: user._id,
  }
  const token = jwt.sign(uToken, process.env.SECRET)
  response.status(200).send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter