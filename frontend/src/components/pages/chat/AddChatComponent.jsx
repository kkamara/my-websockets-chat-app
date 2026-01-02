import React, { useState, } from 'react'
import Modal from 'react-modal'

import "./AddChatComponent.scss"

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    height: 500,
  },
}

Modal.setAppElement('#app')

const AddChatComponent = () => {
  const [modalIsOpen, setIsOpen] = useState(false)

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function handleSubmit() {
    setIsOpen(false);
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
        <h2>Add Chat</h2>
        <hr />
        <div className="d-flex">
          <button
            onClick={closeModal}
            className='btn btn-info'
          >
            Close
          </button>
          <button
            onClick={handleSubmit}
            className='btn btn-primary me-0 ms-auto'
          >
            Submit
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default AddChatComponent