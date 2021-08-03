import orderBy from 'lodash.orderby';
import moment from 'moment';
import {
  getDaysAverage,
  getPointsAverage,
  getDurationAverage,
  getAverageWeekdayAndWeekend,
  getAnalyticsCalculatedData,
} from '../../utils/analyticsCalculations';

import { months } from '../../utils/constants';

export const GET_AREAS_LIST_ANALYTICS_REQUEST =
  'GET_AREAS_LIST_ANALYTICS_REQUEST';
export const GET_AREAS_LIST_ANALYTICS_SUCCESS =
  'GET_AREAS_LIST_ANALYTICS_SUCCESS';
export const GET_AREAS_LIST_ANALYTICS_ERROR = 'GET_AREAS_LIST_ANALYTICS_ERROR';

export const GET_AREAS_LIST_FOR_RESULTS_COMPARE_REQUEST =
  'GET_AREAS_LIST_FOR_RESULTS_COMPARE_REQUEST';
export const GET_AREAS_LIST_FOR_RESULTS_COMPARE_SUCCESS =
  'GET_AREAS_LIST_FOR_RESULTS_COMPARE_SUCCESS';
export const GET_AREAS_LIST_FOR_RESULTS_COMPARE_ERROR =
  'GET_AREAS_LIST_FOR_RESULTS_COMPARE_ERROR';

export const SET_SELECTED_MONTHS = 'SET_SELECTED_MONTHS';
export const RESET_BLOCK_ANALYTICS = 'RESET_BLOCK_ANALYTICS';
export const RESET_FLAGS_ANALYTICS = 'RESET_FLAGS_ANALYTICS';

const block = {
  loading: false,
  error: '',
  success: false,
};

const initialState = {
  areasList: {
    ...block,
    type: null,
    data: [],
    analyticsTableData: [],
    analyticsSubHeaderData: [],
    analyticsResultsCurrentRangeData: [],
    analyticsResultsPreviousRangeData: [],
    analyticsChartData: [],
  },
  analyticsLoader: { loading: false, error: '', success: false },
  analyticsChartDataMonthRange: {},
  selectedMonths: {},
  selectedRangeForCompare: {},
  selectedPriod: {},
};

const getDynamicMonths = (monthsRange, calculationOfMonth) => {
  return monthsRange.map((m, i) => ({
    [months[m.month]]: calculationOfMonth[i],
  }));
};

