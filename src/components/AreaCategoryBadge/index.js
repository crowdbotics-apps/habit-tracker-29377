import React, { Fragment } from 'react';
import styled, { css } from 'styled-components';
import { useSelector } from 'react-redux';
import ThreeDotsIcon from '../../assets/images/ThreeDotsIcon';

const AreaCategoryBadge = ({ areaId, categoryId = '', isLast = false }) => {
  const {
    areasList: { data: areasData = [] },
  } = useSelector(({ dashboard }) => dashboard);

  const getAreaLabel = () => {
    const selectedArea = areasData.find((item) => item.id === areaId);
    return selectedArea?.area.name || '';
  };

  const getCategoryLabel = () => {
    let category_id = categoryId.includes('_')
      ? +categoryId.split('_')[1]
      : +categoryId;
    const selectedArea = areasData.find((item) => item.id === areaId);
    const selectedCategory = selectedArea.categories.find(
      (item) => item.id === category_id,
    );
    return selectedCategory?.category.name || '';
  };

  return (
    <Fragment>
      {areaId && (
        <Wrapper isLast>
          <AreaText>Health</AreaText>
          {categoryId && <CategoryText> / Sleep</CategoryText>}
        </Wrapper>
      )}
    </Fragment>
  );
};

export default AreaCategoryBadge;

const Wrapper = styled.span`
  padding: 5px 5px;
  color: #2e99e7;
  background: #eaf5fd;
  border-radius: 20px;
  display: flex;
  height: 24px;
  align-items: center;
  ${({ isLast }) =>
    isLast &&
    css`
      width: fit-content;
      margin-top: 0px;
    `}
`;

const AreaText = styled.span`
  font-family: Roboto;
  font-weight: 700;
  font-size: 12px;
  line-height: 16px;
  margin: 0px 4px;
`;

const CategoryText = styled(AreaText)`
  font-weight: 400;
  margin: 0px 4px;
`;
