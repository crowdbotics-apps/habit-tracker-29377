export const GET_USER_REQUEST = 'GET_USER_REQUEST';
export const GET_USER_SUCCESS = 'GET_USER_SUCCESS';
export const GET_USER_ERROR = 'GET_USER_ERROR';

export const SET_USER_PROFILE_PICTURE_REQUEST =
  'SET_USER_PROFILE_PICTURE_REQUEST';
export const SET_USER_PROFILE_PICTURE_SUCCESS =
  'SET_USER_PROFILE_PICTURE_SUCCESS';
export const SET_USER_PROFILE_PICTURE_ERROR = 'SET_USER_PROFILE_PICTURE_ERROR';

export const UPDATE_USER_PROFILE_REQUEST = 'UPDATE_USER_PROFILE_REQUEST';
export const UPDATE_USER_PROFILE_SUCCESS = 'UPDATE_USER_PROFILE_SUCCESS';
export const UPDATE_USER_PROFILE_ERROR = 'UPDATE_USER_PROFILE_ERROR';

export const UPDATE_SETTINGS_REQUEST = 'UPDATE_SETTINGS_REQUEST';
export const UPDATE_SETTINGS_SUCCESS = 'UPDATE_SETTINGS_SUCCESS';
export const UPDATE_SETTINGS_ERROR = 'UPDATE_SETTINGS_ERROR';

export const GET_ALL_USERS_LIST_REQUEST = 'GET_ALL_USERS_LIST_REQUEST';
export const GET_ALL_USERS_LIST_SUCCESS = 'GET_ALL_USERS_LIST_SUCCESS';
export const GET_ALL_USERS_LIST_ERROR = 'GET_ALL_USERS_LIST_ERROR';

export const ASSIGN_COACHS_REQUEST = 'ASSIGN_COACHS_REQUEST';
export const ASSIGN_COACHS_SUCCESS = 'ASSIGN_COACHS_SUCCESS';
export const ASSIGN_COACHS_ERROR = 'ASSIGN_COACHS_ERROR';

export const ASSIGN_USERS_REQUEST = 'ASSIGN_USERS_REQUEST';
export const ASSIGN_USERS_SUCCESS = 'ASSIGN_USERS_SUCCESS';
export const ASSIGN_USERS_ERROR = 'ASSIGN_USERS_ERROR';

export const GET_SPECIFIC_USER_REQUEST = 'GET_SPECIFIC_USER_REQUEST';
export const GET_SPECIFIC_USER_SUCCESS = 'GET_SPECIFIC_USER_SUCCESS';
export const GET_SPECIFIC_USER_ERROR = 'GET_SPECIFIC_USER_ERROR';

export const UPDATE_SPECIFIC_USER_REQUEST = 'UPDATE_SPECIFIC_USER_REQUEST';
export const UPDATE_SPECIFIC_USER_SUCCESS = 'UPDATE_SPECIFIC_USER_SUCCESS';
export const UPDATE_SPECIFIC_USER_ERROR = 'UPDATE_SPECIFIC_USER_ERROR';

export const TOGGLE_USER_TYPE_REQUEST = 'TOGGLE_USER_TYPE_REQUEST';
export const TOGGLE_USER_TYPE_SUCCESS = 'TOGGLE_USER_TYPE_SUCCESS';
export const TOGGLE_USER_TYPE_ERROR = 'TOGGLE_USER_TYPE_ERROR';

export const SET_SELECTED_USER = 'SET_SELECTED_USER';

export const SET_PAGE_INDEX = 'SET_PAGE_INDEX';

export const SET_USER_QUERY = 'SET_USER_QUERY';

export const RESET_FLAGS_USERS = 'RESET_FLAGS_USERS';

const block = {
  loading: false,
  error: '',
  success: false,
};

