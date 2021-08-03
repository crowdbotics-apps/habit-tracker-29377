import React, { useState, useEffect, Fragment } from 'react';
import styled, { css } from 'styled-components';
import Form from 'react-bootstrap/Form';
import { useDispatch, useSelector } from 'react-redux';
import isEqual from 'lodash.isequal';

import TextBox from '../../atoms/TextBox';
import TextBoxLabel from '../../atoms/TextBoxLabel';
import Button from '../../components/Button';
import PlusIcon from '../DashboardHeader/assets/plusIcon';
import {
  updateUserProfile,
  updateSpecificUser,
  toggleUserType,
} from '../../modules/actions/UserActions';
import DialogModal from '../SelectUserModal';
import DefaultAvatar from '../../assets/images/DefaultAvatar.png';
import { logout } from '../../modules/actions/AuthActions';

const EditProfileForm = ({ userData, loading, setIsResetPassword, userId }) => {
  const dispatch = useDispatch();

  const {
    allUsersList: { success, normalUsers, coachUsers },
    updateSpecificUser: { loading: updateSpcificUserLoading },
    toggleUserType: {
      loading: toggleUserTypeLoading,
      success: toggleUserTypeSuccess,
    },
  } = useSelector(({ user }) => user);

  const { name, email, phone, is_superuser, is_coach, id } = userData;

  const prevUserData = {
    first_name: name?.split(' ')[0] || '',
    last_name: name?.split(' ')[1] || '',
    email: email || '',
    phone: phone || '',
    user_type: is_coach ? 'coach' : 'normal',
  };

  const [showDialog, setShowDialog] = useState(false);
  const [file, setFile] = useState(
    is_coach ? userData.assignees : userData.coaches,
  );
  const [profileDetails, setProfileDetails] = useState(prevUserData);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (success || toggleUserTypeSuccess) {
      const assignedList = is_coach ? userData.assignees : userData.coaches;
      const usersList = is_coach ? normalUsers : coachUsers;
      let users = [...usersList];
      assignedList.forEach((assigned) => {
        let foundIndex = users.findIndex((a) => a.id === assigned.id);
        if (foundIndex !== -1) {
          users.splice(foundIndex, 1);
        }
      });
      setFilteredData(users);
    }
  }, [success, toggleUserTypeSuccess]);

  const handleSelectedUser = (values) => {
    const newData = [...filteredData];
    values.forEach((selected) => {
      let foundIndex = newData.findIndex((a) => a.id === selected.id);
      if (foundIndex !== -1) {
        newData.splice(foundIndex, 1);
      }
    });
    setFilteredData(newData);
    setFile((prev) => [...prev, ...values]);
  };

  const handleChange = ({ target: { name, value } }) => {
    setProfileDetails({ ...profileDetails, [name]: value });
  };

  const assignUserOrCoachClick = () => {
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (profileDetails.user_type !== prevUserData.user_type) {
      prevUserData.user_type =
        prevUserData.user_type === 'coach' ? 'normal' : 'coach';
      dispatch(toggleUserType({ user_id: id }));
      setFile(
        profileDetails.user_type === 'coach'
          ? userData.assignees
          : userData.coaches,
      );
    }
    if (!isEqual(prevUserData, profileDetails)) {
      const { first_name, last_name, email, phone } = profileDetails;
      let item = {
        id: id,
        body: {
          email,
          name: first_name + ' ' + last_name,
          phone,
        },
      };
      if (userId) {
        dispatch(updateSpecificUser(item));
      } else {
        dispatch(updateUserProfile(item));
      }
    }
  };

  const onButtonClickHandler = () => {
    dispatch(logout());
  };

  const onclickHandler = () => setIsResetPassword(true);
  return (
    <Fragment>
      <DialogModal
        show={showDialog}
        handleClose={handleCloseDialog}
        selectedUser={handleSelectedUser}
        modalData={filteredData}
        userData={userData}
      />
      <FormWrapper>
        <FormInner>
          <Form noValidate onSubmit={handleSubmit}>
            <FormGroup>
              <Title>Personal information</Title>
              <Label className="authLabel">First Name</Label>
              <TextBoxs
                type="text"
                name="first_name"
                value={profileDetails.first_name}
                onChange={handleChange}
              />
              <Label className="authLabel">Last Name</Label>
              <TextBoxs
                type="text"
                name="last_name"
                value={profileDetails.last_name}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Title>Contact information</Title>
              <Label className="authLabel">Email</Label>
              <TextBoxs
                type="email"
                name="email"
                value={profileDetails.email}
                onChange={handleChange}
              />
              <Label className="authLabel">Phone</Label>
              <TextBoxs
                type="text"
                name="phone"
                value={profileDetails.phone}
                onChange={handleChange}
              />
            </FormGroup>
            {userId ? (
              <FormGroup>
                <Title>User type</Title>
                <Label className="authLabel">Type</Label>
                <Form.Control
                  as="select"
                  name="user_type"
                  value={profileDetails.user_type}
                  onChange={handleChange}
                >
                  <option value="normal">Normal user</option>
                  <option value="coach">Coach</option>
                </Form.Control>
              </FormGroup>
            ) : (
              <FormGroup>
                <Title>Login information</Title>
                <Link onClick={onclickHandler}>Reset my password</Link>
              </FormGroup>
            )}
            {(!is_superuser || userId) && (
              <FormGroup>
                <Title>
                  {userId ? (is_coach ? 'Coaching' : 'Coached by') : 'Coaching'}
                </Title>
                {!userId && (
                  <Label className="authLabel">{`Assigned ${
                    is_coach ? 'to' : 'coach'
                  }`}</Label>
                )}
                <FileUploaderSection>
                  {file ? (
                    <>
                      <Preview>
                        {file?.map(({ profile_picture }, i) => {
                          return (
                            <img
                              key={i}
                              src={profile_picture || DefaultAvatar}
                              alt="Profile"
                            />
                          );
                        })}
                        <FileUploaderWrapper
                          onClick={assignUserOrCoachClick}
                          type="button"
                        >
                          <PlusIcon color="#8E97A3" />
                        </FileUploaderWrapper>
                      </Preview>
                    </>
                  ) : (
                    <FileUploaderWrapper
                      onClick={assignUserOrCoachClick}
                      type="button"
                    >
                      <PlusIcon color="#8E97A3" />
                    </FileUploaderWrapper>
                  )}
                </FileUploaderSection>
              </FormGroup>
            )}
            {userId ? (
              <ButtonWrapper isRight>
                <ActionButton
                  color={'#8E97A3'}
                  bgcolor={'#E3E5E9'}
                  type="Button"
                >
                  Cancel
                </ActionButton>
                <ActionButton
                  type="submit"
                  loading={updateSpcificUserLoading || toggleUserTypeLoading}
                  bgcolor={'#789f08'}
                >
                  Save Changes
                </ActionButton>
              </ButtonWrapper>
            ) : (
              <ButtonWrapper>
                <ActionButton
                  type="submit"
                  loading={loading}
                  disabled={loading}
                  bgcolor={'#789f08'}
                >
                  Save Changes
                </ActionButton>
                <ActionButton
                  bgcolor={'#1689ca'}
                  type="Button"
                  onClick={onButtonClickHandler}
                >
                  Logout
                </ActionButton>
              </ButtonWrapper>
            )}
          </Form>
        </FormInner>
      </FormWrapper>
    </Fragment>
  );
};
export default EditProfileForm;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px 20px 33px;
  ${({ theme }) => theme.max('md')`
    margin: 23px 10px 10px;
  `}
