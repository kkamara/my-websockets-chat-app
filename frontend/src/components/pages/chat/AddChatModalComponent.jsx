import React, { useState, useEffect, } from 'react'
import Modal from 'react-modal'
import ErrorComponent from '../../layouts/ErrorComponent'
import { useSelector, useDispatch, } from "react-redux"
import { searchUsers, } from '../../../redux/actions/searchUsersListActions'
import { createChatAction } from '../../../redux/actions/createChatActions'
import { createGroupChatAction } from '../../../redux/actions/createGroupChatActions'
import { getChatList } from '../../../redux/actions/chatListActions'

import "./AddChatModalComponent.scss"

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
  },
}

Modal.setAppElement('#app')

const AddChatComponent = () => {
  const [modalIsOpen, setIsOpen] = useState(false)

  const [selectedUsers, setSelectedUsers] = useState([])
  const [chatGroupName, setChatGroupName] = useState("")

  const [loading, setLoading] = useState(false)

  const [error, setError] = useState()

  const dispatch = useDispatch()
  const state = useSelector(state => ({
    searchUsersList: state.searchUsersList,
    createChat: state.createChat,
    createGroupChat: state.createGroupChat,
  }))

  useEffect(() => {
    setLoading(true)
    loadData()
  }, [])

  useEffect(() => {
    if (false === state.searchUsersList.loading) {
      setLoading(false)

      if (state.searchUsersList.error) {
        setError(state.searchUsersList.error)
      }
    }
  }, [state.searchUsersList])

  useEffect(() => {
    if (false === state.createChat.loading) {
      setLoading(false)

      if (state.createChat.error) {
        setError(state.createChat.error)
      }
      if (state.createChat.data) {
        closeModal()
      }
    }
  }, [state.createChat])

  useEffect(() => {
    if (false === state.createGroupChat.loading) {
      setLoading(false)

      if (state.createGroupChat.error) {
        setError(state.createGroupChat.error)
      }
      if (state.createGroupChat.data) {
        closeModal()
      }
    }
  }, [state.createGroupChat])

  function resetLocalState() {
    setSelectedUsers([])
    setChatGroupName("")
    setError(null)
  }

  function loadData() {
    dispatch(searchUsers())
  }

  function openModal() {
    setIsOpen(true)
  }

  function closeModal() {
    resetLocalState()
    setIsOpen(false)
    window.location.reload()
  }

  async function handleSubmit(e) {
    e.preventDefault()
    
    if (0 === selectedUsers.length) {
      setLoading(false)
      setError("Please select at least one user to start a chat.")
      return
    }

    if (1 === selectedUsers.length) {
      await dispatch(createChatAction(selectedUsers[0]))
    } else {
      await dispatch(createGroupChatAction(
        selectedUsers,
        chatGroupName,
      ))
    }
  }

  function handleUpdateUser(e) {
    const user = state.searchUsersList.data.find(u => u.id == e.target.value)
    if (e.target.checked) {
      setSelectedUsers([...selectedUsers, user.id])
    } else {
      setSelectedUsers(selectedUsers.filter(id => id != e.target.value))
    }
  }
  
  function handleChatGroupNameChange(e) {
    setChatGroupName(e.target.value)
  }

  function getUserName(userID) {
    const user = state.searchUsersList.data.find(u => u.id == userID)
    return `${user.firstName} ${user.lastName}`
  }

  return (
    <div className='add-chat-container'>
      <button onClick={openModal} className="btn btn-default btn-lg">
        Add Chat <i className="fa-solid fa-plus"></i>
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Add Chat Modal"
      >
        {(loading || state.searchUsersList.loading) ? (
          <div className='text-center'>Loading...</div>
        ) : (
          <>
            <h2>Add Chat</h2>
            <hr />
            <ErrorComponent error={error} />
            <form onSubmit={handleSubmit}>
              <div className="form-group add-chat-users-list-container">
                <ul className="add-chat-users-list">
                  {state.searchUsersList.data.map((user, index) => (
                    <div key={index} className="add-chat-user-item">
                      <input
                        type="checkbox"
                        id="add-chat-user"
                        name="add-chat-user"
                        value={user.id}
                        onClick={handleUpdateUser}
                      />&nbsp;{user.firstName} {user.lastName}
                    </div>
                  ))}
                </ul>
              </div>
              <div className="form-group chosen-users-container">
                <label>Chosen Users:</label>
                <ul>
                  {selectedUsers.map((selectedUserID, index) => (
                    <li key={index}>{getUserName(selectedUserID)}</li>
                  ))}
                </ul>
              </div>
              {1 < selectedUsers.length && (
                <div className="form-group">
                  <label htmlFor="chatGroupName">Chat Group Name (optional)</label>
                  <input
                    type="text"
                    id="chatGroupName"
                    name="chatGroupName"
                    className="form-control"
                    value={chatGroupName}
                    onChange={handleChatGroupNameChange}
                  />
                </div>
              )}
              
              <div className="d-flex add-chat-buttons-container">
                <button
                  onClick={closeModal}
                  className='btn btn-secondary'
                  type="button"
                >
                  Close
                </button>
                <input
                  className='btn btn-success me-0 ms-auto'
                  value="Submit"
                  type="submit"
                />
              </div>
            </form>
          </>
        )}
      </Modal>
    </div>
  )
}

export default AddChatComponent