import React from 'react'
import { Form, Icon, Input, Button, message } from 'antd'
import { forgetPassword } from '../api/userApi'
import './login.scss'

interface formProps {
  form: any
}

class ForgetPasswordForm extends React.Component<formProps> {
  handleSubmit = (e: any) => {
    e.preventDefault()
    this.props.form.validateFields(
      async (err: any, { email }: { email: string }) => {
        if (!err) {
          const result = await forgetPassword({ email })
          if (result.error) {
            message.error(result.error)
          } else {
            message.success('Check your email for a temporary password.')
            const { setFieldsValue } = this.props.form
            setFieldsValue({ email: '' })
          }
        }
      }
    )
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <div className="login-register-wrap">
        <Form onSubmit={this.handleSubmit}>
          <p>Please enter your email address below:</p>
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
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Reset
            </Button>
            <a className="forgot-form-forgot" href="login">
              Back to Login
            </a>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

export default Form.create({ name: 'forget_password' })(ForgetPasswordForm)
