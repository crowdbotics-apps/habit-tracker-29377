import { all, call, put, takeLatest } from 'redux-saga/effects';

import { Axios } from '../../api/axios';
import { getSimplifiedError } from '../../utils/error';
import {
  GET_USER_INFO_REQUEST,
  GET_USER_INFO_SUCCESS,
  GET_USER_INFO_ERROR,
  GET_USER_AREAS_LIST_REQUEST,
  GET_USER_AREAS_LIST_SUCCESS,
  GET_USER_AREAS_LIST_ERROR,
  ADD_CATEGORY_REQUEST,
  ADD_CATEGORY_SUCCESS,
  ADD_CATEGORY_ERROR,
  EDIT_CATEGORY_REQUEST,
  EDIT_CATEGORY_SUCCESS,
  EDIT_CATEGORY_ERROR,
  DELETE_CATEGORY_REQUEST,
  DELETE_CATEGORY_SUCCESS,
  DELETE_CATEGORY_ERROR,
  ADD_SUBCATEGORY_REQUEST,
  ADD_SUBCATEGORY_SUCCESS,
  ADD_SUBCATEGORY_ERROR,
  EDIT_SUBCATEGORY_REQUEST,
  EDIT_SUBCATEGORY_SUCCESS,
  EDIT_SUBCATEGORY_ERROR,
  DELETE_SUBCATEGORY_REQUEST,
  DELETE_SUBCATEGORY_SUCCESS,
  DELETE_SUBCATEGORY_ERROR,
  ADD_HABIT_REQUEST,
  ADD_HABIT_SUCCESS,
  ADD_HABIT_ERROR,
  EDIT_HABIT_REQUEST,
  EDIT_HABIT_SUCCESS,
  EDIT_HABIT_ERROR,
  DELETE_HABIT_REQUEST,
  DELETE_HABIT_SUCCESS,
  DELETE_HABIT_ERROR,
  ADD_SCORE_REQUEST,
  ADD_SCORE_SUCCESS,
  ADD_SCORE_ERROR,
  EDIT_SCORE_REQUEST,
  EDIT_SCORE_SUCCESS,
  EDIT_SCORE_ERROR,
  GET_ACTIVITY_JOURNAL_REQUEST,
  GET_ACTIVITY_JOURNAL_SUCCESS,
  GET_ACTIVITY_JOURNAL_ERROR,
  RESET_FLAGS_DASHBOARD,
  GET_QUOTE_REQUEST,
  GET_QUOTE_SUCCESS,
  GET_QUOTE_ERROR,
  CHANGE_WEIGHT_SUCCESS,
  CHANGE_WEIGHT_ERROR,
  CHANGE_WEIGHT_REQUEST,
} from '../reducers/DashboardReducer';
import { getWeekRange } from '../../utils/utility';
import moment from 'moment';

const baseURL = process.env.REACT_APP_HAT_AROOTAH_API_BASE_URL;

async function getQuoteAPI() {
  // return await Axios.get('/quotes/');
}
function* handleGetQuote() {
  try {
    const response = yield call(getQuoteAPI);
    if (response) {
      yield put({
        type: GET_QUOTE_SUCCESS,
        data: response,
      });
    }
  } catch (error) {
    yield put({
      type: GET_QUOTE_ERROR,
      error: getSimplifiedError(error),
    });
  }
}

async function getUserInfoList({ start, end }) {
  const { from, to } = getWeekRange(new Date());
  const startDate = moment(from).format('YYYY-MM-DD');
  const endDate = moment(to).format('YYYY-MM-DD');
  return await Axios.get(
    `/userinfo/?start_date=${startDate}&end_date=${endDate}`,
  );
}

async function getArea() {
  const { from, to } = getWeekRange(new Date());
  const startDate = moment(from).format('YYYY-MM-DD');
  const endDate = moment(to).format('YYYY-MM-DD');
  return Axios.get(
    `${baseURL}area/?start_date=${startDate}&end_date=${endDate}`,
  );
}

function* handleGetUserInfoList({ payload = {} }) {
  try {
    yield call(getArea);
    const response = yield call(getUserInfoList, payload);
    if (response) {
      yield put({
        type: GET_USER_INFO_SUCCESS,
        data: response.results.userArea,
      });
      yield put({
        type: RESET_FLAGS_DASHBOARD,
        payload: { blockType: 'getUserInfoList' },
      });
    }
  } catch (error) {
    yield put({
      type: GET_USER_INFO_ERROR,
      error: getSimplifiedError(error),
    });
  }
}

async function getAreasList({ start, end }) {
  // return await Axios.get(`/area/get_selected/?start=${start}&end=${end}`);
}

