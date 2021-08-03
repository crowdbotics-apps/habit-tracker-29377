import Cookies from 'js-cookie';
import moment from 'moment';
import zip from 'lodash.zip';

import { days } from './constants';
import familyIcon from '../assets/images/familyIcon.png';
import healthIcon from '../assets/images/healthIcon.png';
import partnerIcon from '../assets/images/partnerIcon.png';
import growthIcon from '../assets/images/growthIcon.png';
import careerIcon from '../assets/images/careerIcon.png';
import contributionIcon from '../assets/images/contributionIcon.png';
import financeIcon from '../assets/images/financeIcon.png';
import socialIcon from '../assets/images/socialIcon.png';
import leisureIcon from '../assets/images/leisureIcon.png';
import environmentIcon from '../assets/images/environmentIcon.png';

export const isLoggedIn = () => {
  const token = Cookies.get('token');
  return !!token;
};

export const getAreaIcon = (code) => {
  switch (code) {
    case 'famil':
      return familyIcon;
    case 'healt':
      return healthIcon;
    case 'partn':
      return partnerIcon;
    case 'growt':
      return growthIcon;
    case 'caree':
      return careerIcon;
    case 'contr':
      return contributionIcon;
    case 'finan':
      return financeIcon;
    case 'socia':
      return socialIcon;
    case 'leisu':
      return leisureIcon;
    case 'envir':
    default:
      return environmentIcon;
  }
};

export const getAreaColor = (code) => {
  switch (code) {
    case 'famil':
      return '#10A3B7';
    case 'healt':
      return '#2E99E7';
    case 'partn':
      return '#20A58D';
    case 'growt':
      return '#9D9655';
    case 'caree':
      return '#BA876A';
    case 'contr':
      return '#24A431';
    case 'finan':
      return '#6B7DDC';
    case 'socia':
      return '#9E64CC';
    case 'leisu':
      return '#CC6181';
    case 'envir':
    default:
      return '#DD6868';
  }
};

export const getAreaBackgroundColor = (code) => {
  switch (code) {
    case 'famil':
      return '#E7F6F8';
    case 'healt':
      return '#EAF5FD';
    case 'partn':
      return '#E9F6F4';
    case 'growt':
      return '#F5F5EE';
    case 'caree':
      return '#F8F3F0';
    case 'contr':
      return '#E9F6EA';
    case 'finan':
      return '#F0F2FB';
    case 'socia':
      return '#F5F0FA';
    case 'leisu':
      return '#FAEFF2';
    case 'envir':
    default:
      return '#FCF0F0';
  }
};

// NOTE: returns start and end dates in ISO format
export const getStartEndDates = (startDate, endDate) => {
  let start = new Date(startDate).setHours('00');
  start = new Date(start).setMinutes('01');
  start = new Date(start).toISOString();

  let end = new Date(endDate).setHours('23');
  end = new Date(end).setMinutes('59');
  end = new Date(end).toISOString();

  return { start, end };
};

export const getStartEndDatesV2 = (startDate, endDate) => {
  return {
    start: moment(startDate).format('YYYY-MM-DD'),
    end: moment(endDate).format('YYYY-MM-DD'),
  };
};

export const getDateOfSelectedWeek = (selectedWeek, day) => {
  const selected = selectedWeek.map((d) => moment(d).format('YYYY-MM-DD'));
  switch (day) {
    case 'mon':
      return selected[0];
    case 'tue':
      return selected[1];
    case 'wed':
      return selected[2];
    case 'thu':
      return selected[3];
    case 'fri':
      return selected[4];
    case 'sat':
      return selected[5];
    case 'sun':
      return selected[6];
    default:
      break;
  }
};

