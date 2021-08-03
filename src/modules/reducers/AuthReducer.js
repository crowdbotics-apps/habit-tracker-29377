import Cookies from 'js-cookie';

export const SIGNUP_REQUEST = 'SIGNUP_REQUEST';
export const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS';
export const SIGNUP_ERROR = 'SIGNUP_ERROR';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_ERROR = 'LOGIN_ERROR';

export const GOOGLE_LOGIN_REQUEST = 'GOOGLE_LOGIN_REQUEST';
export const GOOGLE_LOGIN_SUCCESS = 'GOOGLE_LOGIN_SUCCESS';
export const GOOGLE_LOGIN_ERROR = 'GOOGLE_LOGIN_ERROR';

export const FACEBOOK_LOGIN_REQUEST = 'FACEBOOK_LOGIN_REQUEST';
export const FACEBOOK_LOGIN_SUCCESS = 'FACEBOOK_LOGIN_SUCCESS';
export const FACEBOOK_LOGIN_ERROR = 'FACEBOOK_LOGIN_ERROR';

export const APPLE_LOGIN_REQUEST = 'APPLE_LOGIN_REQUEST';
export const APPLE_LOGIN_SUCCESS = 'APPLE_LOGIN_SUCCESS';
export const APPLE_LOGIN_ERROR = 'APPLE_LOGIN_ERROR';

export const FORGOT_PASSWORD_REQUEST = 'FORGOT_PASSWORD_REQUEST';
export const FORGOT_PASSWORD_SUCCESS = 'FORGOT_PASSWORD_SUCCESS';
export const FORGOT_PASSWORD_ERROR = 'FORGOT_PASSWORD_ERROR';

export const CHANGE_PASSWORD_REQUEST = 'CHANGE_PASSWORD_REQUEST';
export const CHANGE_PASSWORD_SUCCESS = 'CHANGE_PASSWORD_SUCCESS';
export const CHANGE_PASSWORD_ERROR = 'CHANGE_PASSWORD_ERROR';

export const LOGOUT = 'LOGOUT';

export const RESET_BLOCK_AUTH = 'RESET_BLOCK_AUTH';

const block = {
  loading: false,
  error: '',
  success: false,
};

const initialState = {
  signup: { ...block },
  login: { ...block },
  googleLogin: { ...block },
  facebookLogin: { ...block },
  appleLogin: { ...block },
  forgotPassword: { ...block },
  changePassword: { ...block },
  logout: { ...block },
};

export const AuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case SIGNUP_REQUEST:
      return { ...state, signup: { ...state.signup, loading: true } };
    case SIGNUP_SUCCESS:
      return {
        ...state,
        signup: { ...state.signup, loading: false, success: true },
      };
    case SIGNUP_ERROR:
      return {
        ...state,
        signup: { ...state.signup, loading: false, error: action.error },
      };

    case LOGIN_REQUEST:
      return { ...state, login: { ...state.login, loading: true } };
    case LOGIN_SUCCESS:
      return {
        ...state,
        login: { ...state.login, loading: false, success: true },
      };
    case LOGIN_ERROR:
      return {
        ...state,
        login: { ...state.login, loading: false, error: action.error },
      };

    case GOOGLE_LOGIN_REQUEST:
      return { ...state, googleLogin: { ...state.googleLogin, loading: true } };
    case GOOGLE_LOGIN_SUCCESS:
      return {
        ...state,
        googleLogin: { ...state.googleLogin, loading: false, success: true },
      };
    case GOOGLE_LOGIN_ERROR:
      return {
        ...state,
        googleLogin: {
          ...state.googleLogin,
          loading: false,
          error: action.error,
        },
      };

    case FACEBOOK_LOGIN_REQUEST:
      return {
        ...state,
        facebookLogin: { ...state.facebookLogin, loading: true },
      };
    case FACEBOOK_LOGIN_SUCCESS:
      return {
        ...state,
        facebookLogin: {
          ...state.facebookLogin,
          loading: false,
          success: true,
        },
      };
    case FACEBOOK_LOGIN_ERROR:
      return {
        ...state,
        facebookLogin: {
          ...state.facebookLogin,
          loading: false,
          error: action.error,
        },
      };

    case APPLE_LOGIN_REQUEST:
      return { ...state, appleLogin: { ...state.appleLogin, loading: true } };
    case APPLE_LOGIN_SUCCESS:
      return {
        ...state,
        appleLogin: { ...state.appleLogin, loading: false, success: true },
      };
    case APPLE_LOGIN_ERROR:
      return {
        ...state,
        appleLogin: {
          ...state.appleLogin,
          loading: false,
          error: action.error,
        },
      };

    case FORGOT_PASSWORD_REQUEST:
      return {
        ...state,
        forgotPassword: { ...state.forgotPassword, loading: true },
      };
    case FORGOT_PASSWORD_SUCCESS:
      return {
        ...state,
        forgotPassword: {
          ...state.forgotPassword,
          loading: false,
          success: true,
        },
      };
    case FORGOT_PASSWORD_ERROR:
      return {
        ...state,
        forgotPassword: {
          ...state.forgotPassword,
          loading: false,
          error: action.error,
        },
      };

    case CHANGE_PASSWORD_REQUEST:
      return {
        ...state,
        changePassword: { ...state.changePassword, loading: true },
      };
    case CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        changePassword: {
          ...state.changePassword,
          loading: false,
          success: true,
        },
      };
    case CHANGE_PASSWORD_ERROR:
      return {
        ...state,
        changePassword: {
          ...state.changePassword,
          loading: false,
          error: action.error,
        },
      };

    case LOGOUT:
      localStorage.clear();
      Cookies.remove('token', { path: '/' });
      return {
        ...initialState,
        logout: {
          success: true,
        },
      };

    case RESET_BLOCK_AUTH:
      return {
        ...state,
        [action.payload.blockType]: {
          ...state[action.payload.blockType],
          ...initialState[action.payload.blockType],
        },
      };

    default:
      return state;
  }
};
