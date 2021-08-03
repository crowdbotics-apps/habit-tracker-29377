import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import ProfileImageBackground from '../../assets/images/ProfileImageBackground.png';
import { setUserProfilePicture } from '../../modules/actions/UserActions';
import goBackIcon from '../../assets/images/goBackIcon.png';
import DefaultAvatar from '../../assets/images/DefaultAvatar.png';
import imageUpload from './assets/imageUpload.png';
import Button from '../Button';

const ProfileHeader = ({ userData, userId }) => {
  const dispatch = useDispatch();
  const imageUploader = useRef(null);
  const history = useHistory();
  const onPressHandler = () => {
    if (userId) return;
    imageUploader.current.click();
  };
  const [imagePreviewUrl, setImagePreviewUrl] = useState();

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const fileUploadHandler = async (event) => {
    let reader = new FileReader();
    let file = event.target.files[0];
    reader.onloadend = () => {
      setImagePreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
    const base64 = await toBase64(file);
    dispatch(setUserProfilePicture({ image: base64 }));
  };

  const {
    profile_picture,
    name,
    is_superuser = false,
    is_coach = false,
  } = userData;

  return (
    <HeaderWrapper>
      {userId && (
        <NavHeaderWrapper>
          <NavHeaderLayout>
            <NavButton
              icon={goBackIcon}
              isLeft
              onClick={() => history.push(`/users`)}
            >
              Go Back
            </NavButton>
            <Text>{`View all users / ${name || 'Guest'} `}</Text>
          </NavHeaderLayout>
        </NavHeaderWrapper>
      )}
      <HeaderLayout>
        <ImageWrapper onClick={onPressHandler}>
          <ProfileImage
            src={imagePreviewUrl || profile_picture || DefaultAvatar}
            alt="profile"
          />

          {!userId && (
            <EditProfileIcon>
              <img src={imageUpload} alt="icon" />
            </EditProfileIcon>
          )}
        </ImageWrapper>
        <UserInfoWrapper>
          <UserName>{name || 'Guest'}</UserName>
          <UserType>
            {is_superuser ? 'Admin' : is_coach ? 'Coach' : 'Normal user'}
          </UserType>
        </UserInfoWrapper>
      </HeaderLayout>
      <FileUploader
        ref={imageUploader}
        type="file"
        name="avatar[image]"
        accept="image/*"
        onChange={fileUploadHandler}
      />
    </HeaderWrapper>
  );
};

export default ProfileHeader;

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const HeaderLayout = styled.div`
  display: flex;
  border-radius: 10px;
  background-color: #fff;
  padding: 30px;
  margin: 20px 20px 33px;
  background-image: url(${ProfileImageBackground});
  ${({ theme }) => theme.max('md')`
    margin: 20px 10px 10px;
  `}
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 130px;
`;

const ProfileImage = styled.img`
  height: 120px;
  width: 120px;
  border-radius: 10px;
  border: 1px;
`;

const EditProfileIcon = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  background-color: #1689ca;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 25px;
  width: 25px;
  border: 3px solid #ffffff;
  box-sizing: border-box;
  border-radius: 20px;
  cursor: pointer;
  color: #ffffff;
`;

const UserInfoWrapper = styled.div``;

const UserName = styled.h6`
  font-weight: bold;
  font-size: 18px;
  line-height: 24px;
  text-align: right;
  color: ${({ theme }) => theme.palette.text.primary};
`;

const UserType = styled.p`
  font-size: 12px;
`;

const FileUploader = styled.input`
  display: none;
`;

const NavHeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px 10px 0;
`;

const NavHeaderLayout = styled.div`
  display: flex;
  border-radius: 10px;
  background-color: #fff;
  padding: 30px;
  align-items: center;
`;

const NavButton = styled(Button)`
  background: #1689ca;
  border-radius: 5px;
  width: 140px;
  text-transform: uppercase;
`;

const Text = styled.div`
  margin-left: 45px;
`;
