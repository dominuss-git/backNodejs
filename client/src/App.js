import React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import 'materialize-css'
import {useRoutes} from "./routes"
import {useAuth} from "./hooks/auth.hook"
import {AuthContext} from "./context/AuthContext"
import {Navbar} from "./components/Navbar"
import {Loader} from "./components/Loader"
// import { AuthPage } from './pages/AuthPage'
// import { Route } from 'express'

function App() {
  const {token, login, logout, userId, status} = useAuth()
  const isAuthenticated = !!token
  const routes = useRoutes(isAuthenticated)

  if (!status) {
    return (
      <Loader />
    )
  }

  return (
    <AuthContext.Provider value= {{
      token,
      login,
      logout,
      userId,
      isAuthenticated
    }}>
      <Router>
        { isAuthenticated && <Navbar />}
        <div className="container">
          {routes}
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
