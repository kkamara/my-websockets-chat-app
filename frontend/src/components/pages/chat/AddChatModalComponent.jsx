import React, { useState, useEffect, } from 'react'
import Modal from 'react-modal'
import ErrorComponent from '../../layouts/ErrorComponent'

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

const users = [
  {name: "John Doe", id: 1},
  {name: "Jane Doe", id: 2},
  {name: "Jim Doe", id: 3},
  {name: "Jill Doe", id: 4},
  {name: "Sunt eu", id: 5},
  {name: "Ullamco", id: 6},
  {name: "Commodo ", id: 7},
  {name: "Ut elit", id: 8},
]

const AddChatComponent = () => {
  const [modalIsOpen, setIsOpen] = useState(false)

  const [query, setQuery] = useState("")
  const [selectedUsers, setSelectedUsers] = useState([])
  const [chatGroupName, setChatGroupName] = useState("")

  const [loading, setLoading] = useState(false)

  const [error, setError] = useState("Some error")

  useEffect(() => {
    setLoading(false)
  }, [])

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function handleSubmit() {
    setIsOpen(false);
  }

  function handleQueryChange(e) {
    setQuery(e.target.value)
  }

  function handleUpdateUser(e) {
    const userName = users.find(u => u.id === parseInt(e.target.value)).name
    if (e.target.checked) {
      setSelectedUsers([...selectedUsers, userName])
    } else {
      setSelectedUsers(selectedUsers.filter(u => u !== userName))
    }
  }

  function handleChatGroupNameChange(e) {
    setChatGroupName(e.target.value)
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
        {loading ? (
          <div className='text-center'>Loading...</div>
        ) : (
          <>
            <h2>Add Chat</h2>
            <hr />
            <ErrorComponent error={error} />
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="query">Search Users</label>
                <div className="d-flex">
                  <input
                    type="text"
                    id="add-chat-query"
                    name="query"
                    className="form-control"
                    value={query}
                    onChange={handleQueryChange}
                  />
                  <button className="btn btn-info">
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </button>
                </div>
              </div>
              <div className="form-group add-chat-users-list-container">
                <ul className="add-chat-users-list">
                  {users.map((user, index) => (
                    <div key={index} className="add-chat-user-item">
                      <input
                        type="checkbox"
                        id="add-chat-user"
                        name="add-chat-user"
                        value={user.id}
                        onClick={handleUpdateUser}
                      />&nbsp;{user.name}
                    </div>
                  ))}
                </ul>
              </div>
              <div className="form-group chosen-users-container">
                <label>Chosen Users:</label>
                <ul>
                  {selectedUsers.map((selectedUser, index) => (
                    <li key={index}>{selectedUser}</li>
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