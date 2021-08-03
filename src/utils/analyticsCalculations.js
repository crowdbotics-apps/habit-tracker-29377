import { zip } from 'lodash';
import moment from 'moment';
import React, { Fragment } from 'react';
import { months } from './constants';
import { getAreaSubtitle } from './utility';

export const calculateAvgForMonth = (item, areaId, areasData, type) => {
  const currentArea = areasData.find((item) => item.id === areaId);
  const areaCategories = currentArea.categories;

  const calculatedSumForMonths = areaCategories.map((category) => {
    const currentMonthScore = category.scores.filter((score) => {
      if (!type) {
        return (
          item.month === moment(score.date_time).format('M') &&
          item.year === moment(score.date_time).format('YYYY')
        );
      } else {
        let day = new Date(score.date_time).getDay();
        const test =
          type === 'weekday' ? day !== 6 && day !== 0 : day === 6 || day === 0;
        return (
          item.month === moment(score.date_time).format('M') &&
          item.year === moment(score.date_time).format('YYYY') &&
          test
        );
      }
    });
    const categoryScore = currentMonthScore.map((i) => {
      if (!i) return 0;
      return {
        value: i.value * Math.abs(category.weight),
        date: i.date_time,
        weight: Math.abs(category.weight),
      };
    });
    return categoryScore.length ? categoryScore : 0;
  });
  const categoryScoreValue = calculatedSumForMonths.flat();
  let result = categoryScoreValue.reduce((acc, obj) => {
    let existObj = acc.find(
      (item) =>
        moment(item.date).format('DD-MM-YYYY') ===
        moment(obj.date).format('DD-MM-YYYY'),
    );
    let weightCheck = (existObj?.value && obj?.value) > -1;
    if (existObj && weightCheck) {
      existObj.value += obj.value;
      existObj.weight += obj.weight;
      return acc;
    }
    acc.push(obj);
    return acc;
  }, []);
  const calculatedData = result.map(
    (i) => Math.round((i.value / i.weight / 10) * 100) || '',
  );
  const filterData = calculatedData.filter((n) => typeof n === 'number');
  const calculatedAvg =
    filterData.reduce((a, c) => a + c, 0) / filterData?.length;

  return calculatedAvg > 0 ? Math.round(calculatedAvg) : '';
};

export const calculatePointsForMonth = (item, areaId, areasData, type) => {
  const currentArea = areasData.find((i) => i.id === areaId);
  const areaCategories = currentArea.categories;
  const calculatedSumForMonths = areaCategories.map((category) => {
    const currentMonthScore = category.scores.filter((score) => {
      if (!type) {
        return (
          item.month === moment(score.date_time).format('M') &&
          item.year === moment(score.date_time).format('YYYY')
        );
      } else {
        let day = new Date(score.date_time).getDay();
        const test =
          type === 'weekday' ? day !== 6 && day !== 0 : day === 6 || day === 0;
        return (
          item.month === moment(score.date_time).format('M') &&
          item.year === moment(score.date_time).format('YYYY') &&
          test
        );
      }
    });
    const categroyScore = currentMonthScore.map(
      (i) => i.value * category.weight,
    );
    if (!categroyScore.length) return '';
    const sumofCategroyScoreValue = categroyScore?.reduce((a, c) => a + c, 0);
    return sumofCategroyScoreValue;
  });

  const filterData = calculatedSumForMonths.filter(
    (e) => typeof e === 'number',
  );
  if (filterData.length > 0) {
    const calculatedSum = filterData.reduce((a, c) => a + c, 0);
    const points = (calculatedSum * currentArea.weight) / 10;
    return Math.round(points);
  }
  return '';
};

export const calculateDurationForMonth = (item, areaId, areasData, type) => {
  const currentArea = areasData.find((i) => i.id === areaId);
  const areaCategories = currentArea.categories;
  const calculatedSumForMonths = areaCategories.map((category) => {
    const currentMonthScore = category.scores.find((score) => {
      if (!type) {
        return (
          item.month === moment(score.date_time).format('M') &&
          item.year === moment(score.date_time).format('YYYY')
        );
      } else {
        let day = new Date(score.date_time).getDay();
        return item.month === moment(score.date_time).format('M') &&
          item.year === moment(score.date_time).format('YYYY') &&
          type === 'weekday'
          ? day !== 6 && day !== 0
          : day === 6 || day === 0;
      }
    });
    if (!currentMonthScore) return '';
    return currentMonthScore.value * Math.abs(category.duration);
  });

  const divider = calculatedSumForMonths.filter(
    (e) => typeof e === 'number',
  )?.length;
  const calculatedSum = calculatedSumForMonths.reduce((a, c) => a + c, 0);
  const average = calculatedSum / divider / 10 || 0;
  return average > 0 ? Math.round(average) : '';
};

export const getAverageOfMonth = (calculationOfMonths) => {
  const filteredData = calculationOfMonths.filter(Boolean);
  const sum = filteredData.reduce((a, c) => a + c, 0);
  const dataOfMonths = sum / filteredData.length;
  return Math.round(dataOfMonths) || '';
};

