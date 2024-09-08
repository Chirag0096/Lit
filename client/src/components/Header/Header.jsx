import React from 'react';
import logo from "../../assets/Logo.png";
import SignOut from '../SignOut/SignOut';
import './Header.css';

const Header = ({ user }) => {
  return (
    <header className="header">
      <div className="header-left">
        <img src={logo} alt="logo" className="logo-header"/>
        <h1 className="app-title">Documed</h1>
      </div>
      <div className="header-right">
        {user && <SignOut />}
        <w3m-button />
      </div>
    </header>
  );
};

export default Header;