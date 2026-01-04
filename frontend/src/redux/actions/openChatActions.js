import { openChat, } from "../types"

export const setOpenChat = chat => {
  return async dispatch => {
    dispatch({ type: openChat.SET_OPEN_CHAT_PENDING, })
    dispatch({
      type: openChat.SET_OPEN_CHAT_SUCCESS,
      payload: chat,
    })
  }
}

export const getOpenChat = () => {
  return async (dispatch, getState) => {
    dispatch({ type: openChat.GET_OPEN_CHAT_PENDING, })
    
    dispatch({
      type: openChat.GET_OPEN_CHAT_SUCCESS,
      payload: getState().openChat.data,
    })
  }
}