export const AnalyticsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_AREAS_LIST_ANALYTICS_REQUEST:
      return {
        ...state,
        areasList: {
          ...state.areasList,
          type: action.payload.type,
          loading: true,
          showLoader: action.payload.showLoader && true,
        },
        analyticsChartDataMonthRange: action.payload.type !== 'statistics' && {
          from: action.payload.start,
          to: action.payload.end,
        },
      };
    case GET_AREAS_LIST_ANALYTICS_SUCCESS:
      const sortedData = orderBy(action.data, 'weight', 'desc');
      if (state.areasList.type === 'statistics') {
        let monthsRange = [];
        const dateStart = moment(state.selectedMonths.from);
        const dateEnd = moment(state.selectedMonths.to);
        while (
          dateEnd > dateStart ||
          dateStart.format('M') === dateEnd.format('M')
        ) {
          monthsRange.push({
            month: dateStart.format('M'),
            year: dateStart.format('YYYY'),
          });
          dateStart.add(1, 'month');
        }

        const calculatedWeekdays = getAverageWeekdayAndWeekend(
          sortedData,
          monthsRange,
          'weekday',
        );
        const calculatedWeekend = getAverageWeekdayAndWeekend(
          sortedData,
          monthsRange,
          'weekend',
        );
        const analyticsSubHeaderData = {
          weekAverage: {
            avg: getDaysAverage(sortedData, monthsRange),
            points: getPointsAverage(sortedData, monthsRange),
            duration: getDurationAverage(sortedData, monthsRange),
          },
          weekDayAverage: {
            avg: calculatedWeekdays.avg,
            points: calculatedWeekdays.points,
            duration: calculatedWeekdays.duration,
          },
          weekendAverage: {
            avg: calculatedWeekend.avg,
            points: calculatedWeekend.points,
            duration: calculatedWeekend.duration,
          },
        };

        const analyticsAreasData = sortedData.map((item) =>
          getAnalyticsCalculatedData(
            item,
            sortedData,
            monthsRange,
            getDynamicMonths,
          ),
        );
        return {
          ...state,
          areasList: {
            ...state.areasList,
            loading: false,
            success: true,
            showLoader: false,
            data: sortedData,
            analyticsTableData: analyticsAreasData,
            analyticsSubHeaderData: analyticsSubHeaderData,
          },
        };
      } else {
        return {
          ...state,
          areasList: {
            ...state.areasList,
            loading: false,
            success: true,
            analyticsChartData: sortedData,
          },
        };
      }

    case GET_AREAS_LIST_ANALYTICS_ERROR:
      return {
        ...state,
        areasList: { ...state.areasList, loading: false, error: action.error },
      };

    case GET_AREAS_LIST_FOR_RESULTS_COMPARE_REQUEST:
      return {
        ...state,
        analyticsLoader: {
          ...state.analyticsLoader,
          loading: true,
        },
        selectedRangeForCompare: action.payload.body,
        selectedPriod: action.payload.range,
      };

    case GET_AREAS_LIST_FOR_RESULTS_COMPARE_SUCCESS:
      const startRangSortedData = orderBy(action.data[0], 'weight', 'desc');
      const endRangSortedData = orderBy(action.data[1], 'weight', 'desc');
      let startMonthRangeList = [];
      let endMonthRangeList = [];

      const monthRangCalculator = (range, index) => {
        const { start, end } = range;
        const startDate = moment(new Date(start));
        const endDate = moment(new Date(end));
        while (
          endDate > startDate ||
          startDate.format('M') === endDate.format('M')
        ) {
          if (index === 0) {
            startMonthRangeList.push({
              month: startDate.format('M'),
              year: endDate.format('YYYY'),
            });
            startDate.add(1, 'month');
          } else {
            endMonthRangeList.push({
              month: startDate.format('M'),
              year: endDate.format('YYYY'),
            });
            startDate.add(1, 'month');
          }
        }
      };
      state.selectedRangeForCompare.map((i, index) =>
        monthRangCalculator(i, index),
      );
      const analyticsResultsCompareStartRangeData = startRangSortedData.map(
        (item) =>
          getAnalyticsCalculatedData(
            item,
            startRangSortedData,
            startMonthRangeList,
            getDynamicMonths,
          ),
      );
      const analyticsResultsCompareEndRangeData = endRangSortedData.map(
        (item) =>
          getAnalyticsCalculatedData(
            item,
            endRangSortedData,
            endMonthRangeList,
            getDynamicMonths,
          ),
      );

      return {
        ...state,
        areasList: {
          ...state.areasList,
          analyticsResultsCurrentRangeData:
            analyticsResultsCompareStartRangeData,
          analyticsResultsPreviousRangeData:
            analyticsResultsCompareEndRangeData,
        },
        analyticsLoader: {
          ...state.analyticsLoader,
          loading: false,
          success: true,
        },
      };

    case GET_AREAS_LIST_FOR_RESULTS_COMPARE_ERROR:
      return {
        ...state,
        analyticsLoader: {
          ...state.analyticsLoader,
          loading: false,
          error: action.error,
        },
      };

    case SET_SELECTED_MONTHS:
      return {
        ...state,
        selectedMonths: action.payload,
      };

    case RESET_BLOCK_ANALYTICS:
      return {
        ...state,
        [action.payload.blockType]: {
          ...state[action.payload.blockType],
          ...initialState[action.payload.blockType],
        },
      };

    case RESET_FLAGS_ANALYTICS:
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
