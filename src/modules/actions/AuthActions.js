import {
  SIGNUP_REQUEST,
  FORGOT_PASSWORD_REQUEST,
  LOGIN_REQUEST,
  CHANGE_PASSWORD_REQUEST,
  GOOGLE_LOGIN_REQUEST,
  FACEBOOK_LOGIN_REQUEST,
  APPLE_LOGIN_REQUEST,
  RESET_BLOCK_AUTH,
  LOGOUT,
} from '../reducers/AuthReducer';

export const signup = (payload) => ({ type: SIGNUP_REQUEST, payload });

export const login = (payload) => ({ type: LOGIN_REQUEST, payload });

export const googleLogin = (payload) => ({
  type: GOOGLE_LOGIN_REQUEST,
  payload,
});

export const facebookLogin = (payload) => ({
  type: FACEBOOK_LOGIN_REQUEST,
  payload,
});

export const appleLogin = (payload) => ({
  type: APPLE_LOGIN_REQUEST,
  payload,
});

export const forgotPassword = (payload) => ({
  type: FORGOT_PASSWORD_REQUEST,
  payload,
});

export const changePassword = (payload) => ({
  type: CHANGE_PASSWORD_REQUEST,
  payload,
});

export const resetBlockAuth = (payload) => ({
  type: RESET_BLOCK_AUTH,
  payload,
});

export const logout = () => ({
  type: LOGOUT,
});
