import styled from 'styled-components';

import colors from '../colors';

type ButtonTheme = 'mint' | 'black';

interface ButtonProps {
  theme: ButtonTheme;
  solid?: boolean;
  small?: boolean;
  margin?: string;
  width?: string;
  borderRadius?: string;
  slim?: boolean;
}

const Button = styled.button<ButtonProps>`
  border-style: solid;
  border-radius: ${({ borderRadius }) => (borderRadius ? `${borderRadius}` : '32px')};
  user-select: none;
  padding: 10px 20px;
  font-size: 16px;
  line-height: 1.43;
  letter-spacing: -0.5px;
  border-width: 2px;
  border-color: ${colors.mint};
  color: ${colors.mint};
  font-weight: 500;
  transition: 0.15s ease-in;
  background-color: transparent;
  margin: ${({ margin }) => (margin ? margin : '0')};
  ${({ width }) => width && `width: ${width}`};
  cursor: pointer;
  &:hover {
    color: ${colors.white};
    background-color: ${colors.mint};
  }
  &:disabled {
    cursor: not-allowed;
    border-color: ${colors.gray};
    color: ${colors.gray};
    background-color: transparent;
  }
`;

export default Button;