function* handleGetAreasList({ payload = {} }) {
  try {
    const response = yield call(getAreasList, payload);
    if (response) {
      yield put({
        type: GET_USER_AREAS_LIST_SUCCESS,
        data: response.results.userArea,
      });
      yield put({
        type: RESET_FLAGS_DASHBOARD,
        payload: { blockType: 'areasList' },
      });
    }
  } catch (error) {
    yield put({
      type: GET_USER_AREAS_LIST_ERROR,
      error: getSimplifiedError(error),
    });
  }
}

async function addCategory(payload) {
  return await Axios.post('/customcategory/', payload);
}
function* handleAddCategory({ payload }) {
  try {
    const response = yield call(addCategory, payload);
    if (response) {
      yield put({
        type: ADD_CATEGORY_SUCCESS,
        data: response,
      });
      yield put({
        type: RESET_FLAGS_DASHBOARD,
        payload: { blockType: 'addCategory' },
      });
    }
  } catch (error) {
    yield put({
      type: ADD_CATEGORY_ERROR,
      error: getSimplifiedError(error),
    });
  }
}

async function editCategory(payload) {
  // return await Axios.put('/customcategory/', payload);
}
function* handleEditCategory({ payload }) {
  try {
    const response = yield call(editCategory, payload);
    if (response) {
      yield put({
        type: EDIT_CATEGORY_SUCCESS,
        data: response,
      });
      yield put({
        type: RESET_FLAGS_DASHBOARD,
        payload: { blockType: 'editCategory' },
      });
    }
  } catch (error) {
    yield put({
      type: EDIT_CATEGORY_ERROR,
      error: getSimplifiedError(error),
    });
  }
}

async function deleteCategory(payload) {
  // return await Axios.delete('/customcategory/', payload);
}
function* handleDeleteCategory({ payload }) {
  try {
    const response = yield call(deleteCategory, payload);
    if (response) {
      yield put({
        type: DELETE_CATEGORY_SUCCESS,
        data: response,
      });
      yield put({
        type: RESET_FLAGS_DASHBOARD,
        payload: { blockType: 'deleteCategory' },
      });
    }
  } catch (error) {
    yield put({
      type: DELETE_CATEGORY_ERROR,
      error: getSimplifiedError(error),
    });
  }
}

async function addSubcategory(payload) {
  return await Axios.post('/customsubcategory/', payload);
}
function* handleAddSubcategory({ payload }) {
  try {
    const response = yield call(addSubcategory, payload);
    if (response) {
      yield put({
        type: ADD_SUBCATEGORY_SUCCESS,
        data: response,
      });
      yield put({
        type: RESET_FLAGS_DASHBOARD,
        payload: { blockType: 'addSubcategory' },
      });
    }
  } catch (error) {
    yield put({
      type: ADD_SUBCATEGORY_ERROR,
      error: getSimplifiedError(error),
    });
  }
}

async function editSubcategory(payload) {
  // return await Axios.put('/customsubcategory/', payload);
}
function* handleEditSubcategory({ payload }) {
  try {
    const response = yield call(editSubcategory, payload);
    if (response) {
      yield put({
        type: EDIT_SUBCATEGORY_SUCCESS,
        data: response,
      });
      yield put({
        type: RESET_FLAGS_DASHBOARD,
        payload: { blockType: 'editSubcategory' },
      });
    }
  } catch (error) {
    yield put({
      type: EDIT_SUBCATEGORY_ERROR,
      error: getSimplifiedError(error),
    });
  }
}

async function deleteSubcategory(payload) {
  // return await Axios.delete('/customsubcategory/', payload);
}
function* handleDeleteSubcategory({ payload }) {
  try {
    const response = yield call(deleteSubcategory, payload);
    if (response) {
      yield put({
        type: DELETE_SUBCATEGORY_SUCCESS,
        data: response,
      });
      yield put({
        type: RESET_FLAGS_DASHBOARD,
        payload: { blockType: 'deleteSubcategory' },
      });
    }
  } catch (error) {
    yield put({
      type: DELETE_SUBCATEGORY_ERROR,
      error: getSimplifiedError(error),
    });
  }
}

async function addHabit(payload) {
  return await Axios.post('/userhabit/', payload);
}
function* handleAddHabit({ payload }) {
  try {
    const response = yield call(addHabit, payload);
    if (response) {
      yield put({
        type: ADD_HABIT_SUCCESS,
        data: response,
      });
      yield put({
        type: RESET_FLAGS_DASHBOARD,
        payload: { blockType: 'addHabit' },
      });
    }
  } catch (error) {
    yield put({
      type: ADD_HABIT_ERROR,
      error: getSimplifiedError(error),
    });
  }
}

