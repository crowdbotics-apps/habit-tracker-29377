export const data = [
  {
    id: 'area1',
    areaName: 'Health',
    weight: 10,
    categories: [
      {
        id: 'category11',
        categoryName: 'Sleep',
        weight: 10,
        subcategories: [
          {
            id: 'subcategory111',
            subcategoryName: 'Duration',
            weight: 10,
            habits: [
              {
                id: 'habit1111',
                habitName: 'Sleep 8 hours',
                weight: 10,
              },
              {
                id: 'habit1112',
                habitName: 'Do not sleep more than 9 hours',
                weight: -10,
              },
            ],
          },
          {
            id: 'subcategory112',
            subcategoryName: 'Timing',
            weight: 9,
            habits: [
              {
                id: 'habit1121',
                habitName: 'Sleep at 12, wake up at 8 AM',
                weight: 10,
              },
              {
                id: 'habit1122',
                habitName: 'No staying late',
                weight: -10,
              },
            ],
          },
        ],
      },
      {
        id: 'category12',
        categoryName: 'Exercise',
        weight: 9,
        subcategories: [
          {
            id: 'subcategory121',
            subcategoryName: 'Aerobic',
            weight: 10,
            habits: [
              {
                id: 'habit1211',
                habitName: 'No sitting all day',
                weight: -10,
              },
            ],
          },
        ],
      },
      {
        id: 'category13',
        categoryName: 'Smoking',
        weight: 8,
        subcategories: [
          {
            id: 'subcategory131',
            subcategoryName: 'Smoking',
            weight: 8,
            habits: [
              {
                id: 'habit1311',
                habitName: 'No cigs',
                weight: -10,
              },
            ],
          },
        ],
      },
      {
        id: 'category14',
        categoryName: 'Nutrition',
        weight: 7,
        subcategories: [
          {
            id: 'subcategory141',
            subcategoryName: 'Veggies',
            weight: 10,
            habits: [
              {
                id: 'habit1411',
                habitName: 'Eat 5 tomatoes per day',
                weight: 10,
              },
            ],
          },
          {
            id: 'subcategory142',
            subcategoryName: 'Sugar',
            weight: 9,
            habits: [
              {
                id: 'habit1421',
                habitName: 'Eat less sugar',
                weight: 10,
              },
            ],
          },
          {
            id: 'subcategory143',
            subcategoryName: 'Carbs',
            weight: 8,
            habits: [
              {
                id: 'habit1431',
                habitName: 'No sugar',
                weight: -10,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'area2',
    areaName: 'Family',
    weight: 9,
    categories: [],
  },
  {
    id: 'area3',
    areaName: 'Environment',
    weight: 8,
    categories: [],
  },
  {
    id: 'area4',
    areaName: 'Contribution',
    weight: 7,
    categories: [],
  },
  {
    id: 'area5',
    areaName: 'Career',
    weight: 6,
    categories: [],
  },
];
