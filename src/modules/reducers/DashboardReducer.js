import orderBy from 'lodash.orderby';
import { v4 as uuidv4 } from 'uuid';

import {
  getAreaCalculatedData,
  todayAreasDataChecker,
  getDaysAverage,
  getAverageOfPoints,
  getPointsAverage,
  getDurationAverage,
} from '../../utils/utility';
import { days, weekDays, weekendDays } from '../../utils/constants';
export const GET_QUOTE_REQUEST = 'GET_QUOTE_REQUEST';
export const GET_QUOTE_SUCCESS = 'GET_QUOTE_SUCCESS';
export const GET_QUOTE_ERROR = 'GET_QUOTE_ERROR';

export const GET_PREDEFINE_AREAS_LIST_REQUEST =
  'GET_PREDEFINE_AREAS_LIST_REQUEST';
export const GET_PREDEFINE_AREAS_LIST_SUCCESS =
  'GET_PREDEFINE_AREAS_LIST_SUCCESS';
export const GET_PREDEFINE_AREAS_LIST_ERROR = 'GET_PREDEFINE_AREAS_LIST_ERROR';

export const GET_USER_INFO_REQUEST = 'GET_USER_INFO_REQUEST';
export const GET_USER_INFO_SUCCESS = 'GET_USER_INFO_SUCCESS';
export const GET_USER_INFO_ERROR = 'GET_USER_INFO_ERROR';

export const GET_USER_AREAS_LIST_REQUEST = 'GET_USER_AREAS_LIST_REQUEST';
export const GET_USER_AREAS_LIST_SUCCESS = 'GET_USER_AREAS_LIST_SUCCESS';
export const GET_USER_AREAS_LIST_ERROR = 'GET_USER_AREAS_LIST_ERROR';

export const CHANGE_WEIGHT_REQUEST = 'CHANGE_WEIGHT_REQUEST';
export const CHANGE_WEIGHT_SUCCESS = 'CHANGE_WEIGHT_SUCCESS';
export const CHANGE_WEIGHT_ERROR = 'CHANGE_WEIGHT_ERROR';

export const ADD_CATEGORY_REQUEST = 'ADD_CATEGORY_REQUEST';
export const ADD_CATEGORY_SUCCESS = 'ADD_CATEGORY_SUCCESS';
export const ADD_CATEGORY_ERROR = 'ADD_CATEGORY_ERROR';

export const EDIT_CATEGORY_REQUEST = 'EDIT_CATEGORY_REQUEST';
export const EDIT_CATEGORY_SUCCESS = 'EDIT_CATEGORY_SUCCESS';
export const EDIT_CATEGORY_ERROR = 'EDIT_CATEGORY_ERROR';

export const DELETE_CATEGORY_REQUEST = 'DELETE_CATEGORY_REQUEST';
export const DELETE_CATEGORY_SUCCESS = 'DELETE_CATEGORY_SUCCESS';
export const DELETE_CATEGORY_ERROR = 'DELETE_CATEGORY_ERROR';

export const ADD_SUBCATEGORY_REQUEST = 'ADD_SUBCATEGORY_REQUEST';
export const ADD_SUBCATEGORY_SUCCESS = 'ADD_SUBCATEGORY_SUCCESS';
export const ADD_SUBCATEGORY_ERROR = 'ADD_SUBCATEGORY_ERROR';

export const EDIT_SUBCATEGORY_REQUEST = 'EDIT_SUBCATEGORY_REQUEST';
export const EDIT_SUBCATEGORY_SUCCESS = 'EDIT_SUBCATEGORY_SUCCESS';
export const EDIT_SUBCATEGORY_ERROR = 'EDIT_SUBCATEGORY_ERROR';

export const DELETE_SUBCATEGORY_REQUEST = 'DELETE_SUBCATEGORY_REQUEST';
export const DELETE_SUBCATEGORY_SUCCESS = 'DELETE_SUBCATEGORY_SUCCESS';
export const DELETE_SUBCATEGORY_ERROR = 'DELETE_SUBCATEGORY_ERROR';

export const ADD_HABIT_REQUEST = 'ADD_HABIT_REQUEST';
export const ADD_HABIT_SUCCESS = 'ADD_HABIT_SUCCESS';
export const ADD_HABIT_ERROR = 'ADD_HABIT_ERROR';

