import { all } from 'redux-saga/effects';

import AuthSaga from './AuthSaga';
import UserSaga from './UserSaga';
import DashboardSaga from './DashboardSaga';
import AnalyticsSaga from './AnalyticsSaga';

export function* sagas() {
  yield all([AuthSaga, UserSaga, DashboardSaga, AnalyticsSaga]);
}
