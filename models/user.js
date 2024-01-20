const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  username : {
    type : String,
    required : true,
    unique: true,
    minLength : [3, 'at least 3 characters long']
  },
  name : {
    type : String,
  },
  passwordHash :{
    type : String,
    required : true
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

userSchema.plugin(uniqueValidator)
module.exports = mongoose.model('User', userSchema)