async function editHabit(payload) {
  // return await Axios.put('/userhabit/', payload);
}
function* handleEditHabit({ payload }) {
  try {
    const response = yield call(editHabit, payload);
    if (response) {
      yield put({
        type: EDIT_HABIT_SUCCESS,
        data: response,
      });
      yield put({
        type: RESET_FLAGS_DASHBOARD,
        payload: { blockType: 'editHabit' },
      });
    }
  } catch (error) {
    yield put({
      type: EDIT_HABIT_ERROR,
      error: getSimplifiedError(error),
    });
  }
}

async function deleteHabit(payload) {
  // return await Axios.delete('/userhabit/', payload);
}
function* handleDeleteHabit({ payload }) {
  try {
    const response = yield call(deleteHabit, payload);
    if (response) {
      yield put({
        type: DELETE_HABIT_SUCCESS,
        data: response,
      });
      yield put({
        type: RESET_FLAGS_DASHBOARD,
        payload: { blockType: 'deleteHabit' },
      });
    }
  } catch (error) {
    yield put({
      type: DELETE_HABIT_ERROR,
      error: getSimplifiedError(error),
    });
  }
}

async function changeWeight(payload) {
  return await Axios.post('/user/update_weights/', payload);
}
function* handleChangeWeight({ payload }) {
  try {
    const response = yield call(changeWeight, payload);
    if (response) {
      yield put({
        type: CHANGE_WEIGHT_SUCCESS,
        response: response,
      });
      yield put({
        type: RESET_FLAGS_DASHBOARD,
        payload: { blockType: 'changeWeight' },
      });
    }
  } catch (error) {
    yield put({
      type: CHANGE_WEIGHT_ERROR,
      error: getSimplifiedError(error),
    });
  }
}

async function editScore({ id, value, journal }) {
  return await Axios.post('/category/update_score/', { id, value, journal });
}
function* handleEditScore({ payload }) {
  try {
    const response = yield call(editScore, payload.body);
    if (response) {
      yield put({
        type: EDIT_SCORE_SUCCESS,
        data: payload,
      });
      yield put({
        type: RESET_FLAGS_DASHBOARD,
        payload: { blockType: 'editScore' },
      });
    }
  } catch (error) {
    yield put({
      type: EDIT_SCORE_ERROR,
      error: getSimplifiedError(error),
    });
  }
}

async function addScore(payload) {
  return await Axios.post('/category/add_score/', payload);
}
function* handleAddScore({ payload }) {
  try {
    const response = yield call(addScore, payload.body);
    if (response) {
      yield put({
        type: ADD_SCORE_SUCCESS,
        response: response,
        payload: payload,
      });
      yield put({
        type: RESET_FLAGS_DASHBOARD,
        payload: { blockType: 'addScore' },
      });
    }
  } catch (error) {
    yield put({
      type: ADD_SCORE_ERROR,
      error: getSimplifiedError(error),
    });
  }
}

async function getActivityJournal({ start, end }) {
  return await Axios.get(`/area/get_journal/?start=${start}&end=${end}`);
}
function* handleGetActivityJournal({ payload }) {
  try {
    const response = yield call(getActivityJournal, payload);
    if (response) {
      yield put({
        type: GET_ACTIVITY_JOURNAL_SUCCESS,
        data: response,
      });
      yield put({
        type: RESET_FLAGS_DASHBOARD,
        payload: { blockType: 'getActivityJournal' },
      });
    }
  } catch (error) {
    yield put({
      type: GET_ACTIVITY_JOURNAL_ERROR,
      error: getSimplifiedError(error),
    });
  }
}

export default all([
  takeLatest(GET_QUOTE_REQUEST, handleGetQuote),
  // takeLatest(GET_USER_AREAS_LIST_REQUEST, handleGetAreasList),
  takeLatest(GET_USER_INFO_REQUEST, handleGetUserInfoList),
  takeLatest(ADD_CATEGORY_REQUEST, handleAddCategory),
  takeLatest(EDIT_CATEGORY_REQUEST, handleEditCategory),
  takeLatest(DELETE_CATEGORY_REQUEST, handleDeleteCategory),
  takeLatest(ADD_SUBCATEGORY_REQUEST, handleAddSubcategory),
  takeLatest(EDIT_SUBCATEGORY_REQUEST, handleEditSubcategory),
  takeLatest(DELETE_SUBCATEGORY_REQUEST, handleDeleteSubcategory),
  takeLatest(ADD_HABIT_REQUEST, handleAddHabit),
  takeLatest(EDIT_HABIT_REQUEST, handleEditHabit),
  takeLatest(DELETE_HABIT_REQUEST, handleDeleteHabit),
  takeLatest(EDIT_SCORE_REQUEST, handleEditScore),
  takeLatest(ADD_SCORE_REQUEST, handleAddScore),
  takeLatest(CHANGE_WEIGHT_REQUEST, handleChangeWeight),
  takeLatest(GET_ACTIVITY_JOURNAL_REQUEST, handleGetActivityJournal),
]);
