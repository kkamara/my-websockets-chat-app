import React, { useState, useEffect, } from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import MessageBoxItem from './MessageBoxItem'
import { useSelector, useDispatch, } from 'react-redux'
import { setOpenChat } from '../../../redux/actions/openChatActions'
import { getMessages } from '../../../redux/actions/messagesActions'
import { createMessageAction } from '../../../redux/actions/createMessageActions'

import "./MessageBoxComponent.scss"

const MessageBoxComponent = () => {
  const state = useSelector(state => ({
    openChat: state.openChat,
    messages: state.messages,
  }))
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)

  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])

  useEffect(() => {
    if (false === state.openChat.loading && state.openChat.data) {
      setOpen(true)
      dispatch(getMessages(state.openChat.data.id))
    }
  }, [state.openChat])

  useEffect(() => {
    if (false === state.messages.loading && state.messages.data) {
      setMessages(state.messages.data.messages)
    }
  }, [state.messages])

  const handleCloseMessageBox = () => {
    dispatch(setOpenChat(null))
    setOpen(false)
  }

  function handleMessageChange (e) {
    setMessage(e.target.value)
  }

  function handleSubmit (e) {
    e.preventDefault()
    dispatch(createMessageAction(state.openChat.data.id, message))
    setMessage("")
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

  return <form className="message-box-container" onSubmit={handleSubmit}>
    <div className="text-end">
      <button
        className="btn btn-info btn-lg close-message-box-btn"
        onClick={handleCloseMessageBox}
        type="button"
      >
        <i className="fa-solid fa-x"></i>
      </button>
    </div>

    <div className="messages">
      <ScrollableFeed>
        {messages.map((m, index) => (
          <MessageBoxItem key={index} item={m}/>
        ))}
      </ScrollableFeed>
    </div>

    <input
      type="text"
      className="form-control message-box-input"
      name="message"
      id="message"
      value={message}
      onChange={handleMessageChange}
    />
    <button className="btn btn-success btn-lg send-message-btn" type="submit">
      Send
    </button>
  </form>
}

export default MessageBoxComponent