import React from 'react'
import ChatSidebar from './ChatSidebar';
import MessageBoxComponent from './MessageBoxComponent';

const ChatComponent = () => {
  return (
    <div className="chat-component-container container">
      <div className="row">
        <div className="col-md-2">
          <ChatSidebar/>
        </div>
        <div className="col-md-10">
          <MessageBoxComponent/>
        </div>
      </div>
    </div>
  )
}

export default ChatComponent;