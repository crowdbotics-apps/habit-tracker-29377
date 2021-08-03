import {
  GET_USER_REQUEST,
  RESET_FLAGS_USERS,
  SET_USER_PROFILE_PICTURE_REQUEST,
  UPDATE_SETTINGS_REQUEST,
  UPDATE_USER_PROFILE_REQUEST,
  GET_ALL_USERS_LIST_REQUEST,
  ASSIGN_COACHS_REQUEST,
  ASSIGN_USERS_REQUEST,
  SET_SELECTED_USER,
  TOGGLE_USER_TYPE_REQUEST,
  GET_SPECIFIC_USER_REQUEST,
  UPDATE_SPECIFIC_USER_REQUEST,
  SET_PAGE_INDEX,
  SET_USER_QUERY,
} from '../reducers/UserReducer';

export const getUserData = () => ({ type: GET_USER_REQUEST });

export const setUserProfilePicture = (payload) => ({
  type: SET_USER_PROFILE_PICTURE_REQUEST,
  payload,
});

export const updateUserProfile = (payload) => ({
  type: UPDATE_USER_PROFILE_REQUEST,
  payload,
});

export const updateSetting = (payload) => ({
  type: UPDATE_SETTINGS_REQUEST,
  payload,
});

export const resetFlagsUsers = (payload) => ({
  type: RESET_FLAGS_USERS,
  payload,
});

export const getAllUsersList = (payload) => ({
  type: GET_ALL_USERS_LIST_REQUEST,
  payload,
});

export const assignCoaches = (payload) => ({
  type: ASSIGN_COACHS_REQUEST,
  payload,
});

export const assignUsers = (payload) => ({
  type: ASSIGN_USERS_REQUEST,
  payload,
});

export const getSpecificUser = (payload) => ({
  type: GET_SPECIFIC_USER_REQUEST,
  payload,
});

export const updateSpecificUser = (payload) => ({
  type: UPDATE_SPECIFIC_USER_REQUEST,
  payload,
});

export const toggleUserType = (payload) => ({
  type: TOGGLE_USER_TYPE_REQUEST,
  payload,
});

export const setSelectedUser = (payload) => ({
  type: SET_SELECTED_USER,
  payload,
});

export const setPageIndex = (page) => ({
  type: SET_PAGE_INDEX,
  page,
});

export const setUserQuery = (query) => ({
  type: SET_USER_QUERY,
  query,
});
