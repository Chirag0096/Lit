import React, { useState } from 'react';
import { IoMdSend } from "react-icons/io";
import { FiLoader } from "react-icons/fi";

import "./Input.css";

const Input = ({ query, currentChat, user, loading, setloading, getNewChat }) => {
  const [inputField, setinputField] = useState("");
  const [imageBase64, setImageBase64] = useState(null);

  const onEnterPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent the default action
      triggerQuery();
    } 
  }

  const triggerQuery = () => {
    if (imageBase64) {
      console.log(imageBase64);
      
      // Handle image query with base64 string
      query(imageBase64.split(',')[1]);
    } else {
      console.log("here");
      
      // Handle text query
      query(inputField);
    }
    setinputField("");
    setImageBase64(null); // Reset image base64 after query
  }

  const onChange = (e) => {
    setinputField(e.target.value);
    if (currentChat === "")
      getNewChat();
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result); // Set base64 string
      };
      reader.readAsDataURL(file); // Convert image to base64
    }
  }

  return (
    <div className='input'>
        <input 
          placeholder="Enter your query" 
          value={inputField} 
          onChange={onChange} 
          onKeyDown={onEnterPress} 
        />

        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageChange} 
          style={{ marginTop: '10px' }} 
        />

        <div className='send-icon' onClick={triggerQuery} >
          { loading ? <FiLoader /> : <IoMdSend /> }
        </div>
    </div>
  );
}

export default Input;
