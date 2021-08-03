import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

// we will connect our reducers here
import { AuthReducer } from './reducers/AuthReducer';
import { UserReducer } from './reducers/UserReducer';
import { DashboardReducer } from './reducers/DashboardReducer';
import { AnalyticsReducer } from './reducers/AnalyticsReducer';

const appReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    auth: AuthReducer,
    user: UserReducer,
    dashboard: DashboardReducer,
    analytics: AnalyticsReducer,
  });

const createRootReducer = (history) => (state, action) => {
  if (action.type === 'LOGOUT') {
    state = undefined;
  }
  return appReducer(history)(state, action);
};

export default createRootReducer;
