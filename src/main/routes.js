import Login from '../screens/Login';
import Signup from '../screens/Signup';
import ForgotPassword from '../screens/ForgotPassword';
import ChangePassword from '../screens/ChangePassword';
import Dashboard from '../screens/Dashboard';
import Analytics from '../screens/Analytics';
import Settings from '../screens/Settings';
import Profile from '../screens/Profile';
import UsersListing from '../screens/Users';

export default [
  {
    exact: true,
    path: '/',
    name: 'Login',
    component: Login,
  },
  {
    exact: true,
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    exact: true,
    path: '/signup',
    name: 'Signup',
    component: Signup,
  },
  {
    exact: true,
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword,
  },
  {
    exact: true,
    path: '/change-password',
    name: 'ChangePassword',
    component: ChangePassword,
  },
  {
    exact: true,
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    isPrivate: true,
  },
  {
    exact: true,
    path: '/analytics',
    name: 'Analytics',
    component: Analytics,
    isPrivate: true,
  },
  {
    exact: true,
    path: '/settings',
    name: 'Settings',
    component: Settings,
    isPrivate: true,
  },
  {
    exact: true,
    path: '/profile',
    name: 'Profile',
    component: Profile,
    isPrivate: true,
  },
  {
    exact: true,
    path: '/users/:id',
    name: 'User',
    component: Profile,
    isPrivate: true,
  },
  {
    exact: true,
    path: '/users',
    name: 'UsersList',
    component: UsersListing,
    isPrivate: true,
  },
];
