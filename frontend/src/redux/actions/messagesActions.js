import HttpService from "../../services/HttpService"
import { messages, } from "../types"

export const getMessages = chatID => {
  return async dispatch => {
    const http = new HttpService()

    dispatch({ type: messages.GET_MESSAGES_PENDING, })

    const tokenId = "user-token"
    await http.getData("/chat/" + chatID, tokenId)
      .then(res => {
        dispatch({
          type: messages.GET_MESSAGES_SUCCESS,
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
          type: messages.GET_MESSAGES_ERROR, 
          payload: message,
        })
      })
  }
}
