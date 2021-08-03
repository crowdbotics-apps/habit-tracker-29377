export const ScoreData = [
  { score: 0, color: '#0BA7F6' },
  { score: 1, color: '#1AADE8' },
  { score: 2, color: '#26B1DD' },
  { score: 3, color: '#35B7CF' },
  { score: 4, color: '#44BDC0' },
  { score: 5, color: '#53C2B2' },
  { score: 6, color: '#62C8A3' },
  { score: 7, color: '#71CD95' },
  { score: 8, color: '#80D386' },
  { score: 9, color: '#90D978' },
  { score: 10, color: '#9EDE6A' },
];
export const WeightDropDownList = [
  { label: '10', value: 10 },
  { label: '9', value: 9 },
  { label: '8', value: 8 },
  { label: '7', value: 7 },
  { label: '6', value: 6 },
  { label: '5', value: 5 },
  { label: '4', value: 4 },
  { label: '3', value: 3 },
  { label: '2', value: 2 },
  { label: '1', value: 1 },
];
export const NegativeWeightDropDownList = [
  { label: '-10', value: -10 },
  { label: '-9', value: -9 },
  { label: '-8', value: -8 },
  { label: '-7', value: -7 },
  { label: '-6', value: -6 },
  { label: '-5', value: -5 },
  { label: '-4', value: -4 },
  { label: '-3', value: -3 },
  { label: '-2', value: -2 },
  { label: '-1', value: -1 },
];
export const DurationHoursData = [];
export const DurationMinutesData = [];

for (let i = 1; i <= 8; i++) {
  DurationHoursData.push(i);
}

for (let i = 1; i <= 59; i++) {
  DurationMinutesData.push(i);
}

export const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

export const weekDays = ['mon', 'tue', 'wed', 'thu', 'fri'];

export const weekendDays = ['sat', 'sun'];

export const months = {
  1: 'jan',
  2: 'feb',
  3: 'mar',
  4: 'apr',
  5: 'may',
  6: 'jun',
  7: 'jul',
  8: 'aug',
  9: 'sep',
  10: 'oct',
  11: 'nov',
  12: 'dec',
};

export const addbuttonStyles = {
  padding: '8px 12px',
  width: 'max-content',
  background: '#35aa22',
};

export const cancelButtonStyles = {
  ...addbuttonStyles,
  background: '#fff',
  border: '1px solid #E3E5E9',
  color: '#1689CA',
  marginRight: '12px',
};

export const newFormatData = [
  {
    id: 1,
    area: 'Health',
    categories: [
      {
        id: 'cate1',
        categoryName: 'Sleep',
        subCategories: [
          {
            id: 'subCat11',
            subCategory: 'Duration',
            habits: [
              {
                id: 'subCat1habit1',
                habit: 'No staying late',
              },
              {
                id: 'subCat1habit2',
                habit: 'Sleep at 12, wake up at 8 AM',
              },
              {
                id: 'subCat1habit3',
                habit: 'No staying late',
              },
            ],
          },
          {
            id: 'subCat12',
            subCategory: 'Timing',
            habits: [
              {
                id: 'subCat2habit1',
                habit: 'No staying late',
              },
              {
                id: 'subCat2habit2',
                habit: 'Sleep at 12, wake up at 8 AM',
              },
              {
                id: 'subCat2habit3',
                habit: 'No staying late',
              },
            ],
          },
        ],
      },
      //2nd Category
      {
        id: 'cate2',
        categoryName: 'Exercise',
        subCategories: [
          {
            id: 'subCat21',
            subCategory: 'Aerobic',
            habits: [
              {
                id: 'habit1',
                habit: 'No sitting all day',
              },
            ],
          },
        ],
      },
    ],
  },

  //2nd area
  {
    id: 2,
    area: 'Environment',
    categories: [
      {
        id: 'cate21',
        categoryName: 'Smoking',
        subCategories: [
          {
            id: 'subCat211',
            subCategory: 'Smoking',
            habits: [
              {
                id: 'subCat21habit1',
                habit: 'No cigs',
              },
            ],
          },
          {
            id: 'subCat212',
            subCategory: 'Timing',
            habits: [
              {
                id: 'subCat22habit1',
                habit: 'No staying late',
              },
              {
                id: 'subCat22habit2',
                habit: 'Sleep at 12, wake up at 8 AM',
              },
            ],
          },
        ],
      },
      //2nd Category
      {
        id: 'cate22',
        categoryName: 'Nutrition',
        subCategories: [
          {
            id: 'subCat221',
            subCategory: 'Veggies',
            habits: [
              {
                id: 'subCat22habit1',
                habit: 'Eat 5 tomatoes per day',
              },
            ],
          },
        ],
      },
    ],
  },
];
