require('dotenv').config()

const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const cors = require('cors')
const mongoose = require('mongoose')
const passport = require('passport')

//Configure mongoose's promise to global promise
mongoose.promise = global.Promise

//Configure isProduction variable
const isProduction = process.env.NODE_ENV === 'production'

//Initiate our app
const app = express()

//Configure our app
app.use(cors())
app.use(require('morgan')('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use(
  session({
    secret: 'session-secret',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
  })
)

//Configure Mongoose
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true
})
mongoose.set('debug', true)

//Models & routes
require('./models/Users')

//passport config
app.use(passport.initialize())
app.use(passport.session())
require('./config/passport')

app.use(require('./routes'))

app.use((err, req, res, next) => {
  res.status(err.status || 500)

  res.json({
    error: err.message
  })
})

app.listen(3001, () => console.log('Server running on http://localhost:3001'))
