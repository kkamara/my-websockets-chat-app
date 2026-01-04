import React from 'react'

import "./MessageBoxItem.scss"

const MessageBoxItem = ({ item }) => {
  const authUsersID = localStorage.getItem("user-id")
  if (authUsersID == item.sender.id) {
    return <div className="my-message-box-item">
      {item.content}
    </div>
  }

  return <div className="other-message-box-item">
    <div className="container">
      <div className="row">
        <div className="col-md-1">
          <img
            src={item.avatarPath}
            className="img-fluid profile-picture"
          />
        </div>
        <div className="col-md-11">
          {item.content}
        </div>
      </div>
    </div>
  </div>
}

export default MessageBoxItem