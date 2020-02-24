const mongoose = require('mongoose')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const Users = mongoose.model('Users')

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    (email, password, done) => {
      Users.findOne({ email })
        .then(user => {
          if (!user || !user.validatePassword(password)) {
            return done(null, false, {
              error: 'email or password is invalid'
            })
          }

          return done(null, user)
        })
        .catch(done)
    }
  )
)

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.HOST}/api/auth/google/callback`
    },
    function(accessToken, refreshToken, profile, done) {
      Users.findOrCreate(profile, function(err, user) {
        return done(err, user)
      })
    }
  )
)
