import React from 'react'
import { Form, Icon, Input, Button } from 'antd'
import './login.css'

interface formProps {
  form: any
}

class ForgetPasswordForm extends React.Component<formProps> {
  handleSubmit = (e: any) => {
    e.preventDefault()
    this.props.form.validateFields((err: any, values: string) => {
      if (!err) {
        console.log('Received values of form: ', values)
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <p>
          Please enter your email address below to receive a link to reset your
          password.
        </p>
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
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Reset
          </Button>
          <a className="forgot-form-forgot" href="login">
            Back to Login
          </a>{' '}
        </Form.Item>
      </Form>
    )
  }
}

export default Form.create({ name: 'forget_password' })(ForgetPasswordForm)