export const getPointsOfMonth = (calculationOfMonths) => {
  const filteredData = calculationOfMonths.filter((n) => typeof n === 'number');
  const points = filteredData.reduce((a, c) => a + c, 0);
  return points;
};

export const getDurationOfMonth = (calculationOfMonths) => {
  const filteredData = calculationOfMonths.filter((n) => typeof n === 'number');
  const duration = filteredData.reduce((a, c) => a + c, 0);
  return duration;
};

export const getCategoryMonthlyData = () => {
  return '';
};

export const getCategoryMonthlyAverage = (item, scores = []) => {
  if (scores?.length) {
    const currentScore = scores?.filter((score) => {
      return (
        item.month === moment(score.date_time).format('M') &&
        item.year === moment(score.date_time).format('YYYY')
      );
    });
    const monthDays = moment(item.month, 'MM').daysInMonth();
    const scoresValue = currentScore.map((i) => i.value);
    const filterData = scoresValue.filter((n) => typeof n === 'number');
    const sum = filterData.reduce((a, c) => a + c, 0);
    const divider = filterData?.length;
    const avgOfMonths = (sum / divider / monthDays) * 100;
    return Math.round(avgOfMonths) || '';
  }
};

export const getCategoryMonthlyPoints = (
  item,
  scores,
  weight,
  areaId,
  areasData,
) => {
  if (scores?.length) {
    const currentScore = scores?.filter((score) => {
      return (
        item.month === moment(score.date_time).format('M') &&
        item.year === moment(score.date_time).format('YYYY')
      );
    });
    const areaWeight = areasData?.find((a) => a.id === areaId)?.weight;
    const scoresValue = currentScore.map((i) => i.value);
    const filterData = scoresValue.filter((n) => typeof n === 'number');
    const sum = filterData.reduce((a, c) => a + c, 0);
    const calculatedScore = (sum * weight * areaWeight) / 10;
    const calculatedPoints =
      calculatedScore > 0 && calculatedScore < 1 ? 1 : calculatedScore;
    return Math.round(calculatedPoints) || '';
  }
};
export const getCategoryMonthlyDuration = (item, scores, duration) => {
  if (scores?.length) {
    const currentScore = scores?.filter((score) => {
      return (
        item.month === moment(score.date_time).format('M') &&
        item.year === moment(score.date_time).format('YYYY')
      );
    });

    const scoresValue = currentScore.map((i) => i.value);
    const filterData = scoresValue.filter(Boolean);
    const sum = filterData.reduce((a, c) => a + c, 0);
    const calculatedDuration = sum * duration;
    return Math.round(calculatedDuration) || '';
  }
};

