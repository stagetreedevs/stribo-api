import {ITextProps, Text} from 'native-base';
import React from 'react';
interface BasicTextProps extends ITextProps {
  children: string | undefined | React.ReactNode;
  theme: string;
  fontWeight?: string;
  size?: number;
  opacity?: number;
}

function BasicText({
  children,
  theme,
  fontWeight = 'regular',
  size = 17,
  opacity = 1,
  ...props
}: BasicTextProps) {
  return (
    <Text
      fontSize={size}
      color={
        theme === 'dark' ? '#0A2117' : theme === 'light' ? '#DCF7E3' : theme
      }
      fontFamily={`Roboto-${
        fontWeight[0].toUpperCase() + fontWeight.substring(1)
      }`}
      fontWeight={fontWeight}
      opacity={opacity}
      {...props}>
      {children}
    </Text>
  );
}

export default BasicText;
