const mongoose = require('mongoose')
const passport = require('passport')
const router = require('express').Router()
const auth = require('../auth')
const Users = mongoose.model('Users')
const faker = require('faker')
const sendEmail = require('../../utils/sendEmail')
const chance = require('chance')

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

  const newChance = new chance()
  const hashCode = newChance.hash()

  const finalUser = new Users({
    name,
    email,
    password,
    verification_code: hashCode
  })

  finalUser.setPassword(password)

  await sendEmail({
    recipient: email,
    subject: 'Confirmation link',
    html: `<div>
      <p>Hi ${name},</p>
      <p>Click this <a target="_blank" href=${process.env.HOST}/api/users/verify-account?email=${email}&code=${hashCode}>link</a> to verify your registration.</p>
    </div>`
  })

  return finalUser.save().then(() => res.json({ result: 'ok' }))
})

router.get('/verify-account?:email?:code', async (req, res) => {
  const { email, code } = req.query

  const result = await Users.findOne({
    email,
    verification_code: code
  })

  if (!result) {
    return res.status(400).json({
      error: 'Invalid verification link'
    })
  }

  const verified = await Users.findOneAndUpdate(
    {
      email
    },
    {
      $set: { verification_code: '', verified: true }
    }
  )

  if (verified) res.redirect(`${process.env.CLIENT_HOST}/login?verified`)
})

router.post('/login', async (req, res, next) => {
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

  const verifiedUser = await Users.findOne({
    email,
    verified: true
  })

  if (!verifiedUser) {
    return res.status(400).json({
      error: 'Check your email inbox for confirmation link.'
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
      error: "Email doesn't exist"
    })
  }

  if (user.provider) {
    return res.status(400).json({
      error: 'You logged in using Google, try Login with Google.'
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
