import React from 'react'
import { Form, Input, Button, message } from 'antd'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { getUser, setUser } from '../utils'
import { changePassword } from '../utils/api'

interface formProps {
  form: any
}

class ChangePassword extends React.Component<formProps & RouteComponentProps> {
  state = {
    confirmDirty: false,
    submitting: false
  }

  handleSubmit = (e: any) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll(
      async (
        err: {},
        values: {
          password: string
          confirm: string
        }
      ) => {
        if (!err) {
          const {
            user: { name, email }
          } = getUser()

          this.setState({
            submitting: true
          })

          const { data } = await changePassword({
            name,
            email,
            password: values.password
          })

          setUser(data)
          message.success('Password Changed!', 1.5, () => {
            this.props.history.push('/dashboard')
          })

          this.setState({
            submitting: false
          })
        }
      }
    )
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
      maxWidth: '300px',
      margin: '15px auto'
    }

    return (
      <Form style={formStyle} onSubmit={this.handleSubmit}>
        <Form.Item label="New password" hasFeedback>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: 'New password is required.'
              },
              {
                validator: this.validateToNextPassword
              }
            ]
          })(<Input.Password />)}
        </Form.Item>

        <Form.Item label="Confirm password" hasFeedback>
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
          <Button
            type="primary"
            htmlType="submit"
            loading={this.state.submitting}
            disabled={this.state.submitting}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

export default withRouter<any, any>(
  Form.create({ name: 'change-password' })(ChangePassword)
)
