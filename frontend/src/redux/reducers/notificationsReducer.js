import { notifications, } from "../types"

const initState = {
  data: [],
  error: null,
  loading: true,
}

export default function notificationsReducer (state = initState, action) {
  switch (action.type) {
    
    case notifications.SET_NOTIFICATIONS_ERROR:
    case notifications.GET_NOTIFICATIONS_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      }
    
    case notifications.SET_NOTIFICATIONS_PENDING:
    case notifications.GET_NOTIFICATIONS_PENDING:
      return {
        ...state,
        loading: true,
      }
    
    case notifications.SET_NOTIFICATIONS_SUCCESS:
    case notifications.GET_NOTIFICATIONS_SUCCESS:
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
