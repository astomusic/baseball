import { createGlobalStyle } from 'styled-components';

import Light from 'fonts/Graphik-300-Light.otf';
import Regular from 'fonts/Graphik-400-Regular.otf';
import Medium from 'fonts/Graphik-500-Medium.otf';
import Bold from 'fonts/Graphik-700-Bold.otf';

import colors from './colors';

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Graphik';
    src: url(${Light}) format('truetype');
    font-weight: 300;
  }

  @font-face {
    font-family: 'Graphik';
    src: url(${Regular}) format('truetype');
    font-weight: 400;
  }

  @font-face {
    font-family: 'Graphik';
    src: url(${Medium}) format('truetype');
    font-weight: 500;
  }

  @font-face {
    font-family: 'Graphik';
    src: url(${Bold}) format('truetype');
    font-weight: 700;
  }

  /* http://meyerweb.com/eric/tools/css/reset/ v2.0 */
  * {
    font-family: 'Heebo', 'Graphik', sans-serif;
    &::selection {
    background-color: ${colors.mint};
    color: ${colors.white};
  }
  }

  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed, 
  figure, figcaption, footer, header, hgroup, 
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video, input, textarea {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 10px;
    vertical-align: baseline;
    font-weight: 300;
    scroll-behavior: smooth;
  }
  article, aside, details, figcaption, figure, 
  footer, header, hgroup, menu, nav, section {
    display: block;
  }
  body {
    line-height: 1;
    background-color: #f2f2f3;
  }
  ol, ul, li {
    list-style: none;
  }
  blockquote, q {
    quotes: none;
  }
  blockquote:before, blockquote:after,
  q:before, q:after {
    content: '';
    content: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  a {
    user-select: none;
    color: inherit;
    text-decoration: inherit;
  }
  *:focus {
    outline:none
  }
`;

export default GlobalStyle;
