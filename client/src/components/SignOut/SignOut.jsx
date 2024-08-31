import React from 'react'
import { signOutUser } from '../../js/auth'

const SignOut = () => {
  return (
    <button className='signInButton' onClick={signOutUser}>
        Sign Out
    </button>
  )
}

export default SignOut