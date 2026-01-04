import React, { useState, useEffect, } from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import MessageBoxItem from './MessageBoxItem'
import { useSelector, useDispatch, } from 'react-redux'
import { setOpenChat } from '../../../redux/actions/openChatActions'

import "./MessageBoxComponent.scss"

const MessageBoxComponent = () => {
  const state = useSelector(state => ({
    openChat: state.openChat
  }))
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (false === state.openChat.loading && state.openChat.data) {
      setOpen(true)
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
        {/* {data.map((d, index) => (
          <MessageBoxItem key={index} item={d}/>
        ))} */}
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