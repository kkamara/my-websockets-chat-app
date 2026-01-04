import React, { useState, useEffect, } from 'react'
import RenderSidebarItem from './RenderSidebarItem'
import AddChatModalComponent from './AddChatModalComponent'
import { useSelector, useDispatch } from 'react-redux'
import { getChatList } from '../../../redux/actions/chatListActions'

import "./ChatSidebar.scss"

const ChatSidebar = () => {
  const [loading, setLoading] = useState(false)

  const chatListState = useSelector(state => state.chatList)
  const dispatch = useDispatch()

  useEffect(() => {
    setLoading(true)
    loadData()
  }, [])

  useEffect(() => {
    if (false === chatListState.loading) {
      setLoading(false)
    }
  }, [chatListState])

  const loadData = async () => {
    dispatch(getChatList())
  }

  if (loading || chatListState.loading) {
    return null
  }
  
  return <div className="chat-sidebar-container">
    <AddChatModalComponent/>
    <br/>
    {chatListState.data.map((d, index) => (
      <RenderSidebarItem key={index} item={d}/>
    ))}
  </div>
}

export default ChatSidebar