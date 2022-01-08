const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    minLength: 3,
    required: true,
    unique: true
  },
  name: String,
  passwordHash: {
    type: String,
    required: true
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ]
})

userSchema.plugin(uniqueValidator);

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.passwordHash
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('User', userSchema)