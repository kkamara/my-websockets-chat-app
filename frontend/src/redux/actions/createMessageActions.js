import HttpService from "../../services/HttpService"
import { createMessage, } from "../types"

export const createMessageAction = (chatID, messageContent) => {
  return async dispatch => {
    const http = new HttpService()

    dispatch({ type: createMessage.CREATE_MESSAGE_PENDING, })

    const tokenId = "user-token"
    await http.postData(
      "/chat/" + chatID,
      { content: messageContent, },
      tokenId,
    )
      .then(res => {
        dispatch({
          type: createMessage.CREATE_MESSAGE_SUCCESS,
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
          type: createMessage.CREATE_MESSAGE_ERROR, 
          payload: message,
        })
      })
  }
}