export const getAreaCalculatedData = (item, sortedData, selectedWeek) => {
  const {
    id,
    weight,
    area: { name = '', code } = {},
    categories,
    isExpanded = false,
  } = item;
  const calculationOfDays = days.map((day) => ({
    avg: calculateAvgForDay(day, id, sortedData, selectedWeek),
    points: calculatePointsForDay(day, id, sortedData, selectedWeek),
    duration: calculateDurationForDay(day, id, sortedData, selectedWeek),
  }));
  return {
    key: id,
    id: id,
    weight: weight,
    icon: getAreaIcon(code),
    area: {
      title: `${name} (${categories.length})`,
      subTitle: getAreaSubtitle(categories),
      code,
      isExpanded,
    },
    mon: calculationOfDays[0],
    tue: calculationOfDays[1],
    wed: calculationOfDays[2],
    thu: calculationOfDays[3],
    fri: calculationOfDays[4],
    sat: calculationOfDays[5],
    sun: calculationOfDays[6],
    duration: {
      avg: getAverageOfWeek(calculationOfDays.map((c) => c.avg)),
      points: getPointsOfWeek(id, sortedData),
      duration: getDurationOfWeek(id, sortedData),
    },
    subRows: categories.map((c) => ({
      // NOTE: made custom id (i.e. AreaName_categoryId) to resolve key conflict in react-table
      key: `${name}_${c.id}`,
      id: `${name}_${c.id}`,
      weight: '',
      area: {
        title: c.category.name,
        subTitle: 'Sleep 8 hours each night',
        weight: c.weight,
      },
      mon: getCategoryScore('mon', c, selectedWeek),
      tue: getCategoryScore('tue', c, selectedWeek),
      wed: getCategoryScore('wed', c, selectedWeek),
      thu: getCategoryScore('thu', c, selectedWeek),
      fri: getCategoryScore('fri', c, selectedWeek),
      sat: getCategoryScore('sat', c, selectedWeek),
      sun: getCategoryScore('sun', c, selectedWeek),
      duration: {
        avg: getAverageScore(c?.scores),
        points: getPointsScore(c, id, sortedData),
        duration: getDurationScore(c),
      },
    })),
  };
};

export const todayAreasDataChecker = (data) => {
  return data
    ?.map((i) =>
      i?.categories
        ?.map((c) =>
          c.scores?.filter(
            (i) =>
              new Date(i.date_time)?.toDateString() ===
              new Date().toDateString(),
          )?.length
            ? 1
            : 0,
        )
        ?.reduce((accumulator, currentValue) => accumulator + currentValue, 0),
    )
    ?.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
};

export const getAreaSubtitle = (categories) => {
  return categories.map(({ category }) => category.name).join(', ');
};

export const getCategoryScore = (day, category, selectedWeek) => {
  const days = category.scores?.map((s) =>
    moment(s.date_time).format('YYYY-MM-DD'),
  );
  const specificDay = getDateOfSelectedWeek(selectedWeek, day);
  if (days && days.includes(specificDay)) {
    const index = days.findIndex((d) => d === specificDay);
    return {
      scoreId: category.scores[index].id,
      value: category.scores[index].value,
      journal: category.scores[index].journal,
    };
  } else {
    return {
      scoreId: '',
      value: '-',
      journal: '',
    };
  }
};

export const getAverageScore = (scoresValues) => {
  const scores = scoresValues?.map((score) => score.value);
  const calculatedScore =
    scores?.reduce((a, c) => a + c, 0) / scores?.length / 10;
  return Math.round(calculatedScore * 100) || '-';
};

export const getPointsScore = (category, areaId, areasData) => {
  const currentArea = areasData.find((i) => i.id === areaId);
  const scores = category.scores?.map((score) => score.value);
  const sum = scores?.reduce((a, c) => a + c, 0);
  const calculatedScore = ((sum * category.weight) / 10) * currentArea.weight;
  return Math.round(calculatedScore) || 0;
};

