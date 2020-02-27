import { css } from 'styled-components';

export const size: { [key: string]: number } = {
  desktop: 1024,
  tablet: 768,
  mobile: 680,
};

export const clearfix = css`
  &::after {
    clear: both;
    content: '';
    display: block;
  }
`;

export const media = {
  desktop: (...args) => css`
    @media (min-width: ${size.tablet + 1}px) {
      ${css.call(null, ...args)}
    }
  `,
  mobile: (...args) => css`
    @media (max-width: ${size.mobile}px) {
      ${css.call(null, ...args)}
    }
  `,
  tablet: (...args) => css`
    @media (min-width: ${size.mobile + 1}px) and (max-width: ${size.tablet}px) {
      ${css.call(null, ...args)}
    }
  `,
};
