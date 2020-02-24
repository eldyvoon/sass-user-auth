import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import {
  Auth,
  Dashboard,
  Register,
  Login,
  ForgetPassword,
  NotFound,
  ChangePassword,
  Layout
} from './components'

const App: React.FC = () => {
  const DashboardWithLayout = () => <Layout content={() => <Dashboard />} />
  const ChangePasswordWithLayout = () => (
    <Layout content={() => <ChangePassword />} />
  )

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={() => <div>Landing page</div>} />
        <Auth path="/dashboard" component={DashboardWithLayout} />} />
        <Auth
          path="/change-password"
          component={() => <ChangePasswordWithLayout />}
        />
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
        <Route path="/forget-password" component={ForgetPassword} />
        <Route path="*" component={NotFound} />
      </Switch>
    </BrowserRouter>
  )
}

export default App
