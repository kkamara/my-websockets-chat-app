import { notifications, } from "../types"

export const setNotifications = notificationsData => {
  return async dispatch => {
    dispatch({ type: notifications.SET_NOTIFICATIONS_PENDING, })

    const chatIDs = []
    const payload = []
    for (const notification of notificationsData) {
      if (!chatIDs.includes(notification.chatID)) {
        chatIDs.push(notification.chatID)
        payload.push(notification)
      }
    }

    dispatch({
      type: notifications.SET_NOTIFICATIONS_SUCCESS,
      payload,
    })
  }
}

export const getNotifications = () => {
  return async (dispatch, getState) => {
    dispatch({ type: notifications.GET_NOTIFICATIONS_PENDING, })
    
    dispatch({
      type: notifications.GET_NOTIFICATIONS_SUCCESS,
      payload: getState().notifications.data,
    })
  }
}