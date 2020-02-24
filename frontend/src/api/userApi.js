import axios from 'axios'
import { getToken } from '../utils'

const host = process.env.REACT_APP_API_HOST

const registerUser = async ({ name, email, password }) => {
  try {
    const { data } = await axios.post(`${host}/users/signup`, {
      name,
      email,
      password
    })

    return { data }
  } catch (error) {
    return error.response.data
  }
}

const loginUser = async ({ email, password }) => {
  try {
    const { data } = await axios.post(`${host}/users/login`, {
      email,
      password
    })

    return { data }
  } catch (error) {
    return error.response.data
  }
}

const forgetPassword = async ({ email }) => {
  try {
    const { data } = await axios.post(`${host}/users/forget-password`, {
      email
    })

    return { data }
  } catch (error) {
    return error.response.data
  }
}

const changePassword = async ({ name, email, password }) => {
  try {
    const { data } = await axios.post(
      `${host}/users/change-password`,
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
    return error.response.data
  }
}

export { registerUser, loginUser, forgetPassword, changePassword }
