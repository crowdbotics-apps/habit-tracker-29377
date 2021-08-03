import {
  GET_AREAS_LIST_ANALYTICS_REQUEST,
  SET_SELECTED_MONTHS,
  RESET_BLOCK_ANALYTICS,
  GET_AREAS_LIST_FOR_RESULTS_COMPARE_REQUEST,
} from '../reducers/AnalyticsReducer';

export const getAreasListForAnalytics = (payload) => ({
  type: GET_AREAS_LIST_ANALYTICS_REQUEST,
  payload,
});

export const getAreasListForCompareResults = (payload) => ({
  type: GET_AREAS_LIST_FOR_RESULTS_COMPARE_REQUEST,
  payload,
});

export const setSelectedMonthForAnalytics = (payload) => ({
  type: SET_SELECTED_MONTHS,
  payload,
});

export const resetBlockAnalytics = (payload) => ({
  type: RESET_BLOCK_ANALYTICS,
  payload,
});
