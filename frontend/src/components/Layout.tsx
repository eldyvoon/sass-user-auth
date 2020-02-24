import React, { Component } from 'react'
import { Icon, Layout, Menu, Breadcrumb } from 'antd'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { removeUser, getUser, isGoogleLogin } from '../utils'
import './layout.css'

const { Header, Content, Footer } = Layout
const { SubMenu } = Menu

interface props {
  content: any
}

class MyLayout extends Component<props & RouteComponentProps> {
  render() {
    const { content } = this.props

    return (
      <Layout className="layout">
        <Header>
          <div className="logo" />
          <Menu
            theme="dark"
            selectable={false}
            mode="horizontal"
            defaultSelectedKeys={['2']}
            style={{
              lineHeight: '64px',
              display: 'flex',
              justifyContent: 'flex-end'
            }}
          >
            <Menu.Item
              onClick={() => this.props.history.push('/dashboard')}
              style={{
                position: 'absolute',
                left: 0,
                marginLeft: '50px'
              }}
            >
              {process.env.REACT_APP_BRAND_NAME}
            </Menu.Item>
            <SubMenu
              title={
                <span className="submenu-title-wrapper">
                  <span
                    style={{ marginLeft: '12px', textTransform: 'capitalize' }}
                  >
                    {getUser().name}
                  </span>
                  <Icon
                    style={{
                      fontSize: 12,
                      marginLeft: 8
                    }}
                    type="down"
                  />{' '}
                </span>
              }
            >
              {!isGoogleLogin() && (
                <Menu.Item
                  onClick={() => {
                    this.props.history.push('/change-password')
                  }}
                  key="change-password"
                >
                  <span>Change password</span>
                </Menu.Item>
              )}
              <Menu.Item
                onClick={() => {
                  removeUser()
                  this.props.history.replace('/')
                }}
                key="loguout"
              >
                <span>Logout</span>
              </Menu.Item>
            </SubMenu>
          </Menu>
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}></Breadcrumb>
          <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
            {content()}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center', fontSize: 12 }}>
          {process.env.REACT_APP_BRAND_NAME} ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    )
  }
}

export default withRouter(MyLayout)
