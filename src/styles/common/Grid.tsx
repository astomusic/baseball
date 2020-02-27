import * as React from 'react';
import styled from 'styled-components';

import colors from '../colors';
import { media } from '../style';

type AvailableColor = 'black' | 'mint' | 'red' | 'gray' | 'white' | string;
type AvailableSize = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

interface GridProps {
  bg?: string;
  color?: string;
  size?: AvailableSize;
  mobile?: number;
  vAlign?: 'stretch' | 'center' | 'start' | 'end';
  align?: 'center' | 'right' | 'left';
  colEnd?: boolean;
  paddingTop?: string;
  paddingBottom?: string;
  marginRight?: boolean;
  height?: string;
  width?: string;
  side?: 'right' | 'left' | 'all';
  bgSize?: string;
  bgPosition?: string;
  mobilePadding?: string;
  mobileHeight?: string;
  direction?: string;
}

const getColor = (color: AvailableColor) => {
  switch (color) {
    case 'black':
      return colors.black;
    case 'mint':
      return colors.mint;
    case 'gray':
      return colors.gray;
    case 'white':
      return colors.white;
    case 'red':
      return colors.red;
    default:
      return color ? color : colors.white;
  }
};

const getSize = (size: AvailableSize, colEnd: boolean, mobile?: number) => {
  if (!size) {
    return `
      flex-basis: auto;
    `;
  }

  if (mobile !== undefined) {
    return `
      flex-basis: ${mobile}px;
    `;
  }

  const fullWidth = 1440;
  const contentWidth = 75;
  const paddingWidth = 45;
  const colEndWidth = size === 12 ? fullWidth : (contentWidth + paddingWidth) * size - paddingWidth;
  const colWidth = (contentWidth + paddingWidth) * size;
  const width = colEnd ? colEndWidth : colWidth;

  return `flex-basis: ${width}px;`;
};

const Container = styled.div<GridProps>`
  width: 100%;
  background-color: ${({ color }) => getColor(color)};
  background-image: url(${({ bg }) => bg});
  background-size: ${({ bgSize }) => (bgSize ? bgSize : 'cover')};
  background-position: ${({ bgPosition }) => (bgPosition ? bgPosition : 'initial')};
  background-repeat: no-repeat;
  position: relative;
`;

const RowStyle = styled.div<GridProps>`
  max-width: 1440px;
  padding: 0 32px;
  margin: 0 auto;
  display: flex;
  flex-direction: ${({ direction }) => (direction ? direction : 'row')};
  ${({ height }) => height && `height: ${height}`};
  justify-content: ${({ align }) => (align ? `${align}` : 'center')};
  ${({ vAlign }) => vAlign && `align-items: ${vAlign}`};
  ${({ paddingTop }) => paddingTop && `padding-top: ${paddingTop}`};
  ${({ paddingBottom }) => paddingBottom && `padding-bottom: ${paddingBottom}`};
  ${media.mobile`
    width: calc(100% - 32px);
    ${({ mobilePadding }) => mobilePadding && `padding: ${mobilePadding}`};
    ${({ mobileHeight }) => mobileHeight && `height: ${mobileHeight}`};
    padding-left: 16px;
    padding-right: 16px;
    ${({ mobile }) => mobile && 'flex-direction: column'};
  `}
`;

type RowProps = GridProps & {
  children: React.ReactNode;
};

const Row = React.memo((props: RowProps) => {
  const { children } = props;
  const count: number = React.Children.count(children) - 1;
  const newChildren = React.Children.map(children, (child: React.ReactElement, index: number) => {
    if (count === index) {
      return React.cloneElement(child, { colEnd: true });
    }
    return child;
  });

  return <RowStyle {...props}>{newChildren}</RowStyle>;
});

const Col = styled.div<GridProps>`
  position: relative;
  box-sizing: border-box;
  flex-grow: 0;
  ${({ align }) => align && `text-align: ${align}`};
  ${({ marginRight }) => marginRight && 'margin-right: 32px'};
  ${({ size, colEnd }) => getSize(size, colEnd)};
  ${({ mobile, colEnd, size }) =>
    mobile !== undefined &&
    media.mobile`
    ${getSize(size, colEnd, mobile)}
  `}
`;

const ProjectContainer = styled.div<GridProps>`
  position: relative;
  width: ${({ width }) => width};
  margin-top: 32px;
`;

const ProjectRow = styled.div<GridProps>`
  width: 100%;
  padding: 0;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  ${({ height }) => `height: ${height}`};
  ${({ align }) => `justify-content: ${align}`};
  ${({ vAlign }) => `align-items: ${vAlign}`};
  ${({ paddingTop }) => `padding-top: ${paddingTop}`};
  ${({ paddingBottom }) => `padding-bottom: ${paddingBottom}`};
`;

const ProjectCol = styled.div<GridProps>`
  position: relative;
  box-sizing: border-box;
  flex-grow: 0;
  ${({ align }) => `text-align: ${align}`};
  ${({ marginRight }) => marginRight && 'margin-right: 32px'};
  width: ${({ side }) => (side === 'left' ? '792px' : side === 'right' ? '248px' : '100%')};
  ${({ side }) => side === 'left' && 'margin-right: 8px'};
  ${({ side }) => side === 'all' && 'margin-bottom: 6px'};
`;

export { Container, Col, Row, ProjectRow, ProjectCol, ProjectContainer };
