import axios from 'axios'
import { getToken } from '../utils'

const host = 'http://localhost:3001'

const loginUser = async ({ email, password }) => {
  try {
    const { data } = await axios.post(`${host}/api/users/login`, {
      email,
      password
    })

    return { data }
  } catch (error) {
    return error.response.data
  }
}

const changePassword = async ({ name, email, password }) => {
  try {
    const { data } = await axios.post(
      `${host}/api/users/change-password`,
      {
        name,
        email,
        password
      },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      }
    )

    return { data }
  } catch (error) {
    console.log('error', error)
    return error.response.data
  }
}

export { loginUser, changePassword }
