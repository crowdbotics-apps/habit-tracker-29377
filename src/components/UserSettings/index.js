import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { updateSetting } from '../../modules/actions/UserActions';
import useWindowSize from '../../utils/useWindowSize';
import Button from '../Button';

const UserSettings = () => {
  const dispatch = useDispatch();
  const { width } = useWindowSize();

  const {
    userData: {
      data: { settings },
    },
  } = useSelector(({ user }) => user);

  const [dropdownItem, setDropdownItem] = useState('daily');
  const [dropdownItem2, setDropdownItem2] = useState('Graph only');

  const onChangeHandler = (e) => {
    setDropdownItem(e);
    if (width > 600) {
      let item = {
        id: settings.id,
        notifications: dropdownItem,
        display_values: dropdownItem2,
      };
      dispatch(updateSetting(item));
    }
  };

  useEffect(() => {
    setDropdownItem(settings?.notifications);
    setDropdownItem2(settings?.display_values);
  }, [settings]);

  const onClickHandler = (e) => {
    setDropdownItem2(e);
    if (width > 600) {
      let item = {
        id: settings.id,
        notifications: dropdownItem,
        display_values: dropdownItem2,
      };
      dispatch(updateSetting(item));
    }
  };

  const buttonClickHandler = () => {
    let item = {
      id: settings.id,
      notifications: dropdownItem,
      display_values: dropdownItem2,
    };
    dispatch(updateSetting(item));
  };

  return (
    <SettingItems>
      <NotificationRows>
        <LeftSection>
          <Text>{'Notifications'}</Text>
          <SubText>{'How often do you want to be notified'}</SubText>
        </LeftSection>
        <RightSection>
          <DropdownWrapper>
            <DropdownButton
              variant={'white'}
              title={dropdownItem}
              onSelect={onChangeHandler}
            >
              <Dropdown.Item eventKey="daily">daily</Dropdown.Item>
              <Dropdown.Item eventKey="weekly">weekly</Dropdown.Item>
              <Dropdown.Item eventKey="monthly">monthly</Dropdown.Item>
            </DropdownButton>
          </DropdownWrapper>
        </RightSection>
      </NotificationRows>
      <NotificationRows>
        <LeftSection>
          <Text>{'Display values'}</Text>
          <SubText>{'How would you like to display values'}</SubText>
        </LeftSection>
        <RightSection>
          <DropdownWrapper>
            <DropdownButton
              variant={'white'}
              title={dropdownItem2}
              onSelect={onClickHandler}
            >
              <Dropdown.Item eventKey="Graph only">Graph only</Dropdown.Item>
            </DropdownButton>
          </DropdownWrapper>
        </RightSection>
      </NotificationRows>
      {width < 600 && (
        <SylistButton onClick={buttonClickHandler}>Save Changes</SylistButton>
      )}
    </SettingItems>
  );
};

export default UserSettings;

const SettingItems = styled.section``;
const NotificationRows = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.palette.primary.contrastText};
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 2px;
  ${({ theme }) => theme.max('md')`
    margin-bottom: 10px;
  `}
`;
const LeftSection = styled.div`
  margin-left: 10px;
`;
const RightSection = styled.div`
  display: flex;
  align-items: center;
  ${({ theme }) => theme.max('md', 'xl')`
        margin-top: 10px;
        margin-left: 10px;
        width: 100%;
  `}
`;
const Text = styled.h6``;
const SubText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.palette.text.secondary};
  margin-bottom: 0;
`;
const DropdownWrapper = styled(Dropdown)`
  width: 100%;
  button {
    width: 388px;
    height: 36px;
    text-align: left;
    position: relative;
    border-color: ${({ theme }) => theme.palette.text.secondaryLight};
    color: ${({ theme }) => theme.palette.text.primary};
    font-size: 14px;
    &::after {
      position: absolute;
      right: 10px;
      top: 50%;
      color: ${({ theme }) => theme.palette.text.secondary};
    }
    &:focus {
      box-shadow: none;
    }
    ${({ theme }) => theme.max('md', 'xl')`
        width: 100%;
    `}
  }
  .dropdown-menu.show {
    width: 388px;
    ${({ theme }) => theme.max('md', 'xl')`
        width: 366px;
    `}
  }
  .dropdown-item {
    &:hover {
      background-color: ${({ theme }) => theme.palette.primary.contrastText};
    }
  }
`;

const SylistButton = styled(Button)`
  background: #789f08;
  position: absolute;
  bottom: 0;
  left: 0;
  margin: 10px;
  width: -webkit-fill-available;
`;
