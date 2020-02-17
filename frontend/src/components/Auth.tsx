import React, { Component } from 'react'
import { Route, Redirect, withRouter } from 'react-router-dom'
import { getUser } from '../utils'

class Auth extends Component<any> {
  render() {
    const { component: Component, ...rest } = this.props
    const isAuth = getUser()

    return (
      <Route
        {...rest}
        render={props => {
          if (isAuth) {
            return <Component {...props} />
          } else {
            return (
              <Redirect
                to={{
                  pathname: '/login'
                }}
              />
            )
          }
        }}
      />
    )
  }
}

export default withRouter<any, any>(Auth)
