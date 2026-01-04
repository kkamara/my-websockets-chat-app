import React, { useState, useEffect, } from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import MessageBoxItem from './MessageBoxItem'
import { useSelector, useDispatch, } from 'react-redux'
import { setOpenChat } from '../../../redux/actions/openChatActions'
import { getMessages } from '../../../redux/actions/messagesActions'

import "./MessageBoxComponent.scss"

const MessageBoxComponent = () => {
  const state = useSelector(state => ({
    openChat: state.openChat,
    messages: state.messages,
  }))
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (false === state.openChat.loading && state.openChat.data) {
      setOpen(true)
      dispatch(getMessages(state.openChat.data.id))
    }
  }, [state.openChat])

  const handleCloseMessageBox = () => {
    dispatch(setOpenChat(null))
    setOpen(false)
  }

  if (false === open) {
    return (
      <div>Choose a friend or group chat to chat.</div>
    )
  }

  if (state.messages.loading) {
    return (
      <div>Loading messages...</div>
    )
  }

  return <div className="message-box-container">
    <div className="text-end">
      <button
        className="btn btn-info btn-lg close-message-box-btn"
        onClick={handleCloseMessageBox}
      >
        <i className="fa-solid fa-x"></i>
      </button>
    </div>

    <div className="messages">
      <ScrollableFeed>
        {state.messages.data.messages.map((m, index) => (
          <MessageBoxItem key={index} item={m}/>
        ))}
      </ScrollableFeed>
    </div>

    <input
      type="text"
      className="form-control message-box-input"
      name="message"
    />
    <button className="btn btn-success btn-lg send-message-btn">
      Send
    </button>
  </div>
}

export default MessageBoxComponent