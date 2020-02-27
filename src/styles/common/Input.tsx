import React, { useState } from 'react';
import styled from 'styled-components';

import { Caption } from 'src/styles/common/Typography';
import { media } from 'src/styles/style';
import colors from '../colors';

interface InputProps {
  error?: boolean;
  right?: boolean;
  label?: string;
  hasDot?: boolean;
  placeholder?: string;
  value?: string;
  margin?: string;
  type?: string;
  autocomplete?: string;
  width?: string;
  disabled?: boolean;
  handler?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLElement>) => void;
}

interface StateProps {
  hasDot?: boolean;
  color?: string;
  error?: boolean;
  right?: boolean;
  margin?: string;
  disabled?: boolean;
}

const Label = styled(Caption)`
  display: block;
  text-align: left;
  margin-bottom: 8px;
`;

const InputWrapper = styled.div<InputProps>`
  position: relative;
  ${({ width }) => width && `width:${width}`};
`;

const Dot = styled.span<StateProps>`
  position: absolute;
  top: 24px;
  left: 15px;
  height: 5px;
  width: 5px;
  background-color: ${props => getStateColor(props)};
  border-radius: 50%;
  display: inline-block;
`;

const StyledInput = styled.input<StateProps>`
  width: ${({ hasDot }) => (hasDot ? 'calc(100% - 64px)' : 'calc(100% - 34px)')};
  border-radius: 2px;
  border: solid 1px;
  border-color: ${props => getStateColor(props)};
  background-color: ${({ error, disabled }) => (error ? '#fff5f8' : disabled ? '#ccc' : '#fff')};
  font-size: 16px;
  padding: ${({ hasDot }) => (hasDot ? '16px 32px' : '16px 16px')};
  ${({ margin }) => margin && `margin: ${margin}`};
  &::placeholder {
    color: ${colors.gray};
  }
  ${media.mobile`
    padding: ${({ hasDot }) => (hasDot ? '14px 30px' : '14px 14px')};
  `}
`;

const StyledTextArea = styled.textarea<StateProps>`
  width: ${({ hasDot }) => (hasDot ? 'calc(100% - 64px)' : 'calc(100% - 34px)')};
  min-height: 160px;
  border-radius: 2px;
  border: solid 1px;
  border-color: ${props => getStateColor(props)};
  background-color: ${({ error }) => (error ? '#fff5f8' : '#fff')};
  font-size: 16px;
  padding: ${({ hasDot }) => (hasDot ? '16px 32px' : '16px 16px')};
  ${({ margin }) => margin && `margin: ${margin}`};
  &::placeholder {
    color: ${colors.gray};
  }
  ${media.mobile`
    padding: ${({ hasDot }) => (hasDot ? '14px 30px' : '14px 14px')};
  `}
`;

const getStateColor = (props: StateProps) => {
  const { color, error, right } = props;
  if (error) {
    return '#ff4581';
  }

  if (right) {
    return '#8cd46b';
  }

  return color;
};

const TextInput = (props: InputProps) => {
  const {
    autocomplete,
    error,
    right,
    label,
    placeholder,
    value,
    handler,
    hasDot,
    margin,
    type,
    width,
    onFocus,
    onBlur,
    onKeyPress,
    disabled,
  } = props;
  const [done, setDone] = useState(false);
  const [dotColor, setDotColor] = useState(colors.gray);
  const [borderColor, setBorderColor] = useState('#f2f2f3');

  const handleFocus = () => {
    setDotColor(colors.mint);
    setBorderColor(colors.mint);
    if (onFocus) {
      onFocus();
    }
  };

  const handleBlur = () => {
    if (done) {
      setDotColor(colors.black);
    } else {
      setDotColor(colors.gray);
    }
    setBorderColor('#f2f2f3');
    if (onBlur) {
      onBlur();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: targetValue } = e.currentTarget;
    if (!!targetValue) {
      setDone(true);
    } else {
      setDone(false);
    }
    handler(targetValue);
  };

  return (
    <React.Fragment>
      {label && <Label color={'black'}>{props.label}</Label>}
      <InputWrapper width={width}>
        {hasDot && <Dot color={dotColor} error={error} right={right} />}
        <StyledInput
          type={type}
          autoComplete={autocomplete}
          onChange={handleChange}
          color={borderColor}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyPress={onKeyPress}
          placeholder={placeholder}
          hasDot={hasDot}
          error={error}
          right={right}
          value={value}
          margin={margin}
          disabled={disabled}
        />
      </InputWrapper>
    </React.Fragment>
  );
};

const TextArea = (props: InputProps) => {
  const { error, right, label, placeholder, value, handler, hasDot, margin } = props;
  const [done, setDone] = useState(false);
  const [dotColor, setDotColor] = useState(colors.gray);
  const [borderColor, setBorderColor] = useState('#f2f2f3');

  const handleFocus = () => {
    setDotColor(colors.mint);
    setBorderColor(colors.mint);
  };

  const handleBlur = () => {
    if (done) {
      setDotColor(colors.black);
    } else {
      setDotColor(colors.gray);
    }
    setBorderColor('#f2f2f3');
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value: targetValue } = e.currentTarget;
    if (!!targetValue) {
      setDone(true);
    } else {
      setDone(false);
    }
    handler(targetValue);
  };

  return (
    <React.Fragment>
      {label && <Label color={'black'}>{props.label}</Label>}
      <InputWrapper>
        {hasDot && <Dot color={dotColor} error={error} right={right} />}
        <StyledTextArea
          onChange={handleChange}
          color={borderColor}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          error={error}
          right={right}
          value={value}
          margin={margin}
        />
      </InputWrapper>
    </React.Fragment>
  );
};

export { TextInput, TextArea };
