import React, { useState } from 'react'
import { IoMdSend } from "react-icons/io";
import { FiLoader } from "react-icons/fi";

import "./Input.css";

const Input = ({query, currentChat, user, loading, setloading, getNewChat}) => {
  const [inputField, setinputField] = useState("");

  const onEnterPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent the default action
      query(e.target.value);
      e.target.value = "";
    } 
  }

  const triggerQuery = () => {
    query(inputField);
  }

  const onChange = async (e) => {
    setinputField(e.target.value);
    if (currentChat == "")
      getNewChat();
  }
  
  return (
    <div className='input'>
        <input placeholder="Enter your query" value={inputField} onChange={ onChange } onKeyDown={onEnterPress} />

        <div className='send-icon' onClick={triggerQuery} >
          { loading ? <FiLoader /> : <IoMdSend /> }
        </div>
    </div>
  )
}

export default Input