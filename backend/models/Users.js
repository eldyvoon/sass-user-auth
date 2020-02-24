const mongoose = require('mongoose')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const { Schema } = mongoose

const UsersSchema = new Schema({
  name: String,
  email: String,
  provider: String,
  hash: String,
  salt: String,
  verified: {
    type: Boolean,
    default: false
  },
  verification_code: String
})

UsersSchema.statics.findOrCreate = function(profile, cb) {
  const userObj = new this()

  const verifiedEmail =
    profile.emails.find(email => email.verified).value || profile.emails[0]

  this.findOne({ email: verifiedEmail }, function(err, result) {
    if (!result) {
      userObj.name = profile.displayName
      userObj.email = verifiedEmail
      userObj.provider = 'google'
      userObj.verified = true

      userObj.save(cb)
    } else {
      cb(err, result)
    }
  })
}

UsersSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex')
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
    .toString('hex')
}

UsersSchema.methods.validatePassword = function(password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
    .toString('hex')
  return this.hash === hash
}

UsersSchema.methods.generateJWT = function() {
  const today = new Date()
  const expirationDate = new Date(today)
  expirationDate.setDate(today.getDate() + 60)

  return jwt.sign(
    {
      id: this._id,
      name: this.name,
      email: this.email,
      exp: parseInt(expirationDate.getTime() / 1000, 10)
    },
    process.env.JWT_SECRET
  )
}

UsersSchema.methods.toAuthJSON = function() {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    token: this.generateJWT()
  }
}

mongoose.model('Users', UsersSchema)
