import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { Accordion, Card } from 'react-bootstrap';
import Chekbox from './Checkbox';
import { getAreaIcon, getAreaColor } from '../../../../../utils/utility';
import arrowRightGrey from '../../../../../assets/images/arrowRightGrey.png';
import arrowDownGrey from '../../../../../assets/images/arrowDownGrey.png';

const { Toggle, Collapse } = Accordion;
const { Body, Header } = Card;

const ActivityListing = ({
  data = [],
  selectedCategory,
  setSelectedCategory,
}) => {
  const [selectedArea, setSelectedArea] = useState([]);
  useEffect(() => {
    if (data.length && selectedCategory.length) {
      const areas = data.map((area) => {
        const selectedDataAreaId = selectedCategory.map((i) => i.areaId);
        return {
          ...area,
          isCollapse: false,
          checked: selectedDataAreaId.includes(area.id),
          categories: area.categories.map((c) => ({
            ...c,
            checked: selectedDataAreaId.includes(area.id),
          })),
        };
      });
      setSelectedArea(areas);
    }
  }, [data.length, selectedCategory.length]);

  const onAreaItemClick = (areaId) => () => {
    const areas = selectedArea.map((area) => ({
      ...area,
      isCollapse: area.id === areaId ? !area.isCollapse : area.isCollapse,
    }));
    setSelectedArea(areas);
  };

  const selectSubCategory = (areaId, categoryId) => () => {
    const area = selectedArea.find((area) => area.id === areaId);
    const areaIndex = selectedArea.findIndex((area) => area.id === areaId);
    const categories = area.categories.map((c) => ({
      ...c,
      checked: c.id === categoryId,
    }));
    const selectedCategory = categories.find((c) => c.id === categoryId);
    const editableCategory = categories.find((c) => c.checked);
    const newData = [...selectedArea];
    newData.splice(areaIndex, 1, { ...area, categories });
    // setSelectedArea(newData);
  };

  const handleChange = (areaId) => () => {
    const areas = selectedArea.map((area) => ({
      ...area,
      checked: area.id === areaId ? !area.checked : area.checked,
    }));
    setSelectedArea(areas);
    const filterAreaID = selectedCategory.filter((i) => i.areaId === areaId);

    if (filterAreaID.length) {
      const filterCurrentAreaID = selectedCategory.filter(
        (i) => i.areaId !== areaId,
      );
      setSelectedCategory(filterCurrentAreaID);
    } else {
      const area = selectedArea.find((area) => area.id === areaId);
      const data = {
        areaId: area.id,
        areaName: area.area.name,
        areaCode: area.area.code,
      };
      setSelectedCategory([...selectedCategory, data]);
    }
  };

  const tempData =
    selectedArea?.length &&
    selectedArea?.map((item, i) => {
      const {
        id,
        isCollapse,
        checked,
        area: { name, code },
        categories,
      } = item;

      return (
        <ActivityWrapper key={i}>
          <ActivityRow>
            <Card>
              <ActivityCol isExpanded={isCollapse} color={getAreaColor(code)}>
                <Toggle as={Header} eventKey={id} onClick={onAreaItemClick(id)}>
                  <div>
                    <NavIcon
                      src={isCollapse ? arrowDownGrey : arrowRightGrey}
                      alt="icon"
                    />
                    {code && (
                      <ActivityIcon src={getAreaIcon(code)} alt="icon" />
                    )}
                    {`${name} (${categories.length})`}
                  </div>
                  <div>
                    <Chekbox
                      name={name}
                      checked={checked}
                      onChange={handleChange(id)}
                    />
                  </div>
                </Toggle>
              </ActivityCol>
              <Collapse eventKey={id}>
                <Body>
                  {isCollapse &&
                    categories.map((c, index) => {
                      return (
                        <ExpandedRow key={index}>
                          <SubCategoryName>{c.category.name}</SubCategoryName>
                          <Chekbox
                            name={name}
                            checked={c.checked}
                            onChange={selectSubCategory(id, c.id)}
                            disabled
                          />
                        </ExpandedRow>
                      );
                    })}
                </Body>
              </Collapse>
            </Card>
          </ActivityRow>
        </ActivityWrapper>
      );
    });
  return <div>{tempData}</div>;
};

export default ActivityListing;

const ActivityWrapper = styled.div`
  ${({ theme }) => theme.max('md')`
    overflow-x: auto;
    -ms-overflow-style: none; 
    scrollbar-width: none; 
    &::-webkit-scrollbar {
      display: none;
    }
  `}
`;

const ActivityRow = styled(Accordion)`
  background: ${({ theme }) => theme.palette.primary.contrastText};
  & .card {
    border: 0;
    border-radius: 0;
  }
  & .card-body {
    padding: 0;
    min-height: 0;
  }
  & .card-header {
    background-color: transparent;
    border-color: #f9f9f9;
    display: flex;
    justify-content: space-between;
  }
`;

const ActivityCol = styled.div`
  position: relative;
  cursor: pointer;
  text-align: left;
  border: 0;
  &:before {
    content: '';
    position: absolute;
    width: 4px;
    height: 100%;
    background-color: ${({ color }) => color};
    top: 0;
    left: 0;
    border-radius: 5px;
  }
  ${({ isExpanded }) => isExpanded && css``}
`;

const ActivityIcon = styled.img`
  padding: 0 23px;
`;

const NavIcon = styled.img`
  padding-left: 5px;
`;

const ExpandedRow = styled.div`
  width: 595px;
  border-bottom: 2px solid ${({ theme }) => theme.palette.background.main};
  display: flex;
  justify-content: space-between;
  padding: 13px 20px;
`;

const SubCategoryName = styled.div``;
