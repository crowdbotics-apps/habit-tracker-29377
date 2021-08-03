import React from 'react';
import { useSelector } from 'react-redux';
import styled, { css } from 'styled-components';
import { NavLink, useLocation } from 'react-router-dom';

import DashboardIcon from '../LeftNavbar/assets/DashboardIcon';
import AnalyticsIcon from '../LeftNavbar/assets/AnalyticsIcon';
import SettingsIcon from '../LeftNavbar/assets/SettingsIcon';
import ProfileIcon from '../LeftNavbar/assets/ProfileIcon';
import ActiveDashboardIcon from '../LeftNavbar/assets/ActiveDashboardIcon';
import ActiveAnalyticsIcon from '../LeftNavbar/assets/ActiveAnalyticsIcon';
import ActiveSettingsIcon from '../LeftNavbar/assets/ActiveSettingsIcon';
import ActiveProfileIcon from '../LeftNavbar/assets/ActiveProfileIcon';

const NavItems = [
  {
    id: 'dashboard',
    text: 'dashboard',
    link: '/dashboard',
    icon: DashboardIcon,
    activeIcon: ActiveDashboardIcon,
  },
  {
    id: 'analytics',
    text: 'analytics',
    link: '/analytics',
    icon: AnalyticsIcon,
    activeIcon: ActiveAnalyticsIcon,
  },
  {
    id: 'settings',
    text: 'settings',
    link: '/settings',
    icon: SettingsIcon,
    activeIcon: ActiveSettingsIcon,
  },
  {
    id: 'profile',
    text: 'profile',
    link: '/profile',
    icon: ProfileIcon,
    activeIcon: ActiveProfileIcon,
  },
  {
    id: 'users',
    text: 'view all users',
    link: '/users',
    icon: ProfileIcon,
    activeIcon: ActiveProfileIcon,
  },
];

const MobileNavDrawer = ({ open, onClose }) => {
  const { pathname } = useLocation();

  const {
    userData: { data: { is_superuser = false } = {} },
  } = useSelector(({ user }) => user);

  return (
    <Drawer open={open}>
      <NavbarWrapper>
        <div>
          {NavItems.map((nav, i) => {
            const { id, icon: Icon, activeIcon: ActiveIcon, text, link } = nav;
            if (id !== 'users' || (is_superuser && id === 'users'))
              return (
                <NavItem
                  key={i}
                  to={link}
                  onClick={onClose}
                  active={pathname === link}
                >
                  {pathname === link ? (
                    <ActiveIcon color="#FFF" smallIcon />
                  ) : (
                    <Icon color="#8E97A3" smallIcon />
                  )}
                  <NavItemText isActive={pathname === link}>{text}</NavItemText>
                </NavItem>
              );
          })}
        </div>
        <TrackActivityButton>Track activity</TrackActivityButton>
      </NavbarWrapper>
    </Drawer>
  );
};

export default MobileNavDrawer;

const Drawer = styled.div`
  width: calc(100vw - 20px);
  height: calc(100vh - 74px);
  position: fixed;
  margin: 4px 10px;
  padding: 8px;
  top: 66px;
  left: -110vw;
  z-index: 12;
  background: ${({ theme }) => theme.palette.common.white};
  border-radius: 4px;
  transition: left 0.3s ease-in;
  ${({ theme }) => theme.between('sm', 'md')`
    height: calc(100vh - 116px);
    top: 108px;
  `}
  ${({ open }) =>
    open &&
    css`
      left: 0;
    `}
`;

const NavbarWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const NavItem = styled(NavLink)`
  text-decoration: none !important;
  padding: 19px;
  display: flex;
  align-items: center;
  border-radius: 4px;
  margin-bottom: 4px;
  background: ${({ theme }) => theme.palette.common.white};
  ${({ active }) =>
    active &&
    css`
      background: ${({ theme }) => theme.palette.primary.main};
    `}
  > * {
    &:first-child {
      margin-right: 11px;
    }
  }
`;

const NavItemText = styled.div`
  font-family: Roboto;
  font-size: 12px;
  line-height: 16px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.palette.text.secondary};
  ${({ isActive }) =>
    isActive &&
    css`
      color: ${({ theme }) => theme.palette.common.white};
    `}
`;

const TrackActivityButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Roboto;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.palette.common.white};
  border-radius: 4px;
  padding: 16px;
  background: ${({ theme }) => theme.palette.primary.main};
`;
