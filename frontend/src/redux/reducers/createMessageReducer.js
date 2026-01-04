import { createMessage, } from "../types"

const initState = {
  data: null,
  error: null,
  loading: true,
}

export default function createMessageReducer (state = initState, action) {
  switch (action.type) {
    
    case createMessage.CREATE_MESSAGE_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      }
    
    case createMessage.CREATE_MESSAGE_PENDING:
      return {
        ...state,
        loading: true,
      }
    
    case createMessage.CREATE_MESSAGE_SUCCESS:
      return {
        ...state,
        data: action.payload,
        loading: false,
        error: null,
      }

    default:
      return state
  }
}
