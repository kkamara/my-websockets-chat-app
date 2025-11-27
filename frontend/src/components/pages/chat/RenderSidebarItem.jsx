import React from 'react'

import "./RenderSidebarItem.scss"

const RenderSidebarItem = ({ item }) => {
  const chatName = item.isGroupChat ?
    item.chatName :
    item.friendUserName
  return (
    <button className="btn btn-primary sidebar-item">
      {chatName}
    </button>
  )
}

export default RenderSidebarItem