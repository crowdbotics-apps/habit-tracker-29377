import { all, call, put, takeLatest } from 'redux-saga/effects';

import { Axios } from '../../api/axios';
import { getSimplifiedError } from '../../utils/error';
import {
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  GET_USER_ERROR,
  UPDATE_USER_PROFILE_REQUEST,
  UPDATE_USER_PROFILE_SUCCESS,
  UPDATE_USER_PROFILE_ERROR,
  SET_USER_PROFILE_PICTURE_REQUEST,
  SET_USER_PROFILE_PICTURE_SUCCESS,
  SET_USER_PROFILE_PICTURE_ERROR,
  UPDATE_SETTINGS_REQUEST,
  UPDATE_SETTINGS_SUCCESS,
  UPDATE_SETTINGS_ERROR,
  GET_ALL_USERS_LIST_REQUEST,
  GET_ALL_USERS_LIST_SUCCESS,
  GET_ALL_USERS_LIST_ERROR,
  ASSIGN_COACHS_REQUEST,
  ASSIGN_COACHS_SUCCESS,
  ASSIGN_COACHS_ERROR,
  ASSIGN_USERS_REQUEST,
  ASSIGN_USERS_SUCCESS,
  ASSIGN_USERS_ERROR,
  TOGGLE_USER_TYPE_REQUEST,
  TOGGLE_USER_TYPE_SUCCESS,
  TOGGLE_USER_TYPE_ERROR,
  GET_SPECIFIC_USER_REQUEST,
  GET_SPECIFIC_USER_SUCCESS,
  GET_SPECIFIC_USER_ERROR,
  UPDATE_SPECIFIC_USER_REQUEST,
  UPDATE_SPECIFIC_USER_SUCCESS,
  UPDATE_SPECIFIC_USER_ERROR,
} from '../reducers/UserReducer';

async function getUserAPI() {
  return Axios.get('/user/get_user_profile/');
}
function* handleGetUserData() {
  try {
    const results = yield call(getUserAPI);
    if (results) {
      yield put({
        type: GET_USER_SUCCESS,
        data: results,
      });
    }
  } catch (error) {
    yield put({
      type: GET_USER_ERROR,
      error: getSimplifiedError(error),
    });
  }
}

async function getSpecificUser({ user_id }) {
  return Axios.get(`/user/${user_id}/`);
}
function* handleGetSpecificUser({ payload }) {
  try {
    const results = yield call(getSpecificUser, payload);
    if (results) {
      yield put({
        type: GET_SPECIFIC_USER_SUCCESS,
        data: results,
      });
    }
  } catch (error) {
    yield put({
      type: GET_SPECIFIC_USER_ERROR,
      error: getSimplifiedError(error),
    });
  }
}

async function updateSpecificUser(payload) {
  return await Axios.put(`/user/${payload.id}/`, payload.body);
}
function* handleUpdateSpecificUser({ payload }) {
  try {
    const results = yield call(updateSpecificUser, payload);
    if (results) {
      yield put({
        type: UPDATE_SPECIFIC_USER_SUCCESS,
        data: results,
      });
    }
  } catch (error) {
    yield put({
      type: UPDATE_SPECIFIC_USER_ERROR,
      error: getSimplifiedError(error),
    });
  }
}

async function setUserProfilePictureAPI(payload) {
  return await Axios.post('/user/set_profile_picture/', payload);
}
function* handleSetUserProfilePicture({ payload }) {
  try {
    const results = yield call(setUserProfilePictureAPI, payload);
    if (results) {
      yield put({
        type: SET_USER_PROFILE_PICTURE_SUCCESS,
        data: results,
      });
    }
  } catch (error) {
    yield put({
      type: SET_USER_PROFILE_PICTURE_ERROR,
      error: getSimplifiedError(error),
    });
  }
}

