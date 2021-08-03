import moment from 'moment';
import React, { useEffect, useState } from 'react';
import ReactExport from 'react-data-export';
import { useSelector } from 'react-redux';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const ExportToExcel = ({ button, type }) => {
  const [excelData, setExcelData] = useState([]);
  const [months, setMonths] = useState([]);

  const {
    areasList: { analyticsTableData = [] },
  } = useSelector(({ analytics }) => analytics);

  useEffect(() => {
    if (analyticsTableData.length > 0) {
      const ranges = analyticsTableData[0].monthsRange;
      const months = ranges.map((range) => {
        return moment(range.month, 'M').format('MMM').toLowerCase();
      });

      const exportData = [];
      analyticsTableData.forEach((obj) => {
        const { area, subRows, duration } = obj;
        let item = {};
        item.area = area.title;
        months.forEach((month) => {
          item[month] = obj[month][type];
          item[type] = duration[type];
        });
        exportData.push(item);
        subRows.forEach((row) => {
          const {
            area: { title },
            duration,
          } = row;
          let item = {};
          item.category = title;
          months.forEach((month) => {
            item[month] = row[month][type];
            item[type] = duration[type];
          });
          exportData.push(item);
        });
      });

      setMonths(months);
      setExcelData(exportData);
    }
  }, [analyticsTableData.length, type]);

  return (
    <>
      {months.length > 0 && excelData.length > 0 && (
        <ExcelFile element={button}>
          <ExcelSheet ExcelSheet data={excelData} name="Employees">
            <ExcelColumn label="Area" value="area" />
            <ExcelColumn label="Category" value="category" />
            {months.map((month, index) => (
              <ExcelColumn
                key={index}
                label={month.toUpperCase()}
                value={month}
              />
            ))}
            <ExcelColumn label={type} value={type} />
          </ExcelSheet>
        </ExcelFile>
      )}
    </>
  );
};

export default ExportToExcel;
