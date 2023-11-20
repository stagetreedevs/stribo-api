import React, {useRef} from 'react';
import {Animated, Easing, TextInput, StyleSheet} from 'react-native';
type Props = {
  label: string;
  titleActiveSize?: number;
  titleInActiveSize?: number;
  titleActiveColor?: string;
  titleInactiveColor?: string;
  text: string;
  onChangeText: (value: string) => void;
};

const BasicInput = ({
  label,
  titleActiveSize = 14,
  titleInActiveSize = 16,
  titleActiveColor = '#0A2117',
  titleInactiveColor = '#0A211799',
  text,
  onChangeText,
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

  return (
    <Animated.View style={[styles.subContainer, viewStyles]}>
      <Animated.Text style={[returnAnimatedTitleStyles]}>{label}</Animated.Text>
      <TextInput
        onChangeText={onChangeText}
        value={text}
        style={styles.textStyle}
        onBlur={onBlur}
        onFocus={onFocus}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  subContainer: {},
  textStyle: {
    paddingBottom: 16,
    fontFamily: 'Roboto-Regular',
    fontWeight: 'normal',
    fontSize: 17,
  },
});

export default BasicInput;