export const EDIT_HABIT_REQUEST = 'EDIT_HABIT_REQUEST';
export const EDIT_HABIT_SUCCESS = 'EDIT_HABIT_SUCCESS';
export const EDIT_HABIT_ERROR = 'EDIT_HABIT_ERROR';

export const DELETE_HABIT_REQUEST = 'DELETE_HABIT_REQUEST';
export const DELETE_HABIT_SUCCESS = 'DELETE_HABIT_SUCCESS';
export const DELETE_HABIT_ERROR = 'DELETE_HABIT_ERROR';

export const ADD_SCORE_REQUEST = 'ADD_SCORE_REQUEST';
export const ADD_SCORE_SUCCESS = 'ADD_SCORE_SUCCESS';
export const ADD_SCORE_ERROR = 'ADD_SCORE_ERROR';

export const EDIT_SCORE_REQUEST = 'EDIT_SCORE_REQUEST';
export const EDIT_SCORE_SUCCESS = 'EDIT_SCORE_SUCCESS';
export const EDIT_SCORE_ERROR = 'EDIT_SCORE_ERROR';

export const GET_ACTIVITY_JOURNAL_REQUEST = 'GET_ACTIVITY_JOURNAL_REQUEST';
export const GET_ACTIVITY_JOURNAL_SUCCESS = 'GET_ACTIVITY_JOURNAL_SUCCESS';
export const GET_ACTIVITY_JOURNAL_ERROR = 'GET_ACTIVITY_JOURNAL_ERROR';

export const SET_SELECTED_WEEK = 'SET_SELECTED_WEEK';

export const RESET_BLOCK_DASHBOARD = 'RESET_BLOCK_DASHBOARD';

export const RESET_FLAGS_DASHBOARD = 'RESET_FLAGS_DASHBOARD';

const block = {
  loading: false,
  error: '',
  success: false,
};

const initialState = {
  todayAreasList: { ...block, data: [] },
  predefineAreasList: { ...block, data: [] },
  areasList: { ...block, data: [], dashboardTableData: [], subHeaderData: [] },
  getUserInfoList: { ...block, data: [] },
  addCategory: { ...block },
  editCategory: { ...block },
  deletCategory: { ...block },
  addSubcategory: { ...block },
  editSubcategory: { ...block },
  deletSubcategory: { ...block },
  addHabit: { ...block },
  editHabit: { ...block },
  deletHabit: { ...block },
  changeWeight: { ...block },
  addScore: { ...block },
  editScore: { ...block },
  getActivityJournal: { ...block },
  getQuote: { ...block, data: [] },
  selectedWeek: [],
};

