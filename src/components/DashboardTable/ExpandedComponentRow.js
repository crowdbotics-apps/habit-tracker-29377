import React, { Fragment, useState, useRef, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { useDrag, useDrop } from 'react-dnd';
import update from 'immutability-helper';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Modal from 'react-bootstrap/Modal';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';

import AddScoreDialog from '../AddScoreDialog';
import dragIcon from '../../assets/images/dragIcon.png';
import { convertMinToHr, getAreaColor } from '../../utils/utility';
import useWindowSize from '../../utils/useWindowSize';
import { changeCategoryWeight } from '../../modules/actions/DashboardActions';

const ExpandedComponentRow = ({
  row,
  subRow,
  index,
  records,
  setRecords,
  dropDownItem,
}) => {
  const dispatch = useDispatch();
  const { width } = useWindowSize();

  const dropRef = useRef(null);
  const dragRef = useRef(null);

  const DND_ITEM_TYPE = 'row';

  const { selectedWeek } = useSelector(({ dashboard }) => dashboard);

  const { expander, mon, tue, wed, thu, fri, sat, sun, duration } =
    subRow.values;
  const [dayScores, setDayScores] = useState([
    mon,
    tue,
    wed,
    thu,
    fri,
    sat,
    sun,
  ]);

  const [selectedScoreData, setSelectedScoreData] = useState({
    areaId: '',
    categoryId: '',
    score: '',
    index: '',
    scoreId: '',
    journal: '',
  });
  const [showAddScoreDialog, setShowAddScoreDialog] = useState(false);
  const [isFutureDate, setIsFutureDate] = useState(false);
  const [currentDayIndex, setCurrentDayIndex] = useState();
  const [categoryWeightUpdate, setCategoryWeightUpdate] = useState(false);

  useEffect(() => {
    const currentWeek =
      new Date(selectedWeek[new Date().getDay() - 1]).toDateString() ===
      new Date(new Date()).toDateString();
    setCurrentDayIndex(currentWeek ? new Date().getDay() - 1 : null);
  }, [selectedWeek]);

  useEffect(() => {
    if (categoryWeightUpdate) {
      const newRecords = records.map((record, index) => ({
        ...record,
        values: {
          ...record.values,
          expander: {
            ...record.values.expander,
            weight: records.length - index,
          },
        },
      }));
      setRecords(newRecords);
      const updatedWeights = newRecords.map((record) => ({
        id: +record.id.split('_')[1],
        weight: record.values.expander.weight,
      }));
      let body = {
        weight_id_list: updatedWeights,
        areaId: row.id,
      };
      dispatch(changeCategoryWeight(body));
      setCategoryWeightUpdate(false);
    }
  }, [categoryWeightUpdate]);

  const toggleAddScoreDialog = () => setShowAddScoreDialog((prev) => !prev);

  const moveRow = (dragIndex, hoverIndex) => {
    const dragRecord = records[dragIndex];
    setRecords(
      update(records, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragRecord],
        ],
      }),
    );
  };

  const handleScoreClick =
    (areaId, categoryId, score, index, scoreId, journal) => () => {
      const checkFutureDate = moment(
        selectedWeek[index],
        'YYYY-MM-DD',
        true,
      ).isBefore(moment(new Date(), 'YYYY-MM-DD', true));
      setIsFutureDate(!checkFutureDate);

      setSelectedScoreData({
        areaId,
        categoryId,
        score,
        index,
        scoreId,
        journal,
      });
      if (width < 992) toggleAddScoreDialog();
    };

  const addScoreDialog = (
    <StyledPopover id="popover-basic">
      {!isFutureDate && (
        <AddScoreDialog
          selectedScoreData={selectedScoreData}
          setDayScores={setDayScores}
        />
      )}
    </StyledPopover>
  );

  const getAggregateLabel = (value) => {
    switch (dropDownItem) {
      case 'avg':
        return value.avg !== '-' ? value.avg + '%' : '-';
      case 'points':
        return (
          <Fragment>
            {value.points !== '' && (
              <Fragment>
                <span>{value.points}</span>
                <CurrencySign>₳</CurrencySign>
              </Fragment>
            )}
          </Fragment>
        );
      case 'duration':
      default:
        return value.duration ? convertMinToHr(value) : '-';
    }
  };

  const [, drop] = useDrop({
    accept: DND_ITEM_TYPE,
    drop() {
      setCategoryWeightUpdate(true);
    },
    hover(item, monitor) {
      if (!dropRef.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = dropRef.current.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      moveRow(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    item: { type: DND_ITEM_TYPE, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;

  preview(drop(dropRef));
  drag(dragRef);

  return (
    <Fragment>
      {!isFutureDate && (
        <StyledModal
          show={showAddScoreDialog}
          onHide={toggleAddScoreDialog}
          dialogClassName="dialogClass"
        >
          <AddScoreDialog
            onClose={toggleAddScoreDialog}
            selectedScoreData={selectedScoreData}
            setDayScores={setDayScores}
          />
        </StyledModal>
      )}
      <StyledSubRow ref={dropRef} style={{ opacity }}>
        <EmptyTD first color={getAreaColor(row.original.area.code)} />
        <EmptyTD ref={dragRef}>
          <div>
            <SubWeight>{expander.weight}</SubWeight>
            <DragNDropIcon src={dragIcon} alt="icon" />
          </div>
        </EmptyTD>
        <CategoryWrapperTd>
          <div>
            <CategoryTitle>{expander.title}</CategoryTitle>
            {/*<CategorySubTitle>{expander.subTitle}</CategorySubTitle>*/}
          </div>
        </CategoryWrapperTd>

        {dayScores.map((score, index) => (
          <DayScoreTd key={index}>
            {width < 992 ? (
              <DayScore
                dayIndex={index}
                currentDayIndex={currentDayIndex}
                onClick={handleScoreClick(
                  row.id,
                  subRow.id,
                  score.value,
                  index,
                  score.scoreId,
                  score.journal,
                )}
              >
                <Score>{score.value}</Score>
              </DayScore>
            ) : (
              <OverlayTrigger
                rootClose
                trigger="click"
                placement="bottom-start"
                overlay={addScoreDialog}
              >
                <DayScore
                  dayIndex={index}
                  currentDayIndex={currentDayIndex}
                  onClick={handleScoreClick(
                    row.id,
                    subRow.id,
                    score.value,
                    index,
                    score.scoreId,
                    score.journal,
                  )}
                >
                  <Score>{score.value}</Score>
                </DayScore>
              </OverlayTrigger>
            )}
          </DayScoreTd>
        ))}
        <DayScoreTd last>
          <Score>{getAggregateLabel(duration)}</Score>
        </DayScoreTd>
      </StyledSubRow>
    </Fragment>
  );
};

export default ExpandedComponentRow;

const StyledSubRow = styled.tr`
  // background:  ${({ theme }) => theme.palette.common.white};
`;

// const StyledSubRow = styled.tr`
//   background: ${({ theme }) => theme.palette.common.grey};
//   border-radius: 4px;
//   border: 1px solid #e3e5e9;
//   box-sizing: border-box;
//   margin: 12px 0px;
//   padding: 12px 16px;
//   width: 1292px;
//   height: 280px;
//   top: 60px;
// `;

const StyledModal = styled(Modal)`
  & .modal {
    /* padding-left: 0; */
  }
  & .modal-content {
    border: none;
    border-radius: 10px;
  }
  & .dialogClass {
    margin-top: 78px;
    ${({ theme }) => theme.max('sm')`
      margin-top: 49px;
    `}
  }
`;

const StyledPopover = styled(Popover)`
  border: none !important;
  & .arrow {
    &::after {
      display: none !important;
    }
    &::before {
      border-color: transparent !important;
    }
  }
`;

const EmptyTD = styled.td`
  width: 5.5% !important;
  position: relative;
  text-align: center;

  ${({ first }) =>
    first &&
    css`
      width: 4.5% !important;
      &:before {
        content: '';
        position: absolute;
        width: 4px;
        height: 100%;
        background-color: ${({ color }) => color};
        top: 0;
        left: 0;
      }
    `}
`;

const CategoryWrapperTd = styled.td`
  width: 34% !important;
  padding: 10px 0;
`;

const CategoryTitle = styled.div`
  font-family: Roboto;
  font-size: 14px;
  line-height: 16px;
  color: #2a3037;
  margin-bottom: 3px;
`;

const CategorySubTitle = styled.div`
  font-family: Roboto;
  font-size: 14px;
  line-height: 16px;
  color: #8e97a3;
`;

const DayScoreTd = styled.td`
  max-width: 6.8% !important;
  text-align: center;
  ${({ last }) =>
    last &&
    css`
      width: 9% !important;
    `}
`;

const DayScore = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 47px;
  height: 36px;
  background: #ffffff;
  border: 1px solid ${({ theme }) => theme.palette.text.secondaryLight};
  box-sizing: border-box;
  border-radius: 5px;
  margin: 0 auto;
  &:hover {
    box-shadow: 0px 0px 0px 4px #f3f3f3;
  }
  &:active {
    border: 1px solid #1689ca;
    box-shadow: 0px 0px 0px 4px #e5f5fe;
  }
  ${({ dayIndex, currentDayIndex }) =>
    currentDayIndex &&
    dayIndex > currentDayIndex &&
    css`
       background:#e9e8ef !important;
  }
    `}
`;

const Score = styled.div`
  font-family: Roboto;
  font-size: 14px;
  line-height: 24px;
  color: ${({ theme }) => theme.palette.text.primary};
`;

const SubWeight = styled.div`
  font-family: Roboto;
  font-weight: bold;
  font-size: 14px;
  line-height: 16px;
  color: #818ea3;
  margin-top: 5px;
`;

const DragNDropIcon = styled.img`
  cursor: pointer;
`;

const CurrencySign = styled.span`
  font-weight: 700;
  color: #ff9900;
`;