async function updateUserProfileAPI(payload) {
  return await Axios.put(`/user/${payload.id}/`, payload.body);
}
function* handleUpdateUserProfile({ payload }) {
  try {
    const results = yield call(updateUserProfileAPI, payload);
    if (results) {
      yield put({
        type: UPDATE_USER_PROFILE_SUCCESS,
        data: results,
      });
    }
  } catch (error) {
    yield put({
      type: UPDATE_USER_PROFILE_ERROR,
      error: getSimplifiedError(error),
    });
  }
}

async function updateSettingsAPI(payload) {
  return await Axios.post(`/user/update_settings/`, payload);
}
function* handleUpdateSettings({ payload }) {
  try {
    const results = yield call(updateSettingsAPI, payload);
    if (results) {
      yield put({
        type: UPDATE_SETTINGS_SUCCESS,
        data: results,
      });
    }
  } catch (error) {
    yield put({
      type: UPDATE_SETTINGS_ERROR,
      error: getSimplifiedError(error),
    });
  }
}

async function getAllUsersList({
  limit = '',
  offset = '',
  user_type = '',
  query = '',
}) {
  return await Axios.get(
    `/user/?limit=${limit}&offset=${offset}&user_type=${user_type}&query=${query}`,
  );
}
function* handleGetAllUsersList({ payload = {} }) {
  try {
    const response = yield call(getAllUsersList, payload);
    if (response) {
      yield put({
        type: GET_ALL_USERS_LIST_SUCCESS,
        data: response,
      });
    }
  } catch (error) {
    yield put({
      type: GET_ALL_USERS_LIST_ERROR,
      error: getSimplifiedError(error),
    });
  }
}

async function assignCoachsApi(payload) {
  return await Axios.post(`/user/assign_coach/`, payload);
}
function* handleAssignCoaches({ payload }) {
  try {
    const response = yield call(assignCoachsApi, payload);
    if (response) {
      yield put({
        type: ASSIGN_COACHS_SUCCESS,
        data: response,
        from: payload.from,
      });
    }
  } catch (error) {
    yield put({
      type: ASSIGN_COACHS_ERROR,
      error: getSimplifiedError(error),
    });
  }
}

async function assignUsersApi(payload) {
  return await Axios.post(`/user/assign_user/`, payload);
}
function* handleAssignUsers({ payload }) {
  try {
    const response = yield call(assignUsersApi, payload);
    if (response) {
      yield put({
        type: ASSIGN_USERS_SUCCESS,
        data: response,
      });
    }
  } catch (error) {
    yield put({
      type: ASSIGN_USERS_ERROR,
      error: getSimplifiedError(error),
    });
  }
}

async function toggleUserType(payload) {
  return await Axios.post(`/user/toggle_coach/`, payload);
}
function* handleToggleUserType({ payload }) {
  try {
    const response = yield call(toggleUserType, payload);
    if (response) {
      yield put({
        type: TOGGLE_USER_TYPE_SUCCESS,
        data: response,
      });
    }
  } catch (error) {
    yield put({
      type: TOGGLE_USER_TYPE_ERROR,
      error: getSimplifiedError(error),
    });
  }
}

export default all([
  takeLatest(GET_USER_REQUEST, handleGetUserData),
  takeLatest(SET_USER_PROFILE_PICTURE_REQUEST, handleSetUserProfilePicture),
  takeLatest(UPDATE_USER_PROFILE_REQUEST, handleUpdateUserProfile),
  takeLatest(UPDATE_SETTINGS_REQUEST, handleUpdateSettings),
  takeLatest(GET_ALL_USERS_LIST_REQUEST, handleGetAllUsersList),
  takeLatest(ASSIGN_COACHS_REQUEST, handleAssignCoaches),
  takeLatest(ASSIGN_USERS_REQUEST, handleAssignUsers),
  takeLatest(TOGGLE_USER_TYPE_REQUEST, handleToggleUserType),
  takeLatest(GET_SPECIFIC_USER_REQUEST, handleGetSpecificUser),
  takeLatest(UPDATE_SPECIFIC_USER_REQUEST, handleUpdateSpecificUser),
]);
