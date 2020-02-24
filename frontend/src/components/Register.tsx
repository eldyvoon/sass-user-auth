import React from 'react'
import { Form, Input, Button, message, Alert } from 'antd'
import { registerUser } from '../api/userApi'
import { withRouter } from 'react-router-dom'

import './login.scss'

interface formProps {
  form: any
  history: any
}

class RegistrationForm extends React.Component<formProps> {
  state = {
    confirmDirty: false,
    doneSignup: false
  }

  handleSubmit = (e: any) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll(async (err: {}, values: any) => {
      if (!err) {
        const { name, email, password } = values
        const result = await registerUser({
          name,
          email,
          password
        })
        if (result.error) {
          message.error(result.error)
        } else {
          this.setState({
            doneSignup: true
          })
          const { setFieldsValue } = this.props.form
          setFieldsValue({ name: '', email: '', password: '', confirm: '' })
        }
      }
    })
  }

  handleConfirmBlur = (e: any) => {
    const { value } = e.target
    this.setState({
      confirmDirty: this.state.confirmDirty || !!value
    })
  }

  compareToFirstPassword = (rule: any, value: {}, callback: any) => {
    const { form } = this.props
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter must be match.')
    } else {
      callback()
    }

    this.setState({
      doneSignup: false
    })
  }

  validateToNextPassword = (rule: any, value: string, callback: any) => {
    const { form } = this.props
    if (value.length < 6) callback('Password must more than 6 characters.')

    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true })
    }
    callback()

    this.setState({
      doneSignup: false
    })
  }

  render() {
    const { doneSignup } = this.state
    const { getFieldDecorator } = this.props.form

    const formStyle = {
      width: '100%',
      margin: '0 auto'
    }

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
              <b>Register with Google</b>
            </p>
          </div>
        </a>

        <Form
          style={formStyle}
          onSubmit={this.handleSubmit}
          className="login-form"
        >
          <div className="or-seperator">
            <p>or</p>
          </div>

          <Form.Item label="Name">
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: 'Name is required.'
                }
              ]
            })(<Input />)}
          </Form.Item>

          <Form.Item label="Email">
            {getFieldDecorator('email', {
              rules: [
                {
                  type: 'email',
                  message: 'Must use a valid Email.'
                },
                {
                  required: true,
                  message: 'Email is required.'
                }
              ]
            })(<Input />)}
          </Form.Item>

          <Form.Item label="Password" hasFeedback>
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: 'Password is required.'
                },
                {
                  validator: this.validateToNextPassword
                }
              ]
            })(<Input.Password />)}
          </Form.Item>

          <Form.Item label="Confirm Password" hasFeedback>
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: 'Confirm password is required.'
                },
                {
                  validator: this.compareToFirstPassword
                }
              ]
            })(<Input.Password onBlur={this.handleConfirmBlur} />)}
          </Form.Item>

          <Form.Item style={formStyle}>
            <Button type="primary" htmlType="submit">
              Register
            </Button>
          </Form.Item>

          <br />
          {doneSignup && (
            <Alert
              message="A confirmation link has been sent to your email."
              type="success"
            />
          )}
        </Form>
      </div>
    )
  }
}

export default withRouter<any, any>(
  Form.create({ name: 'register' })(RegistrationForm)
)
