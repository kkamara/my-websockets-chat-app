import React from 'react'
import ChatSidebar from './ChatSidebar';
import MessageBoxComponent from './MessageBoxComponent';

const ChatComponent = () => {
  if (992 > window.innerWidth) {
    return (
      <div className="chat-component-container container">
        <div className="row">
          <div className="col-12 text-center">
            This chat is designed for larger screens. Please use a desktop device.
          </div>
        </div>
      </div>
    );
  }

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