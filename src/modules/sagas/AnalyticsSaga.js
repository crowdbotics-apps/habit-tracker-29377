import { all, call, put, takeLatest } from 'redux-saga/effects';
import { Axios } from '../../api/axios';
import { getSimplifiedError } from '../../utils/error';
import {
  GET_AREAS_LIST_ANALYTICS_REQUEST,
  GET_AREAS_LIST_ANALYTICS_SUCCESS,
  GET_AREAS_LIST_ANALYTICS_ERROR,
  RESET_FLAGS_ANALYTICS,
  GET_AREAS_LIST_FOR_RESULTS_COMPARE_REQUEST,
  GET_AREAS_LIST_FOR_RESULTS_COMPARE_SUCCESS,
  GET_AREAS_LIST_FOR_RESULTS_COMPARE_ERROR,
} from '../reducers/AnalyticsReducer';

async function getAreasList({ start, end }) {
  return await Axios.get(`/area/get_selected/?start=${start}&end=${end}`);
}
function* handleGetAreasList({ payload }) {
  try {
    const response = yield call(getAreasList, payload);
    if (response) {
      yield put({
        type: GET_AREAS_LIST_ANALYTICS_SUCCESS,
        data: response,
      });
      yield put({
        type: RESET_FLAGS_ANALYTICS,
        payload: { blockType: 'areasList' },
      });
    }
  } catch (error) {
    yield put({
      type: GET_AREAS_LIST_ANALYTICS_ERROR,
      error: getSimplifiedError(error),
    });
  }
}

function* handleGetAreasListForCompare({ payload }) {
  try {
    const response = yield all(payload.body.map((t) => call(getAreasList, t)));
    if (response) {
      yield put({
        type: GET_AREAS_LIST_FOR_RESULTS_COMPARE_SUCCESS,
        data: response,
      });
      yield put({
        type: RESET_FLAGS_ANALYTICS,
        payload: { blockType: 'analyticsLoader' },
      });
    }
  } catch (error) {
    yield put({
      type: GET_AREAS_LIST_FOR_RESULTS_COMPARE_ERROR,
      error: getSimplifiedError(error),
    });
  }
}
export default all([
  // takeLatest(GET_AREAS_LIST_ANALYTICS_REQUEST, handleGetAreasList),
  // takeLatest(
  //   GET_AREAS_LIST_FOR_RESULTS_COMPARE_REQUEST,
  //   handleGetAreasListForCompare,
  // ),
]);
