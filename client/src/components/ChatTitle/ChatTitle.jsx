import React from 'react'

import './style.css';

const ChatTitle = ({chat, currentChat, setcurrentChat}) => {
  return (
    <div className={`chat-title ${currentChat == chat.id ? 'active' : ''}`} onClick={() => setcurrentChat(chat.id)}>
      {chat.title}
    </div>
  )
}

export default ChatTitle