import { createChat, } from "../types"

const initState = {
  data: null,
  error: null,
  loading: true,
}

export default function createChatReducer (state = initState, action) {
  switch (action.type) {
    
    case createChat.CREATE_CHAT_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      }
    
    case createChat.CREATE_CHAT_PENDING:
      return {
        ...state,
        loading: true,
      }
    
    case createChat.CREATE_CHAT_SUCCESS:
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