export const calculateAvgForDay = (day, areaId, areasData, selectedWeek) => {
  const specificDay = getDateOfSelectedWeek(selectedWeek, day);
  const currentArea = areasData.find((i) => i.id === areaId);
  const areaCategories = currentArea.categories;
  const calculatedSumForDays = areaCategories?.map((category) => {
    const currentDayScore = category.scores?.find(
      (score) => moment(score.date_time).format('YYYY-MM-DD') === specificDay,
    );
    if (!currentDayScore) return 0;
    return currentDayScore.value * Math.abs(category.weight);
  });

  const calculatedSum = calculatedSumForDays?.reduce((a, c) => a + c, 0);

  const categoryWeightToConsider = areaCategories.map((category) => {
    const scoreToConsider = category.scores?.find(
      (score) =>
        moment(score.date_time).format('YYYY-MM-DD') === specificDay &&
        score.value > -1,
    );
    return scoreToConsider ? Math.abs(category.weight) : 0;
  });

  const categoryWeightSum = categoryWeightToConsider.reduce((a, c) => a + c, 0);

  const average = (calculatedSum / categoryWeightSum / 10) * 100 || 0;
  return average > 0 ? Math.round(average) : '';
};

export const calculatePointsForDay = (day, areaId, areasData, selectedWeek) => {
  const specificDay = getDateOfSelectedWeek(selectedWeek, day);
  const currentArea = areasData.find((i) => i.id === areaId);
  const areaCategories = currentArea.categories;
  const calculatedSumForDays = areaCategories.map((category) => {
    const currentDayScore = category.scores?.find(
      (score) => moment(score.date_time).format('YYYY-MM-DD') === specificDay,
    );
    if (!currentDayScore) return '';
    return currentDayScore.value * category.weight;
  });
  const filterData = calculatedSumForDays.filter((e) => typeof e === 'number');
  if (filterData.length > 0) {
    const calculatedSum = filterData.reduce((a, c) => a + c, 0);
    const points = (calculatedSum * currentArea.weight) / 10;
    return Math.round(points);
  }
  return '';
};

export const getAverageOfWeek = (calculationOfDays) => {
  const filteredData = calculationOfDays.filter(Boolean);
  const sum = filteredData.reduce((a, c) => a + c, 0);
  const dataOfWeek = sum / filteredData.length;
  return Math.round(dataOfWeek) || '';
};

export const getPointsOfWeek = (areaId, areasData) => {
  const currentArea = areasData.find((i) => i.id === areaId);
  const categoriesScores = currentArea.categories.map((c) =>
    getPointsScore(c, areaId, areasData),
  );
  const points = categoriesScores.reduce((a, c) => a + c, 0);
  return points;
};

export const getDaysAverage = (sortedData, days, selectedWeek) => {
  const calculationOfDaysClone = sortedData.map((item) =>
    days.map((day) =>
      calculateAvgForDay(day, item.id, sortedData, selectedWeek),
    ),
  );
  const calculationOfDays = zip(...calculationOfDaysClone);
  const averageOfPerticularDays = calculationOfDays.map((day) => {
    const filterDays = day.filter(Boolean).length;
    return day.reduce((a, c) => +a + +c, 0) / filterDays || 0;
  });
  const filterAverageOfPerticularDayData =
    averageOfPerticularDays.filter(Boolean);
  const sumOfAverageData =
    filterAverageOfPerticularDayData.length &&
    filterAverageOfPerticularDayData.reduce((a, c) => +a + +c, 0);
  const filterAverageData = filterAverageOfPerticularDayData.length;
  const calculatedAverage = sumOfAverageData / filterAverageData || 0;
  return Math.round(calculatedAverage);
};

export const getPointsAverage = (sortedData, days, selectedWeek) => {
  const calculationOfDaysClone = sortedData.map((item) =>
    days.map((day) =>
      calculatePointsForDay(day, item.id, sortedData, selectedWeek),
    ),
  );

  const calculationOfDays = zip(...calculationOfDaysClone);

  const filterData = calculationOfDays.map((item) =>
    item.filter((e) => typeof e == 'number'),
  );

  const averageOfPerticularDaysPoints = filterData.map((day) => {
    const daysFilterData = day.filter((e) => typeof e == 'number');
    if (daysFilterData.length > 0) {
      return day.reduce((a, c) => a + c, 0);
    }
    return '';
  });
  const filterAverageOfPerticularDayPointsData =
    averageOfPerticularDaysPoints.filter((e) => typeof e === 'number');
  const sumOfAverageData = filterAverageOfPerticularDayPointsData.reduce(
    (a, c) => a + c,
    0,
  );
  const filterAverageData = filterAverageOfPerticularDayPointsData.length;
  const calculatedAverage = sumOfAverageData / filterAverageData || 0;
  return Math.round(calculatedAverage);
};

