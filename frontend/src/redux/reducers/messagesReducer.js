import { messages, } from "../types"

const initState = {
  data: null,
  error: null,
  loading: true,
}

export default function messagesReducer (state = initState, action) {
  switch (action.type) {
    
    case messages.GET_MESSAGES_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      }
    
    case messages.GET_MESSAGES_PENDING:
      return {
        ...state,
        loading: true,
      }
    
    case messages.GET_MESSAGES_SUCCESS:
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
