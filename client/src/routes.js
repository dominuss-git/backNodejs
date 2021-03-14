import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import { AuthPage } from './pages/AuthPage'
import { RegistPage } from './pages/RegistPage'
import { NewBookPage } from './pages/NewBookPage'
import { SearchPage } from './pages/SearchPage'
import { AcountPage } from './pages/AcountPage'

export const useRoutes = isAuthentification => {
  if (isAuthentification) {
    return (
      <Switch>
        <Route path="/create" exact>
          <NewBookPage />
        </Route>
        <Route path="/search" exact>
          <SearchPage />
        </Route>
        <Route path="/account">
          <AcountPage />
        </Route>
        <Redirect to="/search" />
      </Switch>
    )
  } 
  
  return (
    <Switch>
      <Route path="/" exact>
        <AuthPage />
      </Route>
      <Route path="/registr" exact>
          <RegistPage />
      </Route>
      <Redirect to="/" />
    </Switch>
  ) 
}