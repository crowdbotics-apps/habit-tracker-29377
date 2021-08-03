import { min, max, between, BREAKPOINTS } from './mixins';

export default {
  breakpoints: BREAKPOINTS,
  palette: {
    primary: {
      light: '#47b0eb',
      main: '#1689CA',
      dark: '#1273b9',
      contrastText: '#fff',
    },
    success: {
      main: '#789f08',
    },
    common: {
      black: '#000',
      white: '#fff',
      grey: '#F5F5F5',
    },
    background: {
      main: '#f9f9f9',
    },
    link: {
      main: '#00fff0',
    },
    text: {
      primary: '#1B2A3D',
      secondary: '#8E97A3',
      secondaryLight: '#E3E5E9',
    },
  },
  min,
  max,
  between,
};
