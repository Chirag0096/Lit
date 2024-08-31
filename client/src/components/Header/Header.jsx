import React from 'react'
import { FaRobot } from "react-icons/fa6";
import logo from "../../assets/Logo.png";

import './style.css';
import { signOutUser } from '../../js/auth';
import SignIn from '../SignIn/SignIn';
import SignOut from '../SignOut/SignOut';

const Header = ({user}) => {
  return (
    <div className="header">
      <img src={logo} alt="logo" className="logo"/>

      {user && 
        <SignOut />
      }
    </div>
  )
}

export default Header