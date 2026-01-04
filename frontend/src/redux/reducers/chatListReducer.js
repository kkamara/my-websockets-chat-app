import { chatList, } from "../types"

const initState = {
  data: null,
  error: null,
  loading: true,
}

export default function chatListReducer (state = initState, action) {
  switch (action.type) {
    
    case chatList.GET_CHAT_LIST_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      }
    
    case chatList.GET_CHAT_LIST_PENDING:
      return {
        ...state,
        loading: true,
      }
    
    case chatList.GET_CHAT_LIST_SUCCESS:
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