export const DashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PREDEFINE_AREAS_LIST_REQUEST:
      return {
        ...state,
        predefineAreasList: {
          ...state.predefineAreasList,
          loading: true,
        },
      };
    case GET_PREDEFINE_AREAS_LIST_SUCCESS:
      return {
        ...state,
        predefineAreasList: {
          ...state.predefineAreasList,
          loading: false,
          success: true,
          showLoader: false,
          data: action.data,
        },
      };
    case GET_PREDEFINE_AREAS_LIST_ERROR:
      return {
        ...state,
        predefineAreasList: {
          ...state.predefineAreasList,
          loading: false,
          error: action.error,
        },
      };

    case GET_USER_INFO_REQUEST:
      return {
        ...state,
        getUserInfoList: {
          ...state.getUserInfoList,
          loading: true,
        },
      };
    case GET_USER_INFO_SUCCESS:
      let { data } = action;
      data = orderBy(data, 'weight', 'desc');
      data = data.map((area) => {
        let { userCategories = [] } = area;
        if (userCategories.length > 0) {
          userCategories = orderBy(userCategories, 'weight', 'desc');
          userCategories = userCategories.map((category) => {
            let { userSubCategories = [] } = category;
            if (userSubCategories.length > 0) {
              userSubCategories = orderBy(userSubCategories, 'weight', 'desc');
              userSubCategories = userSubCategories.map((subCategory) => {
                let { userHabits = [] } = subCategory;
                if (userHabits.length > 0) {
                  userHabits = orderBy(userHabits, 'weight', 'desc');
                }
                subCategory.userHabits = userHabits;
                return subCategory;
              });
            }
            category.userSubCategories = userSubCategories;
            return category;
          });
        }
        area.userCategories = userCategories;
        return area;
      });
      return {
        ...state,
        getUserInfoList: {
          ...state.getUserInfoList,
          loading: false,
          success: true,
          showLoader: false,
          data,
        },
      };
    case GET_USER_INFO_ERROR:
      return {
        ...state,
        getUserInfoList: {
          ...state.getUserInfoList,
          loading: false,
          error: action.error,
        },
      };

    case GET_USER_AREAS_LIST_REQUEST:
      return {
        ...state,
        areasList: {
          ...state.areasList,
          loading: true,
          showLoader: action.payload.showLoader && true,
        },
      };
    case GET_USER_AREAS_LIST_SUCCESS:
      const sortedData = orderBy(action.data, 'weight', 'desc');

      const dashboardAreasData = sortedData.map((item) =>
        getAreaCalculatedData(item, sortedData, state.selectedWeek),
      );
      const subHeaderData = {
        headerPoints: getAverageOfPoints(sortedData),
        weekAverage: {
          avg: getDaysAverage(sortedData, days, state.selectedWeek),
          points: getPointsAverage(sortedData, days, state.selectedWeek),
          duration: getDurationAverage(sortedData, days, state.selectedWeek),
        },
        weekDayAverage: {
          avg: getDaysAverage(sortedData, weekDays, state.selectedWeek),
          points: getPointsAverage(sortedData, weekDays, state.selectedWeek),
          duration: getDurationAverage(
            sortedData,
            weekDays,
            state.selectedWeek,
          ),
        },
        weekendAverage: {
          avg: getDaysAverage(sortedData, weekendDays, state.selectedWeek),
          points: getPointsAverage(sortedData, weekendDays, state.selectedWeek),
          duration: getDurationAverage(
            sortedData,
            weekendDays,
            state.selectedWeek,
          ),
        },
      };

      const todayAreasData = todayAreasDataChecker(sortedData);

      if (todayAreasData) {
        return {
          ...state,
          todayAreasList: {
            ...state.todayAreasList,
            loading: false,
            success: true,
            data: sortedData,
          },
          areasList: {
            ...state.areasList,
            loading: false,
            success: true,
            data: sortedData,
            dashboardTableData: dashboardAreasData,
            subHeaderData,
          },
        };
      }
      return {
        ...state,
        areasList: {
          ...state.areasList,
          loading: false,
          success: true,
          showLoader: false,
          data: sortedData,
          dashboardTableData: dashboardAreasData,
          subHeaderData,
        },
      };
    case GET_USER_AREAS_LIST_ERROR:
      return {
        ...state,
        areasList: { ...state.areasList, loading: false, error: action.error },
      };

    case ADD_CATEGORY_REQUEST:
      return {
        ...state,
        addCategory: { ...state.addCategory, loading: true },
      };
    case ADD_CATEGORY_SUCCESS:
      return {
        ...state,
        addCategory: {
          ...state.addCategory,
          loading: false,
          success: true,
        },
      };
    case ADD_CATEGORY_ERROR:
      return {
        ...state,
        addCategory: {
          ...state.addCategory,
          loading: false,
          error: action.error,
        },
      };

    case EDIT_CATEGORY_REQUEST:
      return {
        ...state,
        editCategory: { ...state.editCategory, loading: true },
      };
    case EDIT_CATEGORY_SUCCESS:
      return {
        ...state,
        editCategory: {
          ...state.editCategory,
          loading: false,
          success: true,
        },
      };
    case EDIT_CATEGORY_ERROR:
      return {
        ...state,
        editCategory: {
          ...state.editCategory,
          loading: false,
          error: action.error,
        },
      };

    case DELETE_CATEGORY_REQUEST:
      return {
        ...state,
        deletCategory: { ...state.deletCategory, loading: true },
      };
    case DELETE_CATEGORY_SUCCESS:
      return {
        ...state,
        deletCategory: {
          ...state.deletCategory,
          loading: false,
          success: true,
        },
      };
    case DELETE_CATEGORY_ERROR:
      return {
        ...state,
        deletCategory: {
          ...state.deletCategory,
          loading: false,
          error: action.error,
        },
      };

    case ADD_SUBCATEGORY_REQUEST:
      return {
        ...state,
        addSubcategory: { ...state.addSubcategory, loading: true },
      };
    case ADD_SUBCATEGORY_SUCCESS:
      return {
        ...state,
        addSubcategory: {
          ...state.addSubcategory,
          loading: false,
          success: true,
        },
      };
    case ADD_SUBCATEGORY_ERROR:
      return {
        ...state,
        addSubcategory: {
          ...state.addSubcategory,
          loading: false,
          error: action.error,
        },
      };

    case EDIT_SUBCATEGORY_REQUEST:
      return {
        ...state,
        editSubcategory: { ...state.editSubcategory, loading: true },
      };
    case EDIT_SUBCATEGORY_SUCCESS:
      return {
        ...state,
        editSubcategory: {
          ...state.editSubcategory,
          loading: false,
          success: true,
        },
      };
    case EDIT_SUBCATEGORY_ERROR:
      return {
        ...state,
        editSubcategory: {
          ...state.editSubcategory,
          loading: false,
          error: action.error,
        },
      };

    case DELETE_SUBCATEGORY_REQUEST:
      return {
        ...state,
        deletSubcategory: { ...state.deletSubcategory, loading: true },
      };
    case DELETE_SUBCATEGORY_SUCCESS:
      return {
        ...state,
        deletSubcategory: {
          ...state.deletSubcategory,
          loading: false,
          success: true,
        },
      };
    case DELETE_SUBCATEGORY_ERROR:
      return {
        ...state,
        deletSubcategory: {
          ...state.deletSubcategory,
          loading: false,
          error: action.error,
        },
      };

    case ADD_HABIT_REQUEST:
      return {
        ...state,
        addHabit: { ...state.addHabit, loading: true },
      };
    case ADD_HABIT_SUCCESS:
      return {
        ...state,
        addHabit: {
          ...state.addHabit,
          loading: false,
          success: true,
        },
      };
    case ADD_HABIT_ERROR:
      return {
        ...state,
        addHabit: {
          ...state.addHabit,
          loading: false,
          error: action.error,
        },
      };

    case EDIT_HABIT_REQUEST:
      return {
        ...state,
        editHabit: { ...state.editHabit, loading: true },
      };
    case EDIT_HABIT_SUCCESS:
      return {
        ...state,
        editHabit: {
          ...state.editHabit,
          loading: false,
          success: true,
        },
      };
    case EDIT_HABIT_ERROR:
      return {
        ...state,
        editHabit: {
          ...state.editHabit,
          loading: false,
          error: action.error,
        },
      };

    case DELETE_HABIT_REQUEST:
      return {
        ...state,
        deletHabit: { ...state.deletHabit, loading: true },
      };
    case DELETE_HABIT_SUCCESS:
      return {
        ...state,
        deletHabit: {
          ...state.deletHabit,
          loading: false,
          success: true,
        },
      };
    case DELETE_HABIT_ERROR:
      return {
        ...state,
        deletHabit: {
          ...state.deletHabit,
          loading: false,
          error: action.error,
        },
      };

    case CHANGE_WEIGHT_REQUEST:
      return {
        ...state,
        changeWeight: { ...state.changeWeight, loading: true },
      };
    case CHANGE_WEIGHT_SUCCESS:
      return {
        ...state,
        changeWeight: {
          ...state.changeWeight,
          loading: false,
          success: true,
        },
      };
    case CHANGE_WEIGHT_ERROR:
      return {
        ...state,
        changeWeight: {
          ...state.changeWeight,
          loading: false,
          error: action.error,
        },
      };

    case ADD_SCORE_REQUEST:
      const { body: addScoreBody, type: addScoreType } = action.payload;
      let addWeightArea = state.areasList.data.find(
        (area) => area.id === addScoreBody.area,
      );
      addWeightArea.isExpanded = !!addScoreType;
      let addWeightAreaIndex = state.areasList.data.findIndex(
        (area) => area.id === addScoreBody.area,
      );
      let addWeightCategory = addWeightArea.categories.find(
        (c) => c.id === addScoreBody.category,
      );
      let addWeightCategoryIndex = addWeightArea.categories.findIndex(
        (c) => c.id === addScoreBody.category,
      );
      addScoreBody.id = uuidv4();
      addWeightCategory.scores.push(addScoreBody);
      addWeightArea.categories[addWeightCategoryIndex] = addWeightCategory;
      state.areasList.data[addWeightAreaIndex] = addWeightArea;
      state.areasList.dashboardTableData[addWeightAreaIndex] =
        getAreaCalculatedData(
          addWeightArea,
          state.areasList.data,
          state.selectedWeek,
        );
      return {
        ...state,
        addScore: { ...state.addScore, loading: true },
      };
    case ADD_SCORE_SUCCESS:
      let addScoreArea = state.areasList.data.find(
        (area) => area.id === action.payload.body.area,
      );
      addScoreArea.isExpanded = !!action.payload.type;
      let addScoreAreaIndex = state.areasList.data.findIndex(
        (area) => area.id === action.payload.body.area,
      );
      let addScoreCategory = addScoreArea.categories.find(
        (c) => c.id === action.payload.body.category,
      );
      let addScoreCategoryIndex = addScoreArea.categories.findIndex(
        (c) => c.id === action.payload.body.category,
      );
      let scoreIndex = addScoreCategory.scores.findIndex(
        (s) => s.id === action.payload.body.id,
      );
      delete action.payload.body.area;
      delete action.payload.body.category;
      addScoreCategory.scores[scoreIndex] = {
        ...action.payload.body,
        id: action.response.id,
        date_time: action.response.date_time,
      };
      addScoreArea.categories[addScoreCategoryIndex] = addScoreCategory;
      state.areasList.data[addScoreAreaIndex] = addScoreArea;
      state.areasList.dashboardTableData[addScoreAreaIndex] =
        getAreaCalculatedData(
          addScoreArea,
          state.areasList.data,
          state.selectedWeek,
        );
      return {
        ...state,
        addScore: {
          ...state.addScore,
          loading: false,
          success: true,
        },
      };
    case ADD_SCORE_ERROR:
      return {
        ...state,
        addScore: {
          ...state.addScore,
          loading: false,
          error: action.error,
        },
      };

    case EDIT_SCORE_REQUEST:
      const { body, type } = action.payload;
      let area = state.areasList.data.find((area) => area.id === body.area);
      area.isExpanded = !!type;
      let areaIndex = state.areasList.data.findIndex(
        (area) => area.id === body.area,
      );
      let category = area.categories.find((c) => c.id === body.category);
      let categoryIndex = area.categories.findIndex(
        (c) => c.id === body.category,
      );
      let newScore = category.scores.find((s) => s.id === body.id);
      let newScoreIndex = category.scores.findIndex((s) => s.id === body.id);
      newScore = {
        ...newScore,
        value: body.value,
        journal: body.journal,
      };
      category.scores[newScoreIndex] = newScore;
      area.categories[categoryIndex] = category;
      state.areasList.dashboardTableData[areaIndex] = getAreaCalculatedData(
        area,
        state.areasList.data,
        state.selectedWeek,
      );
      return {
        ...state,
        editScore: { ...state.editScore, loading: true },
      };
    case EDIT_SCORE_SUCCESS:
      return {
        ...state,
        editScore: {
          ...state.editScore,
          loading: false,
          success: true,
        },
      };
    case EDIT_SCORE_ERROR:
      return {
        ...state,
        editScore: {
          ...state.editScore,
          loading: false,
          error: action.error,
        },
      };

    case GET_ACTIVITY_JOURNAL_REQUEST:
      return {
        ...state,
        getActivityJournal: {
          ...state.getActivityJournal,
          loading: true,
          showLoader: action.payload.showLoader && true,
        },
      };
    case GET_ACTIVITY_JOURNAL_SUCCESS:
      return {
        ...state,
        getActivityJournal: {
          ...state.getActivityJournal,
          loading: false,
          success: true,
          showLoader: false,
          data: action.data,
        },
      };
    case GET_ACTIVITY_JOURNAL_ERROR:
      return {
        ...state,
        getActivityJournal: {
          ...state.getActivityJournal,
          loading: false,
          error: action.error,
        },
      };

    case GET_QUOTE_REQUEST:
      return {
        ...state,
        getQuote: {
          ...state.getQuote,
          loading: true,
        },
      };
    case GET_QUOTE_SUCCESS:
      return {
        ...state,
        getQuote: {
          ...state.getQuote,
          loading: false,
          success: true,
          showLoader: false,
          data: action.data,
        },
      };
    case GET_QUOTE_ERROR:
      return {
        ...state,
        getQuote: {
          ...state.getQuote,
          loading: false,
          error: action.error,
        },
      };

    case SET_SELECTED_WEEK:
      return {
        ...state,
        selectedWeek: action.payload,
      };

    case RESET_BLOCK_DASHBOARD:
      return {
        ...state,
        [action.payload.blockType]: {
          ...state[action.payload.blockType],
          ...initialState[action.payload.blockType],
        },
      };

    case RESET_FLAGS_DASHBOARD:
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
