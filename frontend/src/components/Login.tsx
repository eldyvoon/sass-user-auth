import React from 'react'
import { Form, Icon, Input, Button, message, Alert } from 'antd'
import { withRouter } from 'react-router-dom'

import './login.scss'
import { loginUser } from '../api/userApi'
import { setUser } from '../utils'

interface formProps {
  form: any
  history: any
}

class NormalLoginForm extends React.Component<formProps> {
  handleSubmit = (e: any) => {
    e.preventDefault()
    this.props.form.validateFields(async (err: any, values: any) => {
      if (!err && values.email && values.password) {
        const { data, error } = await loginUser({
          email: values.email,
          password: values.password
        })

        if (error) {
          message.error(error)
        }

        if (data) {
          setUser(data)
          this.props.history.push('/dashboard')
        }
      }
    })
  }

  render() {
    const verifiedParams = this.props.history.location.search
    const { getFieldDecorator } = this.props.form

    console.log('verifiedParams', verifiedParams)

    return (
      <div className="login-register-wrap">
        <a
          className="google-btn-wrap"
          href={`${process.env.REACT_APP_API_HOST}/auth/google`}
        >
          <div className="google-btn">
            <div className="google-icon-wrapper">
              <img
                alt="google-btn"
                className="google-icon"
                src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
              />
            </div>
            <p className="btn-text">
              <b>Login with Google</b>
            </p>
          </div>
        </a>

        <Form onSubmit={this.handleSubmit} className="login-form">
          <div className="or-seperator">
            <p>or</p>
          </div>
          {verifiedParams.includes('verified') && (
            <>
              <Alert
                style={{ marginBottom: -5 }}
                message="Verified. You may proceed to login."
                type="success"
              />
              <br />
            </>
          )}

          <Form.Item>
            {getFieldDecorator('email', {
              rules: [{ required: true, message: 'Email is required' }]
            })(
              <Input
                prefix={
                  <Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                placeholder="Email"
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Password is required.' }]
            })(
              <Input
                prefix={
                  <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                type="password"
                placeholder="Password"
              />
            )}
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Log in
            </Button>
            <a className="login-form-forgot" href="forget-password">
              Forgot password
            </a>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

export default withRouter<any, any>(
  Form.create({ name: 'normal_login' })(NormalLoginForm)
)
