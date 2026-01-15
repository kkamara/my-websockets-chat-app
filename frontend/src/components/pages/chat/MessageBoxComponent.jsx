import React, { useState, useEffect, } from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import MessageBoxItem from './MessageBoxItem'
import { useSelector, useDispatch, } from 'react-redux'
import { setOpenChat } from '../../../redux/actions/openChatActions'
import { getMessages } from '../../../redux/actions/messagesActions'
import { createMessageAction } from '../../../redux/actions/createMessageActions'
import io from "socket.io-client"
import Lottie from 'react-lottie'
import animationData from '../../../animations/typing.json'
import { setNotifications, } from '../../../redux/actions/notificationsActions'

import "./MessageBoxComponent.scss"

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData,
  renderSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
}

let socket

const MessageBoxComponent = () => {
  const state = useSelector(state => ({
    openChat: state.openChat,
    messages: state.messages,
    createMessage: state.createMessage,
    notifications: state.notifications,
  }))
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)

  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [socketConnected, setSocketConnected] = useState(false)
  const [typing, setTyping] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  const searchParams = new URLSearchParams(window.location.search)

  useEffect(() => {
    if (false === state.openChat.loading && state.openChat.data) {
      setOpen(true)
      if (
        state.openChat.data?.id !== state.messages.data?.id
      ) {
        dispatch(getMessages(state.openChat.data.id))
      }

      socket.emit("join chat", {
        userID: JSON.parse(localStorage.getItem("user")).id,
        chatID: state.openChat.data.id,
      })
    }
  }, [state.openChat])

  useEffect(() => {
    if (false === state.messages.loading && state.messages.data) {
      setMessages(state.messages.data.messages)
      if (null === state.openChat.data) {
        dispatch(setOpenChat(state.messages.data))
      }
    }
  }, [state.messages])

  useEffect(() => {
    if (false === state.createMessage.loading && state.createMessage.data) {
      setMessages([...messages, state.createMessage.data])
      socket.emit("new message", {
        ...state.createMessage.data,
        to: state.openChat.data.to,
      })
    }
  }, [state.createMessage])

  useEffect(() => {
    if (searchParams.get("chatID")) {
      handleChatIdInURL(searchParams.get("chatID"))
    }

    socket = io("http://localhost:8000")
    socket.emit("setup", JSON.parse(localStorage.getItem("user")))
    socket.on("connected", () => setSocketConnected(true))
    socket.on("typing", () => setIsTyping(true))
    socket.on("stop typing", () => setIsTyping(false))

    return () => {
      socket.off("connected")
      socket.off("typing")
      socket.off("stop typing")
    }
  }, [])

  useEffect(() => {
    socket.on("message received", newMessageReceived => {
      if (
        null === state.openChat.data ||
        state.openChat.data.id !== newMessageReceived.chatID
      ) {
        const isNewNotification = state.notifications.data.filter(
          n => n.id === newMessageReceived.id
        ).length === 0
        if (isNewNotification) {
          dispatch(setNotifications([newMessageReceived, ...state.notifications.data]))
        }
      } else {
        setMessages([...messages, newMessageReceived])
      }
    })
    return () => {
      socket.off("message received")
    }
  })

  async function handleChatIdInURL(chatIdFromSearch) {
    dispatch(getMessages(chatIdFromSearch))
  }

  const handleCloseMessageBox = () => {
    dispatch(setOpenChat(null))
    setOpen(false)
    window.location = "http://" + window.location.host + "/chat"
  }

  function handleMessageChange (e) {
    setMessage(e.target.value)

    if (!socketConnected) {
      return
    }

    if (!typing) {
      setTyping(true)
      socket.emit("typing", state.openChat.data.id)
    }

    const timerLength = 3000 // 3 seconds
    setTimeout(() => {
      if (typing) {
        socket.emit("stop typing", state.openChat.data.id)
        setTyping(false)
      }
    }, timerLength)
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
      {isTyping ? <div>
        <Lottie
          options={defaultOptions}
          width={70}
          style={{ marginBottom: 15, marginLeft: 0, }}
        />
      </div> : (<></>)}
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
