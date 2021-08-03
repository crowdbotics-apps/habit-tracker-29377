import {
  GET_PREDEFINE_AREAS_LIST_REQUEST,
  GET_USER_INFO_REQUEST,
  GET_USER_AREAS_LIST_REQUEST,
  ADD_CATEGORY_REQUEST,
  ADD_SCORE_REQUEST,
  EDIT_SCORE_REQUEST,
  GET_ACTIVITY_JOURNAL_REQUEST,
  RESET_BLOCK_DASHBOARD,
  RESET_FLAGS_DASHBOARD,
  SET_SELECTED_WEEK,
  GET_QUOTE_REQUEST,
  EDIT_CATEGORY_REQUEST,
  DELETE_CATEGORY_REQUEST,
  ADD_SUBCATEGORY_REQUEST,
  EDIT_SUBCATEGORY_REQUEST,
  DELETE_SUBCATEGORY_REQUEST,
  ADD_HABIT_REQUEST,
  EDIT_HABIT_REQUEST,
  DELETE_HABIT_REQUEST,
  CHANGE_WEIGHT_REQUEST,
} from '../reducers/DashboardReducer';

export const getPredefineAreaList = (payload) => ({
  type: GET_PREDEFINE_AREAS_LIST_REQUEST,
  payload,
});

export const getUserInfo = (payload) => {
  return {
    type: GET_USER_INFO_REQUEST,
    payload,
  };
};
export const getAreasList = (payload = {}) => {
  return {
    type: GET_USER_AREAS_LIST_REQUEST,
    payload,
  };
};

export const addCategory = (payload) => ({
  type: ADD_CATEGORY_REQUEST,
  payload,
});

export const editCategory = (payload) => ({
  type: EDIT_CATEGORY_REQUEST,
  payload,
});

export const deleteCategory = (payload) => ({
  type: DELETE_CATEGORY_REQUEST,
  payload,
});

export const addSubcategory = (payload) => ({
  type: ADD_SUBCATEGORY_REQUEST,
  payload,
});

export const editSubcategory = (payload) => ({
  type: EDIT_SUBCATEGORY_REQUEST,
  payload,
});

export const deleteSubcategory = (payload) => ({
  type: DELETE_SUBCATEGORY_REQUEST,
  payload,
});

export const addHabit = (payload) => ({
  type: ADD_HABIT_REQUEST,
  payload,
});

export const editHabit = (payload) => ({
  type: EDIT_HABIT_REQUEST,
  payload,
});

export const deleteHabit = (payload) => ({
  type: DELETE_HABIT_REQUEST,
  payload,
});

export const addScore = (payload) => ({
  type: ADD_SCORE_REQUEST,
  payload,
});

export const editScore = (payload) => ({
  type: EDIT_SCORE_REQUEST,
  payload,
});

export const getActivityJournal = (payload) => ({
  type: GET_ACTIVITY_JOURNAL_REQUEST,
  payload,
});

export const setSelectedWeek = (payload) => ({
  type: SET_SELECTED_WEEK,
  payload,
});

export const changeWeight = (payload) => ({
  type: CHANGE_WEIGHT_REQUEST,
  payload,
});

export const getQuote = () => ({ type: GET_QUOTE_REQUEST });

export const resetBlockDashboard = (payload) => ({
  type: RESET_BLOCK_DASHBOARD,
  payload,
});

export const resetFlagsDashboard = (payload) => ({
  type: RESET_FLAGS_DASHBOARD,
  payload,
});
