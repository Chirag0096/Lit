import React from 'react'

import './style.css';

const ChatTitle = ({chat, currentChat, setCurrentChat}) => {
  return (
    <div className={`chat-title ${currentChat == chat.id ? 'active' : ''}`} onClick={() => setCurrentChat(chat.id)}>
      {chat.title}
    </div>
  )
}

export default ChatTitle