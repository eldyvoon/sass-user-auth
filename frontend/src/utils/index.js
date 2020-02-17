const getUser = () =>
  localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))

const getToken = () => {
  let parsedUser
  const user = localStorage.getItem('user')
  if (user) {
    parsedUser = JSON.parse(user)

    return parsedUser.user.token
  }
}

const setUser = data => localStorage.setItem('user', JSON.stringify(data))

const removeUser = () => localStorage.removeItem('user')

export { getUser, setUser, removeUser, getToken }
