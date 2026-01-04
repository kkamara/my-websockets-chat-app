import { openChat, } from "../types"

const initState = {
  data: null,
  error: null,
  loading: true,
}

export default function openChatReducer (state = initState, action) {
  switch (action.type) {
    
    case openChat.SET_OPEN_CHAT_ERROR:
    case openChat.GET_OPEN_CHAT_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      }
    
    case openChat.SET_OPEN_CHAT_PENDING:
    case openChat.GET_OPEN_CHAT_PENDING:
      return {
        ...state,
        loading: true,
      }
    
    case openChat.SET_OPEN_CHAT_SUCCESS:
    case openChat.GET_OPEN_CHAT_SUCCESS:
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
