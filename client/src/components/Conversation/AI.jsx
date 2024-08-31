import React from 'react';
import logo from "../../assets/Logo.png";

import "./style.css";

const AI = ({data}) => {
  if (!(data instanceof Array))
    data = [data]
  
  return (
    // eslint-disable-next-line react-dom/validate-dom-nesting
    <div className='ai'>
        <img src={logo} alt="logo" className="logo"/>

        {data.map((element, index) => (
          <div key={index} >{element}</div>
      ))}
    </div>
  )
}

export default AI