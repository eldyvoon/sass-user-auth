const jwt = require('express-jwt')

const getTokenFromHeaders = req => {
  const {
    headers: { authorization }
  } = req

  if (authorization && authorization.split(' ')[0] === 'Bearer') {
    return authorization.split(' ')[1]
  }
  return null
}

const auth = {
  required: jwt({
    secret: '_secret_',
    userProperty: 'user',
    getToken: getTokenFromHeaders
  }),
  optional: jwt({
    secret: '_secret_',
    userProperty: 'user',
    getToken: getTokenFromHeaders,
    credentialsRequired: false
  })
}

module.exports = auth
