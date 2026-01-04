import { combineReducers, } from "redux"
import authReducer from "./authReducer"
import usersReducer from "./usersReducer"
import avatarReducer from "./avatarReducer"
import updateUserSettingsReducer from "./updateUserSettingsReducer"
import removeAvatarReducer from "./removeAvatarReducer"
import chatListReducer from "./chatListReducer"
import searchUsersListReducer from "./searchUsersListReducer"
import createChatReducer from "./createChatReducer"
import createGroupChatReducer from "./createGroupChatReducer"

export default combineReducers({
  auth: authReducer,
  users: usersReducer,
  avatar: avatarReducer,
  updateUserSettings: updateUserSettingsReducer,
  removeAvatar: removeAvatarReducer,
  chatList: chatListReducer,
  searchUsersList: searchUsersListReducer,
  createChat: createChatReducer,
  createGroupChat: createGroupChatReducer,
})