export const getDaysAverage = (sortedData, monthRang) => {
  const calculationOfDaysClone = sortedData.map((item) =>
    monthRang.map((rang) => calculateAvgForMonth(rang, item.id, sortedData)),
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

export const getPointsAverage = (sortedData, monthRang) => {
  const calculationOfDaysClone = sortedData.map((item) =>
    monthRang.map((rang) => calculatePointsForMonth(rang, item.id, sortedData)),
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
  return '';
};

export const getDurationAverage = (sortedData, monthRang) => {
  const calculationOfDaysClone = sortedData.map((item) =>
    monthRang.map((rang) =>
      calculateDurationForMonth(rang, item.id, sortedData),
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

export const getAverageWeekdayAndWeekend = (sortedData, monthsRange, type) => {
  const calculatedData = sortedData.map((item) => {
    const { id } = item;
    const calculatedWeekdays = monthsRange.map((item) => ({
      avg: calculateAvgForMonth(item, id, sortedData, type),
      points: calculatePointsForMonth(item, id, sortedData, type),
      duration: calculateDurationForMonth(item, id, sortedData, type),
    }));
    const filterAvgData = calculatedWeekdays
      .map((i) => i.avg)
      ?.filter((n) => typeof n === 'number');
    const filterPointsData = calculatedWeekdays
      .map((i) => i.points)
      ?.filter((n) => typeof n === 'number');
    const filterDurationData = calculatedWeekdays
      .map((i) => i.duration)
      ?.filter((n) => typeof n === 'number');
    const calculatedAvg =
      filterAvgData?.reduce((a, c) => a + c, 0) / filterAvgData?.length;
    const calculatedPoints =
      filterPointsData?.reduce((a, c) => a + c, 0) / filterPointsData?.length;
    const calculatedDuration =
      filterDurationData?.reduce((a, c) => a + c, 0) /
      filterDurationData?.length;
    return {
      avg: Math.round(calculatedAvg) || '',
      points: Math.round(calculatedPoints) || '',
      duration: Math.round(calculatedDuration) || '',
    };
  });
  const calculatedDividerAvgData = calculatedData
    .map((i) => i.avg)
    ?.filter((n) => typeof n === 'number');
  const calculatedDividerPointsData = calculatedData
    .map((i) => i.points)
    ?.filter((n) => typeof n === 'number');
  const calculatedDividerDurationData = calculatedData
    .map((i) => i.duration)
    ?.filter((n) => typeof n === 'number');

  const calAverage =
    calculatedDividerAvgData.reduce((a, c) => a + c, 0) /
    calculatedDividerAvgData?.length;
  const calPoints =
    calculatedDividerPointsData.reduce((a, c) => a + c, 0) /
    calculatedDividerPointsData?.length;
  const calDurations =
    calculatedDividerDurationData.reduce((a, c) => a + c, 0) /
    calculatedDividerDurationData?.length;
  return {
    avg: Math.round(calAverage) || 0,
    points: Math.round(calPoints) || 0,
    duration: Math.round(calDurations) || 0,
  };
};

export const getCategoryAvgAverage = (avgValues) => {
  const filterData = avgValues.filter((n) => typeof n === 'number');
  const sum = filterData.reduce((a, c) => a + c, 0);
  const divider = filterData?.length;
  return Math.round(sum / divider) || '';
};

export const getCategoryAvgPoints = (avgValues) => {
  const filterData = avgValues.filter((n) => typeof n === 'number');
  const sum = filterData.reduce((a, c) => a + c, 0);
  return Math.round(sum) || '';
};

export const getCategoryAvgDuration = (avgValues) => {
  const filterData = avgValues.filter((n) => typeof n === 'number');
  const sum = filterData.reduce((a, c) => a + c, 0);
  return Math.round(sum) || '';
};

export const getAnalyticsCalculatedData = (
  item,
  sortedData,
  monthsRange,
  getDynamicMonths,
) => {
  const {
    id,
    area: { name, code },
    categories,
  } = item;
  const calculationOfMonth = monthsRange.map((item) => ({
    avg: calculateAvgForMonth(item, id, sortedData),
    points: calculatePointsForMonth(item, id, sortedData),
    duration: calculateDurationForMonth(item, id, sortedData),
  }));
  const area = {
    key: id,
    id: id,
    monthsRange,
    area: {
      title: name,
      subTitle: getAreaSubtitle(categories),
      months: getDynamicMonths(monthsRange, calculationOfMonth),
      code,
    },
    duration: {
      avg: getAverageOfMonth(calculationOfMonth.map((c) => c.avg)),
      points: getPointsOfMonth(calculationOfMonth.map((c) => c.points)),
      duration: getDurationOfMonth(calculationOfMonth.map((c) => c.duration)),
    },
    subRows: categories.map((c) => ({
      // NOTE: made custom id (i.e. AreaName_categoryId) to resolve key conflict in react-table
      c,
      monthsRange,
      key: `${name}_${c.id}`,
      id: `${name}_${c.id}`,
      area: {
        title: c.category.name,
        subTitle: 'Sleep 8 hours each night',
        months: getDynamicMonths(monthsRange, calculationOfMonth),
      },
      duration: {
        avg: getCategoryAvgAverage(
          monthsRange.map((i) =>
            getCategoryMonthlyAverage(i, c.scores, c.weight, id),
          ),
        ),
        points: getCategoryAvgPoints(
          monthsRange.map((i) =>
            getCategoryMonthlyPoints(i, c.scores, c.weight, id, sortedData),
          ),
        ),
        duration: getCategoryAvgDuration(
          monthsRange.map((i) =>
            getCategoryMonthlyDuration(i, c.scores, c.duration),
          ),
        ),
      },
    })),
  };
  const dynamicMonths = getDynamicMonths(monthsRange, calculationOfMonth);
  dynamicMonths.forEach((m) => {
    const monthName = Object.keys(m)[0];
    let monthNumber;
    for (const key in months) {
      if (months[key] === monthName) {
        monthNumber = key;
      }
    }
    const data = monthsRange.find((obj) => obj.month === monthNumber);
    const entry = Object.entries(m)[0];
    area[entry[0]] = entry[1];
    area.subRows = area.subRows.map((subRow) => ({
      ...subRow,
      [entry[0]]: {
        avg: getCategoryMonthlyAverage(
          data,
          subRow.c.scores,
          subRow.c.weight,
          area.id,
        ),
        points: getCategoryMonthlyPoints(
          data,
          subRow.c.scores,
          subRow.c.weight,
          area.id,
          sortedData,
        ),
        duration: getCategoryMonthlyDuration(
          data,
          subRow.c.scores,
          subRow.c.duration,
        ),
      },
    }));
  });
  return area;
};

export const rangeTextRendering = (priod, value, type) => {
  let dateType = type === 'start' ? 'from' : 'to';
  switch (priod) {
    case 1:
      return <Fragment>{moment(value[dateType][0]).format('MMM D')}</Fragment>;

    case 7:
    case 30:
    case 90:
    case 180:
      return (
        <Fragment>
          {moment(value[dateType][0]).format('MMM D')}
          {' - '}
          {moment(value[dateType][1]).format('MMM D')}
        </Fragment>
      );
    case 365:
      return (
        <Fragment>{moment(value[dateType][0]).format('D MMM YYYY')}</Fragment>
      );
  }
};