const initialState = {
  userData: { ...block, data: {} },
  profilePicture: { ...block },
  userProfile: { ...block, data: {} },
  getSpecificUser: { ...block, data: {} },
  updateSpecificUser: { ...block },
  settings: { ...block, data: {} },
  allUsersList: {
    ...block,
    data: {},
    adminData: {},
    normalUsers: [],
    coachUsers: [],
  },
  usersCoaches: { ...block, data: [] },
  coachsUsers: { ...block, data: [] },
  assignCoachToUser: { ...block },
  assignUserToCoach: { ...block },
  toggleUserType: { ...block },
  selectedUser: {},
  pageIndex: 1,
  userQuery: '',
};

export const UserReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USER_REQUEST:
      return { ...state, userData: { ...state.userData, loading: true } };
    case GET_USER_SUCCESS:
      return {
        ...state,
        userData: {
          ...state.userData,
          loading: false,
          success: true,
          data: action.data,
        },
      };
    case GET_USER_ERROR:
      return {
        ...state,
        userData: { ...state.userData, loading: false, error: action.error },
      };

    case SET_USER_PROFILE_PICTURE_REQUEST:
      return {
        ...state,
        profilePicture: { ...state.profilePicture, loading: true },
      };
    case SET_USER_PROFILE_PICTURE_SUCCESS:
      return {
        ...state,
        userData: {
          ...state.userData,
          loading: false,
          success: true,
          data: action.data,
        },
      };
    case SET_USER_PROFILE_PICTURE_ERROR:
      return {
        ...state,
        profilePicture: {
          ...state.profilePicture,
          loading: false,
          error: action.error,
        },
      };

    case UPDATE_USER_PROFILE_REQUEST:
      return { ...state, userData: { ...state.userData, loading: true } };
    case UPDATE_USER_PROFILE_SUCCESS:
      return {
        ...state,
        userData: {
          ...state.userData,
          loading: false,
          success: true,
          data: action.data,
        },
      };
    case UPDATE_USER_PROFILE_ERROR:
      return {
        ...state,
        userData: {
          ...state.userData,
          loading: false,
          error: action.error,
        },
      };

    case UPDATE_SETTINGS_REQUEST:
      return { ...state, userData: { ...state.userData, loading: true } };
    case UPDATE_SETTINGS_SUCCESS:
      return {
        ...state,
        userData: {
          ...state.userData,
          loading: false,
          success: true,
          data: action.data,
        },
      };
    case UPDATE_SETTINGS_ERROR:
      return {
        ...state,
        userData: {
          ...state.userData,
          loading: false,
          error: action.error,
        },
      };

    case GET_ALL_USERS_LIST_REQUEST:
      return {
        ...state,
        allUsersList: { ...state.allUsersList, loading: true },
      };
    case GET_ALL_USERS_LIST_SUCCESS:
      const exceptAdminUsers = action.data.results.filter(
        (user) => !user.is_superuser,
      );
      const normal = exceptAdminUsers.filter((user) => !user.is_coach);
      const coach = exceptAdminUsers.filter((user) => user.is_coach);
      const adminResults = exceptAdminUsers.map((user) => ({
        ...user,
        points: 1720,
        tracked_habits: 1,
        good_habits: 12,
        bad_habits: 37,
        habits_avg_score: 85,
      }));
      return {
        ...state,
        allUsersList: {
          ...state.allUsersList,
          loading: false,
          success: true,
          data: { ...action.data, results: exceptAdminUsers },
          adminData: { ...action.data, results: adminResults },
          normalUsers: normal,
          coachUsers: coach,
        },
      };
    case GET_ALL_USERS_LIST_ERROR:
      return {
        ...state,
        allUsersList: {
          ...state.allUsersList,
          loading: false,
          error: action.error,
        },
      };

    case ASSIGN_COACHS_REQUEST:
      return {
        ...state,
        assignCoachToUser: { ...state.assignCoachToUser, loading: true },
      };
    case ASSIGN_COACHS_SUCCESS:
      if (action.from) {
        const prevAdminData = state.allUsersList.adminData.results;
        const foundedIndex = prevAdminData.findIndex(
          (user) => user.id === action.data.id,
        );
        state.allUsersList.adminData.results[foundedIndex] = {
          ...prevAdminData[foundedIndex],
          ...action.data,
        };
        return {
          ...state,
          assignCoachToUser: {
            ...state.assignCoachToUser,
            loading: false,
            success: true,
          },
        };
      }
      return {
        ...state,
        assignCoachToUser: {
          ...state.assignCoachToUser,
          loading: false,
          success: true,
        },
        userData: {
          ...state.userData,
          data: action.data,
        },
      };
    case ASSIGN_COACHS_ERROR:
      return {
        ...state,
        assignCoachToUser: {
          ...state.assignCoachToUser,
          loading: false,
          error: action.error,
        },
      };

    case ASSIGN_USERS_REQUEST:
      return {
        ...state,
        assignUserToCoach: { ...state.assignUserToCoach, loading: true },
      };
    case ASSIGN_USERS_SUCCESS:
      return {
        ...state,
        assignUserToCoach: {
          ...state.assignUserToCoach,
          loading: false,
          success: true,
        },
        userData: {
          ...state.userData,
          data: action.data,
        },
      };
    case ASSIGN_USERS_ERROR:
      return {
        ...state,
        assignUserToCoach: {
          ...state.assignUserToCoach,
          loading: false,
          error: action.error,
        },
      };

    case TOGGLE_USER_TYPE_REQUEST:
      return {
        ...state,
        toggleUserType: { ...state.toggleUserType, loading: true },
      };
    case TOGGLE_USER_TYPE_SUCCESS:
      const oldAdminData = state.allUsersList.adminData.results;
      const index = oldAdminData.findIndex(
        (user) => user.id === action.data.id,
      );
      state.allUsersList.adminData.results[index] = {
        ...oldAdminData[index],
        ...action.data,
      };
      return {
        ...state,
        toggleUserType: {
          ...state.toggleUserType,
          loading: false,
          success: true,
        },
        selectedUser: action.data,
      };
    case TOGGLE_USER_TYPE_ERROR:
      return {
        ...state,
        toggleUserType: {
          ...state.toggleUserType,
          loading: false,
          error: action.error,
        },
      };

    case GET_SPECIFIC_USER_REQUEST:
      return {
        ...state,
        getSpecificUser: { ...state.getSpecificUser, loading: true },
      };
    case GET_SPECIFIC_USER_SUCCESS:
      return {
        ...state,
        getSpecificUser: {
          ...state.getSpecificUser,
          loading: false,
          success: true,
          data: action.data,
        },
      };
    case GET_SPECIFIC_USER_ERROR:
      return {
        ...state,
        getSpecificUser: {
          ...state.getSpecificUser,
          loading: false,
          error: action.error,
        },
      };

    case UPDATE_SPECIFIC_USER_REQUEST:
      return {
        ...state,
        updateSpecificUser: { ...state.updateSpecificUser, loading: true },
      };
    case UPDATE_SPECIFIC_USER_SUCCESS:
      const prevAdminData = state.allUsersList.adminData.results;
      const foundedIndex = prevAdminData.findIndex(
        (user) => user.id === action.data.id,
      );
      state.allUsersList.adminData.results[foundedIndex] = {
        ...prevAdminData[foundedIndex],
        ...action.data,
      };
      return {
        ...state,
        updateSpecificUser: {
          ...state.updateSpecificUser,
          loading: false,
          success: true,
        },
        selectedUser: action.data,
      };
    case UPDATE_SPECIFIC_USER_ERROR:
      return {
        ...state,
        updateSpecificUser: {
          ...state.updateSpecificUser,
          loading: false,
          error: action.error,
        },
      };

    case SET_SELECTED_USER:
      return {
        ...state,
        selectedUser: action.payload,
      };

    case SET_PAGE_INDEX:
      return {
        ...state,
        pageIndex: action.page,
      };

    case SET_USER_QUERY:
      return {
        ...state,
        userQuery: action.query,
      };

    case RESET_FLAGS_USERS:
      return {
        ...state,
        [action.payload.blockType]: {
          ...state[action.payload.blockType],
          ...block,
        },
      };

    default:
      return state;
  }
};