export const getDurationAverage = (sortedData, days, selectedWeek) => {
  const calculationOfDaysClone = sortedData.map((item) =>
    days.map((day) =>
      calculateDurationForDay(day, item.id, sortedData, selectedWeek),
    ),
  );

  const calculationOfDays = zip(...calculationOfDaysClone);
  const filterData = calculationOfDays.map((item) =>
    item.filter((e) => typeof e == 'number'),
  );

  const averageOfPerticularDaysDurations = filterData.map((day) => {
    const daysFilterData = day.filter((e) => typeof e == 'number');
    if (daysFilterData.length > 0) {
      return day.reduce((a, c) => a + c, 0);
    }
    return '';
  });
  const filterAverageOfPerticularDayDurationData =
    averageOfPerticularDaysDurations.filter((e) => typeof e === 'number');
  const sumOfAverageData = filterAverageOfPerticularDayDurationData.reduce(
    (a, c) => a + c,
    0,
  );
  const filterAverageData = filterAverageOfPerticularDayDurationData.length;
  const calculatedAverage = sumOfAverageData / filterAverageData || 0;
  return Math.round(calculatedAverage);
};

export const getAverageOfPoints = (sortedData) => {
  const calculationOfDaysDuration = sortedData.map((item) => {
    const daysPointValue = item?.categories?.map((c) =>
      getPointsScore(c, item.id, sortedData),
    );
    return daysPointValue?.reduce((a, c) => a + c, 0) || 0;
  });
  const averageValueOfDuration = calculationOfDaysDuration?.reduce(
    (a, c) => a + c,
    0,
  );
  return averageValueOfDuration || 0;
};

export const calculateDurationForDay = (
  day,
  areaId,
  areasData,
  selectedWeek,
) => {
  const specificDay = getDateOfSelectedWeek(selectedWeek, day);
  const currentArea = areasData.find((i) => i.id === areaId);
  const areaCategories = currentArea.categories;
  const calculatedSumForDays = areaCategories.map((category) => {
    const currentDayScore = category.scores?.find(
      (score) => moment(score.date_time).format('YYYY-MM-DD') === specificDay,
    );
    if (!currentDayScore) return '';
    return currentDayScore.value * Math.abs(category.duration);
  });

  const divider = calculatedSumForDays.filter(
    (e) => typeof e === 'number',
  )?.length;
  const calculatedSum = calculatedSumForDays.reduce((a, c) => a + c, 0);
  const average = calculatedSum / divider / 10 || 0;
  return average > 0 ? Math.round(average) : '';
};

export const getDurationScore = (category) => {
  const scores = category.scores?.map((score) => score.value);
  const sum = scores?.reduce((a, c) => a + c, 0);
  const calculatedScore = sum * category.duration;
  return Math.round(calculatedScore) || 0;
};

export const getDurationOfWeek = (areaId, areasData) => {
  const currentArea = areasData.find((i) => i.id === areaId);
  const categoriesScores = currentArea.categories.map((c) =>
    getDurationScore(c),
  );
  const duration = categoriesScores.reduce((a, c) => a + c, 0);
  return duration;
};

export const convertMinToHr = (value) => {
  const duration = value.duration;
  const calculatedDuration =
    duration > 60 ? Math.round(duration / 60) + 'H' : duration + 'M';
  return calculatedDuration;
};

export const getWeekDays = (weekStart) => {
  const days = [weekStart];
  for (let i = 1; i < 7; i += 1) {
    days.push(moment(weekStart).add(i, 'days').toDate());
  }
  return days;
};

export const getWeekRange = (date) => {
  return {
    from: moment(date).startOf('week').add(1, 'days').toDate(),
    to: moment(date).endOf('week').add(1, 'days').toDate(),
  };
};
