import React from 'react'

import "./MessageBoxItem.scss"

const MessageBoxItem = ({ item }) => {
  if (1 === item.userId) {
    return <div className="my-message-box-item">
      {item.message}
    </div>
  }

  return <div className="other-message-box-item">
    <img
      src={item.profilePicture}
      className="img-fluid profile-picture"
    />
    {item.message}
  </div>
}

export default MessageBoxItem