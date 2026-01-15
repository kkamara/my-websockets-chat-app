import React, { useEffect, } from "react"
import { useDispatch, useSelector, } from "react-redux"
import { Link, } from "react-router-dom"
import Badge from 'react-badger'
import { getNotifications, } from "../../redux/actions/notificationsActions"

import "./Header.scss"

export default function Header() {
  const state = useSelector(state => ({
    auth: state.auth,
    notifications: state.notifications,
  }))
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getNotifications())
  }, [])

  const renderNotifications = () => {
    return <li className="nav-item dropdown">
      <a className="nav-link dropdown-toggle active" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
        <i className="fa-solid fa-bell"></i>
        <Badge>{state.notifications.data.length}</Badge>
      </a>
      <ul className="dropdown-menu">
        {state.notifications.data.map((notification, index) => (
          <li
            key={index}
            className="dropdown-item"
            onClick={() => {
              window.location = window.location.origin +
                `/chat/?chatID=${notification.chatID}`
            }}
          >
            {notification.content.slice(0, 10)}...
          </li>
        ))}
      </ul>
    </li>
  }

  const renderNavLinks = () => {
    if(null !== state.auth.data) {
      return <>
        {renderNotifications()}
        <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle active" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            <img
              className="header-user-avatar"
              src={state.auth.data.user.avatarPath}
              alt="User Avatar"
            />
            User
          </a>
          <ul className="dropdown-menu">
            <li>
              <Link
                className="dropdown-item"
                to="/user/settings"
              >
                Settings
              </Link>
            </li>
            <li>
              <Link
                className="dropdown-item"
                to="/user/logout"
              >
                Sign Out
              </Link>
            </li>
          </ul>
        </li>
      </>
    } else {
      return <>
        <li className="nav-item">
          <Link
            className="nav-link active"
            aria-current="page"
            to="/user/login"
          >
            Sign In
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className="nav-link active"
            aria-current="page"
            to="/user/register"
          >
            Register
          </Link>
        </li>
      </>
    }
  }

  if (state.auth.loading || state.notifications.loading) {
    return null
  }

  return <nav className="navbar navbar-expand-lg mb-4 bg-primary header-container" data-bs-theme="dark">
    <div className="container">
      <Link className="navbar-brand" to="/">
        {process.env.REACT_APP_NAME}
      </Link>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <Link className="nav-link active" aria-current="page" to="/">Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link active" aria-current="page" to="/chat">Chat</Link>
          </li>
        </ul>
        <ul className="navbar-nav">
          {renderNavLinks()}
        </ul>
      </div>
    </div>
  </nav>
}
