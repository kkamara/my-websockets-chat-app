import { searchUsersList, } from "../types"

const initState = {
  data: null,
  error: null,
  loading: true,
}

export default function searchUsersListReducer (state = initState, action) {
  switch (action.type) {
    
    case searchUsersList.SEARCH_USERS_LIST_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      }
    
    case searchUsersList.SEARCH_USERS_LIST_PENDING:
      return {
        ...state,
        loading: true,
      }
    
    case searchUsersList.SEARCH_USERS_LIST_SUCCESS:
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
