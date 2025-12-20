import React from 'react'

import "./MessageBoxItem.scss"

const MessageBoxItem = ({ item }) => {
  if (1 === item.userId) {
    return <div className="my-message-box-item">
      {item.message}
    </div>
  }

  return <div className="other-message-box-item">
    <div className="container">
      <div className="row">
        <div className="col-md-1">
          <img
            src={item.profilePicture}
            className="img-fluid profile-picture"
          />
        </div>
        <div className="col-md-11">
          {item.message}
        </div>
      </div>
    </div>
  </div>
}

export default MessageBoxItem