import HttpService from "../../services/HttpService"
import { createGroupChat, } from "../types"

export const createGroupChatAction = (userIDs, chatName) => {
  return async dispatch => {
    const http = new HttpService()

    dispatch({ type: createGroupChat.CREATE_GROUP_CHAT_PENDING, })

    const payload = { userIDs }
    if (chatName) {
      payload.chatName = chatName
    }

    const tokenId = "user-token"
    await http.postData(
      "/chat/group",
      payload,
      tokenId,
    )
      .then(res => {
        dispatch({
          type: createGroupChat.CREATE_GROUP_CHAT_SUCCESS,
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
          type: createGroupChat.CREATE_GROUP_CHAT_ERROR, 
          payload: message,
        })
      })
  }
}
