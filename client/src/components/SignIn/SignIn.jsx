import React from 'react'
import { signInUser } from '../../js/auth'
import './style.css';

const SignIn = () => {
  return (
    <div className='SignIn'>
      <h2>Welcome! Please Login to continue</h2>
      <button className='signInButton' onClick={signInUser}> 
        Sign In
      </button>
    </div>
  )
}

export default SignIn