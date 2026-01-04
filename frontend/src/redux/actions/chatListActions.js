import HttpService from "../../services/HttpService"
import { chatList, } from "../types"

export const getChatList = () => {
  return async dispatch => {
    const http = new HttpService()

    dispatch({ type: chatList.GET_CHAT_LIST_PENDING, })

    const tokenId = "user-token"
    await http.getData("/chat/list", tokenId)
      .then(res => {
        dispatch({
          type: chatList.GET_CHAT_LIST_SUCCESS,
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
          type: chatList.GET_CHAT_LIST_ERROR, 
          payload: message,
        })
      })
  }
}
