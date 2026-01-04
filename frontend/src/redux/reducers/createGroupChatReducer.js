import { createGroupChat, } from "../types"

const initState = {
  data: null,
  error: null,
  loading: true,
}

export default function createGroupChatReducer (state = initState, action) {
  switch (action.type) {
    
    case createGroupChat.CREATE_GROUP_CHAT_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      }
    
    case createGroupChat.CREATE_GROUP_CHAT_PENDING:
      return {
        ...state,
        loading: true,
      }
    
    case createGroupChat.CREATE_GROUP_CHAT_SUCCESS:
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
