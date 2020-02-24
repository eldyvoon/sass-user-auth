const router = require('express').Router()
const passport = require('passport')

router.get(
  '/google',
  passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  })
)

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_HOST}/login`,
    session: false
  }),
  function(req, res) {
    res.cookie(
      'user',
      JSON.stringify({
        user: {
          provider: 'google',
          ...req.user.toAuthJSON()
        }
      })
    )
    res.redirect(`${process.env.CLIENT_HOST}/dashboard`)
  }
)

module.exports = router