`;
const FormInner = styled.div`
  min-width: 100%;
  ${({ theme }) => theme.min('xl')`
    min-width: 1200px;
  `}
`;
const FormGroup = styled.div`
  display: flex;
  background: #ffffff;
  border-radius: 5px;
  padding: 22px;
  align-items: center;
  margin-bottom: 2px;
  &:last-child {
    margin-bottom: 0;
  }
  ${({ theme }) => theme.max('sm')`
      display: block;
      margin-bottom: 10px;
  `}
  ${({ theme }) => theme.between('md', 'xl')`
    padding: 22px 10PX;
  `}
  & > select {
    max-width: 33%;
    ${({ theme }) => theme.max('sm')`
     max-width: 100%;
  `}
  }
`;
const Title = styled.div`
  min-width: 200px;
  ${({ theme }) => theme.between('md', 'xl')`
    min-width: 150px;
  `}
`;
const Label = styled(TextBoxLabel)`
  min-width: 100px;
  padding: 0 10px;
  ${({ theme }) => theme.max('md')`
      padding: 15px 0 0;
  `}
`;
const TextBoxs = styled(TextBox)`
  width: 100%;
`;
const Link = styled.a`
  padding: 0 10px;
  cursor: pointer;
  ${({ theme }) => theme.max('md')`
      padding: 15px 0 0;
  `}
`;
const FileUploaderSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  ${({ theme }) => theme.max('md')`
      margin-top: 5px;
  `}
`;

const FileUploaderWrapper = styled(Button)`
  background: #f8f9fb;
  border: 1px dashed #8e97a3;
  box-sizing: border-box;
  border-radius: 5px;
  width: 60px;
  height: 60px;
  & img {
    width: auto !important;
    height: auto !important;
  }
`;

const Preview = styled.div`
  display: flex;
  margin-right: 5px;
  border: 1px;
  flex-wrap: wrap;
  border-radius: 10px;
  & img {
    width: 60px;
    height: 60px;
    margin-right: 5px;
    margin-bottom: 5px;
  }
`;
const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  ${({ theme }) => theme.max('sm')`
    flex-direction: column;
  `}
  ${({ isRight }) =>
    isRight &&
    css`
      justify-content: flex-end;
    `}
`;
const ActionButton = styled(Button)`
  margin-top: 30px;
  background-color: ${({ bgcolor }) => bgcolor};
  color: ${({ color }) => color};
  width: 380px;
  margin-right: 5px;
  ${({ theme }) => theme.max('sm')`
    width: 100%;
  `}
`;
