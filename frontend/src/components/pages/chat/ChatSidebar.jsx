import React from 'react'
import RenderSidebarItem from './RenderSidebarItem'
import AddChatModalComponent from './AddChatModalComponent'

import "./ChatSidebar.scss"

const data = [
  {
    chatName: null,
    friendUserName: "John Doe"
  },
  {
    chatName: "Qui reprehenderit eu Lorem culpa sint consequat esse qui officia excepteur sunt esse duis.",
    friendUserName: null,
    isGroupChat: true,
  },
  {
    chatName: null,
    friendUserName: "John Smith"
  },
  {
    chatName: null,
    friendUserName: "James Doe"
  },
  {
    chatName: null,
    friendUserName: "Mike Doe"
  },
  {
    chatName: null,
    friendUserName: "Jannine Doe"
  },
  {
    chatName: null,
    friendUserName: "Johnny Doe"
  },
  {
    chatName: null,
    friendUserName: "Clarissa Doe"
  },
  {
    chatName: null,
    friendUserName: "Sarah Doe"
  },
  {
    chatName: "Consequat nulla sit esse aute labore.",
    isGroupChat: true,
    friendUserName: null
  },
]

const ChatSidebar = () => {
  return <div className="chat-sidebar-container">
    <AddChatModalComponent/>
    <br/>
    {data.map((d, index) => (
      <RenderSidebarItem key={index} item={d}/>
    ))}
  </div>
}

export default ChatSidebar