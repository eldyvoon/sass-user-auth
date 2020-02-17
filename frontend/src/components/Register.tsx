import React from 'react'
import { Form, Input, Button } from 'antd'

import './login.css'

interface formProps {
  form: any
}

class RegistrationForm extends React.Component<formProps> {
  state = {
    confirmDirty: false
  }

  handleSubmit = (e: any) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err: {}, values: string) => {
      if (!err) {
        console.log('Received values of form: ', values)
      }
    })
  }

  handleConfirmBlur = (e: any) => {
    const { value } = e.target
    this.setState({ confirmDirty: this.state.confirmDirty || !!value })
  }

  compareToFirstPassword = (rule: any, value: {}, callback: any) => {
    const { form } = this.props
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter must be match.')
    } else {
      callback()
    }
  }

  validateToNextPassword = (rule: any, value: string, callback: any) => {
    const { form } = this.props
    if (value.length < 6) callback('Password must more than 6 characters.')

    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true })
    }
    callback()
  }

  render() {
    const { getFieldDecorator } = this.props.form

    const formStyle = {
      maxWidth: '500px',
      margin: '0 auto'
    }

    return (
      <Form
        style={formStyle}
        onSubmit={this.handleSubmit}
        className="login-form"
      >
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
      </Form>
    )
  }
}

export default Form.create({ name: 'register' })(RegistrationForm)
