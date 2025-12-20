import React, { useState, } from 'react'
import ScrollableFeed from 'react-scrollable-feed'

import "./MessageBoxComponent.scss"
import MessageBoxItem from './MessageBoxItem'

const data = [
  {
    message: "Ex non pariatur excepteur excepteur sit enim velit irure labore qui esse.",
    profilePicture: "http://localhost:8000/images/profile/default-avatar.webp",
    userId: 1,
  },
  {
    message: "Culpa sunt est exercitation duis est proident aute id cupidatat nisi consectetur sit amet.",
    profilePicture: "http://localhost:8000/images/profile/default-avatar.webp",
    userId: 2,
  },
  {
    message: "Anim aute occaecat dolore Lorem laboris velit cupidatat cupidatat eiusmod sit.",
    profilePicture: "http://localhost:8000/images/profile/default-avatar.webp",
    userId: 1,
  },
  {
    message: "Enim eiusmod aliquip ut consequat occaecat nisi.",
    profilePicture: "http://localhost:8000/images/profile/default-avatar.webp",
    userId: 1,
  },
  {
    message: "Quis nulla elit anim est culpa occaecat culpa aliqua.",
    profilePicture: "http://localhost:8000/images/profile/default-avatar.webp",
    userId: 2,
  },
  {
    message: "Reprehenderit ea id in consectetur ut tempor id irure occaecat.",
    profilePicture: "http://localhost:8000/images/profile/default-avatar.webp",
    userId: 2,
  },
  {
    message: "Dolore culpa amet elit cupidatat esse nisi fugiat commodo id aute fugiat adipisicing consectetur aute.",
    profilePicture: "http://localhost:8000/images/profile/default-avatar.webp",
    userId: 1,
  },
  {
    message: "Cupidatat non eiusmod nulla nisi anim adipisicing do nisi mollit ex do culpa.",
    profilePicture: "http://localhost:8000/images/profile/default-avatar.webp",
    userId: 1,
  },
  {
    message: "Commodo consequat pariatur amet proident sit ullamco aute esse laborum minim eu do 😂😂😂",
    profilePicture: "http://localhost:8000/images/profile/default-avatar.webp",
    userId: 2,
  },
  {
    message: "Exercitation adipisicing exercitation qui nostrud occaecat non excepteur ex sunt.",
    profilePicture: "http://localhost:8000/images/profile/default-avatar.webp",
    userId: 1,
  },
  {
    message: "Nostrud eu aliqua nisi qui eiusmod magna consectetur.",
    profilePicture: "http://localhost:8000/images/profile/default-avatar.webp",
    userId: 1,
  },
  {
    message: "Nostrud magna sit magna velit enim pariatur laboris.",
    profilePicture: "http://localhost:8000/images/profile/default-avatar.webp",
    userId: 1,
  },
  {
    message: "Ad est ipsum veniam officia.",
    profilePicture: "http://localhost:8000/images/profile/default-avatar.webp",
    userId: 1,
  },
  {
    message: "Voluptate dolor ea sint mollit velit nostrud mollit ad ipsum occaecat sint dolor officia occaecat 😂",
    profilePicture: "http://localhost:8000/images/profile/default-avatar.webp",
    userId: 1,
  },
  {
    message: "Est commodo velit cupidatat adipisicing.",
    profilePicture: "http://localhost:8000/images/profile/default-avatar.webp",
    userId: 1,
  },
]

const MessageBoxComponent = () => {
  const [open, setOpen] = useState(true)

  const handleCloseMessageBox = () => {
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
        {data.map((d, index) => (
          <MessageBoxItem key={index} item={d}/>
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