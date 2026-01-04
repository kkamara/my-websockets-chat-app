import React from 'react'

import "./RenderSidebarItem.scss"

const RenderSidebarItem = ({ item }) => {
  function getChatName(item) {
    let result = item.isGroupChat ?
      item.chatName :
      `${item.to.firstName} ${item.to.lastName}`
    if (result) {
      return result
    }
    result = `${item.to.length + 1} users with chat ID ${item.id}`
    return result
  }

  return (
    <button className="btn btn-primary sidebar-item">
      {getChatName(item)}
    </button>
  )
}

export default RenderSidebarItem