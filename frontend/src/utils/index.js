import Cookies from 'js-cookie'

const getUser = () => {
  const { user } = Cookies.getJSON('user') || {}
  return user
}

const getToken = () => {
  const { user } = Cookies.getJSON('user') || {}
  return user.token
}

const setUser = data => Cookies.set('user', JSON.stringify(data))

const removeUser = () => Cookies.remove('user')

const isGoogleLogin = () => {
  const { user } = Cookies.getJSON('user') || {}
  if (user.provider === 'google') return true
}

export { getUser, setUser, removeUser, getToken, isGoogleLogin }
