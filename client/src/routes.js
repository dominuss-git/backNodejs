import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import { AuthPage } from './pages/AuthPage'
import { RegistPage } from './pages/RegistPage'
import { NewBookPage } from './pages/NewBookPage'
import { SearchPage } from './pages/SearchPage'
import { AcountPage } from './pages/AcountPage'
import {ChangeUserData} from './pages/ChangeUserData'

export const useRoutes = isAuthentification => {
  if (isAuthentification) {
    return (
      <Switch>
        <Route path="/books/create" exact>
          <NewBookPage />
        </Route>
        <Route path="/books" exact>
          <SearchPage />
        </Route>
        <Route path="/account/:id">
          <AcountPage />
        </Route>
        <Route path="/account/:id/change">
          <ChangeUserData />
        </Route>
        <Redirect to="/books" />
      </Switch>
    )
  } 
  
  return (
    <Switch>
      <Route path="/login" exact>
        <AuthPage />
      </Route>
      <Route path="/registr" exact>
          <RegistPage />
      </Route>
      <Redirect to="/login" />
    </Switch>
  ) 
}