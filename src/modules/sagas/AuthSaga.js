import { all, call, put, takeLatest } from 'redux-saga/effects';
import Cookies from 'js-cookie';

import { Axios } from '../../api/axios';
import axios from 'axios';
import { getSimplifiedError } from '../../utils/error';
import {
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_ERROR,
  FORGOT_PASSWORD_ERROR,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  LOGIN_ERROR,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  GOOGLE_LOGIN_REQUEST,
  GOOGLE_LOGIN_SUCCESS,
  GOOGLE_LOGIN_ERROR,
  FACEBOOK_LOGIN_REQUEST,
  FACEBOOK_LOGIN_SUCCESS,
  FACEBOOK_LOGIN_ERROR,
  APPLE_LOGIN_REQUEST,
  APPLE_LOGIN_SUCCESS,
  APPLE_LOGIN_ERROR,
  CHANGE_PASSWORD_ERROR,
  CHANGE_PASSWORD_REQUEST,
  CHANGE_PASSWORD_SUCCESS,
} from '../reducers/AuthReducer';
import { GET_USER_SUCCESS } from '../reducers/UserReducer';

const baseURL = process.env.REACT_APP_HAT_AROOTAH_API_BASE_URL;
async function signup({ email, password }) {
  return await Axios.post('/signup/', {
    email,
    password,
  });
}
function* handleSignup({ payload }) {
  try {
    const response = yield call(signup, payload);
    if (response) {
      yield put({
        type: SIGNUP_SUCCESS,
      });
    }
  } catch (error) {
    yield put({
      type: SIGNUP_ERROR,
      error: getSimplifiedError(error),
    });
  }
}

async function login({ email, password }) {
  return await Axios.post('/login/', {
    username: email,
    password,
  });
}

function* handleLogin({ payload }) {
  try {
    const response = yield call(login, payload);
    if (response.token) {
      const options = { path: '/' };
      Cookies.set('token', response.token, options);
      yield put({
        type: LOGIN_SUCCESS,
      });
      yield put({
        type: GET_USER_SUCCESS,
        data: response.user,
      });
    }
  } catch (error) {
    yield put({
      type: LOGIN_ERROR,
      error: getSimplifiedError(error),
    });
  }
}

async function googleLogin(payload) {
  return await Axios.post('/login/google/', payload);
}
function* handleGoogleLogin({ payload }) {
  try {
    const response = yield call(googleLogin, payload);
    if (response.key) {
      const options = { path: '/' };
      Cookies.set('token', response.key, options);
      yield put({
        type: GOOGLE_LOGIN_SUCCESS,
      });
    }
  } catch (error) {
    yield put({
      type: GOOGLE_LOGIN_ERROR,
      error: getSimplifiedError(error),
    });
  }
}

async function facebookLogin(payload) {
  return await Axios.post('/login/facebook/', payload);
}
function* handleFacebookLogin({ payload }) {
  try {
    const response = yield call(facebookLogin, payload);
    if (response.key) {
      const options = { path: '/' };
      Cookies.set('token', response.key, options);
      yield put({
        type: FACEBOOK_LOGIN_SUCCESS,
      });
    }
  } catch (error) {
    yield put({
      type: FACEBOOK_LOGIN_ERROR,
      error: getSimplifiedError(error),
    });
  }
}

async function appleLogin(payload) {
  return await Axios.post('/login/apple/', payload);
}
function* handleAppleLogin({ payload }) {
  try {
    const response = yield call(appleLogin, payload);
    if (response.key) {
      const options = { path: '/' };
      Cookies.set('token', response.key, options);
      yield put({
        type: APPLE_LOGIN_SUCCESS,
      });
    }
  } catch (error) {
    yield put({
      type: APPLE_LOGIN_ERROR,
      error: getSimplifiedError(error),
    });
  }
}

async function forgotPassword(payload) {
  const baseURL = process.env.REACT_APP_HAT_AROOTAH_API_BASE_URL;
  const url = baseURL.split('/api/v1/')[0];
  return axios.post(`${url}/rest-auth/password/reset/`, payload);
}
function* handleForgotPassword({ payload }) {
  try {
    const response = yield call(forgotPassword, payload);
    if (response) {
      yield put({
        type: FORGOT_PASSWORD_SUCCESS,
      });
    }
  } catch (error) {
    yield put({
      type: FORGOT_PASSWORD_ERROR,
      error: getSimplifiedError(error),
    });
  }
}

async function changePassword(payload) {
  const baseURL = process.env.REACT_APP_HAT_AROOTAH_API_BASE_URL;
  const url = baseURL.split('/api/v1/')[0];
  const token = Cookies.get('token');
  return axios.post(`${url}/rest-auth/password/change/`, payload, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });
}
function* handleResetPassword({ payload }) {
  try {
    const { status } = yield call(changePassword, payload);
    if (status === 200) {
      yield put({
        type: CHANGE_PASSWORD_SUCCESS,
      });
    }
  } catch (error) {
    yield put({
      type: CHANGE_PASSWORD_ERROR,
      error: getSimplifiedError(error),
    });
  }
}

export default all([
  takeLatest(SIGNUP_REQUEST, handleSignup),
  takeLatest(LOGIN_REQUEST, handleLogin),
  takeLatest(GOOGLE_LOGIN_REQUEST, handleGoogleLogin),
  takeLatest(FACEBOOK_LOGIN_REQUEST, handleFacebookLogin),
  takeLatest(APPLE_LOGIN_REQUEST, handleAppleLogin),
  takeLatest(FORGOT_PASSWORD_REQUEST, handleForgotPassword),
  takeLatest(CHANGE_PASSWORD_REQUEST, handleResetPassword),
]);
