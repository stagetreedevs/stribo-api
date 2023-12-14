import {Input, Pressable} from 'native-base';
import React, {useEffect, useRef} from 'react';
import {Animated, Easing, StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
type Props = {
  label: string;
  titleActiveSize?: number;
  titleInActiveSize?: number;
  titleActiveColor?: string;
  titleInactiveColor?: string;
  text?: string | undefined;
  type?: string;
  maxLength?: number;
  onChangeText?: (value: string) => void;
  date?: boolean;
  search?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  dateValue?: Date;
};

const BasicInput = ({
  label,
  titleActiveSize = 14,
  titleInActiveSize = 16,
  titleActiveColor = '#0A2117',
  titleInactiveColor = '#0A211799',
  onChangeText,
  onClick,
  text,
  type = 'default',
  maxLength,
  search = false,
  date = false,
  disabled = false,
  dateValue = new Date(),
}: Props) => {
  const animatedValue = useRef(new Animated.Value(0));

  const returnAnimatedTitleStyles = {
    transform: [
      {
        translateY: animatedValue?.current?.interpolate({
          inputRange: [0, 1],
          outputRange: [22, -4],
          extrapolate: 'clamp',
        }),
      },
    ],
    fontSize: animatedValue?.current?.interpolate({
      inputRange: [0, 1],
      outputRange: [titleInActiveSize, titleActiveSize],
      extrapolate: 'clamp',
    }),
    color: animatedValue?.current?.interpolate({
      inputRange: [0, 1],
      outputRange: [titleInactiveColor, titleActiveColor],
    }),
  };

  const viewStyles = {
    borderBottomColor: animatedValue?.current?.interpolate({
      inputRange: [0, 1],
      outputRange: [titleInactiveColor, titleActiveColor],
    }),
    borderBottomWidth: 1,
  };
  const onFocus = () => {
    Animated.timing(animatedValue?.current, {
      toValue: 1,
      duration: 500,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      useNativeDriver: false,
    }).start();
  };

  const onBlur = () => {
    if (!text) {
      Animated.timing(animatedValue?.current, {
        toValue: 0,
        duration: 500,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        useNativeDriver: false,
      }).start();
    }
  };
  useEffect(() => {
    if (text) {
      onFocus();
    } else {
      onBlur();
    }
    if (date && dateValue) {
      onFocus();
    } else {
      onBlur();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, dateValue]);
  return (
    <Animated.View
      style={[disabled ? styles.disable : styles.subContainer, viewStyles]}>
      <Animated.Text style={[returnAnimatedTitleStyles]}>{label}</Animated.Text>
      {date ? (
        <Input
          variant={'unstyled'}
          p={0}
          style={styles.textStyle}
          keyboardType={type === 'default' ? 'default' : 'number-pad'}
          onBlur={onBlur}
          onFocus={onFocus}
          value={dateValue.toLocaleDateString()}
          InputRightElement={
            <Pressable marginX={4} marginBottom={2} onPress={onClick}>
              <MaterialCommunityIcons
                name={'calendar-blank-outline'}
                color={'#0A2117'}
                size={24}
              />
            </Pressable>
          }
          _focus={{
            borderColor: '#0A2117',
          }}
        />
      ) : (
        <Input
          onChangeText={onChangeText}
          value={text}
          keyboardType={type === 'default' ? 'default' : 'number-pad'}
          style={styles.textStyle}
          variant="unstyled"
          p={0}
          maxLength={maxLength ? maxLength : 100}
          onBlur={onBlur}
          onFocus={onFocus}
          isDisabled={disabled}
          InputRightElement={
            search ? (
              <Pressable onPress={onClick}>
                <MaterialCommunityIcons
                  color="#0A2117"
                  name={'magnify'}
                  size={24}
                />
              </Pressable>
            ) : undefined
          }
        />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  subContainer: {},
  disable: {
    opacity: 0.5,
  },
  textStyle: {
    paddingBottom: 16,
    fontFamily: 'Roboto-Regular',
    fontWeight: 'normal',
    color: '#0A2117',
    fontSize: 17,
  },
});

export default BasicInput;
