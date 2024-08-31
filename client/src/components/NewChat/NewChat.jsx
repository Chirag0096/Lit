import React from 'react'
import { IoMdChatboxes } from "react-icons/io";

import './NewChat.css';

const NewChat = ({onClick, user}) => {
  return (
    <div className='newChat' onClick={onClick}>
        <IoMdChatboxes />
        <p>
            NewChat
        </p>
    </div>
  )
}

export default NewChat