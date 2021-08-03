import { css } from 'styled-components';

export const BREAKPOINTS = {
  xs: 449,
  sm: 768,
  md: 992,
  lg: 1200,
  xl: 1400,
};

export const min =
  (breakpoint) =>
  (...args) =>
    css`
      @media (min-width: ${getSizeFromBreakpoint(breakpoint, BREAKPOINTS)}) {
        ${css(...args)};
      }
    `;

export const max =
  (breakpoint) =>
  (...args) =>
    css`
      @media (max-width: ${getSizeFromBreakpoint(breakpoint, BREAKPOINTS)}) {
        ${css(...args)};
      }
    `;

export const between =
  (firstBreakpoint, secondBreakpoint) =>
  (...args) =>
    css`
      @media (min-width: ${getSizeFromBreakpoint(
          firstBreakpoint,
          BREAKPOINTS,
        )}) and (max-width: ${getSizeFromBreakpoint(
          secondBreakpoint,
          BREAKPOINTS,
        )}) {
        ${css(...args)};
      }
    `;

const emSize = (pixelValue) => `${pixelValue / 16}em`;

export const getSizeFromBreakpoint = (breakpointValue) => {
  if (BREAKPOINTS[breakpointValue]) {
    return emSize(BREAKPOINTS[breakpointValue]);
  } else if (parseInt(breakpointValue, 10)) {
    return emSize(BREAKPOINTS[breakpointValue]);
  }
  console.error(
    'styled-media-query: No valid breakpoint or size specified for media.',
  );
  return '0';
};
