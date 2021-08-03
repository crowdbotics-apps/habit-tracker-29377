import React, { useEffect } from 'react';
import {
  Route,
  Switch,
  Redirect,
  withRouter,
  useHistory,
} from 'react-router-dom';
import { useSelector } from 'react-redux';

import './App.css';
import routes from './routes';
import { isLoggedIn } from '../utils/utility';

const renderRoutes = () => {
  const renderRoute = (routerProps, Component, props, isPrivate = false) => {
    if (Component) {
      const componentProps = {
        ...routerProps,
        ...props,
      };
      if (isPrivate) {
        return isLoggedIn() ? (
          <Component {...componentProps} />
        ) : (
          <Redirect to="/login" />
        );
      }
      return isLoggedIn() ? (
        <Redirect to="/dashboard" />
      ) : (
        <Component {...componentProps} />
      ); // eslint-disable-line
    }
    return null;
  };

  return routes.map((route) => (
    <Route
      key={route.name}
      exact={route.exact}
      path={route.path}
      render={(routerProps) =>
        renderRoute(routerProps, route.component, route.props, route.isPrivate)
      }
    />
  ));
};

const Router = () => <Switch>{renderRoutes()}</Switch>;

const App = () => {
  const history = useHistory();

  const {
    logout: { success },
  } = useSelector(({ auth }) => auth);

  useEffect(() => {
    if (success) {
      history.push('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success]);

  return (
    <div>
      <Router />
    </div>
  );
};

export default withRouter(App);
