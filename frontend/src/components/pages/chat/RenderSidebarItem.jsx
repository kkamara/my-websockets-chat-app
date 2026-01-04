import React from 'react'
import { useDispatch } from 'react-redux'
import { setOpenChat } from '../../../redux/actions/openChatActions'

import "./RenderSidebarItem.scss"

const RenderSidebarItem = ({ item }) => {
  const dispatch = useDispatch()

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

  function setChat(item) {
    dispatch(setOpenChat(item))
  }

  return (
    <button
      className="btn btn-primary sidebar-item"
      onClick={() => setChat(item)}
    >
      {getChatName(item)}
    </button>
  )
}

export default RenderSidebarItem