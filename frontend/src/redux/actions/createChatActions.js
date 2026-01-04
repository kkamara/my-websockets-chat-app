import HttpService from "../../services/HttpService"
import { createChat, } from "../types"

export const createChatAction = userID => {
  return async dispatch => {
    const http = new HttpService()

    dispatch({ type: createChat.CREATE_CHAT_PENDING, })

    const tokenId = "user-token"
    await http.postData(
      "/chat",
      { userID },
      tokenId,
    )
      .then(res => {
        dispatch({
          type: createChat.CREATE_CHAT_SUCCESS,
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
          type: createChat.CREATE_CHAT_ERROR, 
          payload: message,
        })
      })
  }
}
