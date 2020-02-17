import React from 'react'
import { Form, Icon, Input, Button, message } from 'antd'
import { withRouter } from 'react-router-dom'
import './login.css'
import { loginUser } from '../utils/api'
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
    const { getFieldDecorator } = this.props.form
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator('email', {
            rules: [{ required: true, message: 'Email is required' }]
          })(
            <Input
              prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Email"
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Password is required.' }]
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
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
          </a>{' '}
        </Form.Item>
      </Form>
    )
  }
}

export default withRouter<any, any>(
  Form.create({ name: 'normal_login' })(NormalLoginForm)
)
