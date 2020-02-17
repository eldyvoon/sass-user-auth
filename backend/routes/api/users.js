const mongoose = require('mongoose')
const passport = require('passport')
const router = require('express').Router()
const auth = require('../auth')
const Users = mongoose.model('Users')
const faker = require('faker')
const sendEmail = require('../../utils/sendEmail')

router.post('/signup', async (req, res, next) => {
  const { name, email, password } = req.body

  if (!name) {
    return res.status(400).json({
      error: 'name is required'
    })
  }

  if (!email) {
    return res.status(400).json({
      error: 'email is required'
    })
  }

  if (!password) {
    return res.status(400).json({
      error: 'password is required'
    })
  }

  const result = await Users.findOne({
    email
  })
  if (result && result._id) {
    return res.status(400).json({
      error: 'email already in use, please use another email!'
    })
  }

  const finalUser = new Users({
    name,
    email,
    password
  })

  finalUser.setPassword(password)

  return finalUser.save().then(() => res.json({ user: finalUser.toAuthJSON() }))
})

router.post('/login', (req, res, next) => {
  const { email, password } = req.body

  if (!email) {
    return res.status(400).json({
      error: 'email is required'
    })
  }

  if (!password) {
    return res.status(400).json({
      error: 'password is required'
    })
  }

  if (password.length < 6) {
    return res.status(400).json({
      error: 'password length must not be lesser than 6'
    })
  }

  return passport.authenticate(
    'local',
    { session: false },
    (err, passportUser, info) => {
      if (err) {
        return next(err)
      }

      if (passportUser) {
        const user = passportUser
        user.token = passportUser.generateJWT()

        return res.json({ user: user.toAuthJSON() })
      }

      return res.status(400).send(info)
    }
  )(req, res, next)
})

router.post('/forget-password', async (req, res, next) => {
  const { email } = req.body

  if (!email) {
    return res.status(400).json({
      error: 'email is required'
    })
  }

  //check user exist
  const user = await Users.findOne({
    email
  })

  if (!user) {
    return res.status(400).json({
      error: "user doesn't exist"
    })
  }

  const tempPassword = faker.random.alphaNumeric(6)

  const updatedUser = new Users({
    name: user.name,
    email
  })

  updatedUser.setPassword(tempPassword)
  const { hash, salt } = updatedUser

  try {
    await Users.findOneAndUpdate(
      {
        email
      },
      { $set: { hash, salt } }
    )

    await sendEmail({
      recipient: email,
      subject: 'Forget Password',
      html: `<div>
        <p>Hi ${user.name},</p>
        <p>You have requested password change, you can use this password to login:</p>
        <p><strong>${tempPassword}</strong></p>
      </div>`
    })

    res.json({
      result: 'ok'
    })
  } catch (err) {
    res.status(400).json({
      error: 'something is wrong, contact support'
    })
  }
})

router.post('/change-password', auth.required, async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    const newUser = new Users({
      name,
      email
    })

    newUser.setPassword(password)
    const { hash, salt } = newUser

    const updatedUser = await Users.findOneAndUpdate(
      {
        email
      },
      { $set: { hash, salt } }
    )

    return res.json({
      user: updatedUser.toAuthJSON()
    })
  } catch (e) {
    console.log('e', e)
    res.status(400).json({
      error: 'something is wrong, contact support'
    })
  }
})

module.exports = router
