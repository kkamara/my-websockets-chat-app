import HttpService from "../../services/HttpService"
import { searchUsersList, } from "../types"

export const searchUsers = () => {
  return async dispatch => {
    const http = new HttpService()

    dispatch({ type: searchUsersList.SEARCH_USERS_LIST_PENDING, })

    const tokenId = "user-token"
    await http.getData("/users/search", tokenId)
      .then(res => {
        dispatch({
          type: searchUsersList.SEARCH_USERS_LIST_SUCCESS,
          payload: res.data.data,
        })
      }).catch(error => {
        let message
        if ("ERR_NETWORK" === error.code) {
          message = "Server unavailable."
        } else if (error.response?.data?.message) {
          message = error.response.data.message
        } else {
          message = "Something went wrong. Please come back later."
        }
        dispatch({ 
          type: searchUsersList.SEARCH_USERS_LIST_ERROR, 
          payload: message,
        })
      })
  }
}
