import React, {useContext} from 'react'
import {AuthContext} from '../context/AuthContext'

export const AcountPage = () => {
  const context = useContext(AuthContext)
  console.log(context.userId)

  return (
    <div>
      <h1>
        Acount Page
      </h1>
    </div>
  )
}