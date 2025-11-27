import React from 'react'
import ChatSidebar from './ChatSidebar';

const ChatComponent = () => {
  return (
    <div className="chat-component-container container">
      <div className="row">
        <div className="col-md-2">
          <ChatSidebar/>
        </div>
        <div className="col-md-10">
          <div>ChatComponent</div>
        </div>
      </div>
    </div>
  )
}

export default ChatComponent;