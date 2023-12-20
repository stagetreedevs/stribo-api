/* eslint-disable react-hooks/exhaustive-deps */
import {Select, CheckIcon} from 'native-base';
import React, {useEffect, useRef} from 'react';
import {Animated, Easing, StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
type Props = {
  label: string;
  disable?: boolean;
  titleActiveSize?: number;
  titleInActiveSize?: number;
  titleActiveColor?: string;
  titleInactiveColor?: string;
  itens: {
    label: string;
    value: string;
  }[];
  itemSelected: string | undefined;
  onChange: (value: string) => void;
};

const BasicSelect = ({
  label,
  disable = false,
  titleActiveSize = 14,
  titleInActiveSize = 16,
  titleActiveColor = '#0A2117',
  titleInactiveColor = '#0A211799',
  onChange,
  itens,
  itemSelected,
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
    if (!itemSelected) {
      Animated.timing(animatedValue?.current, {
        toValue: 0,
        duration: 500,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        useNativeDriver: false,
      }).start();
    }
  };
  useEffect(() => {
    if (itemSelected) {
      onFocus();
    } else {
      onBlur();
    }
  }, [itemSelected]);
  return (
    <Animated.View style={[styles.subContainer, viewStyles]}>
      <Animated.Text style={[returnAnimatedTitleStyles]}>{label}</Animated.Text>
      <Select
        selectedValue={itemSelected}
        accessibilityLabel="Categoria"
        borderColor="#0A21171A"
        variant="unstyled"
        mt={-3}
        mb={2}
        p={0}
        px={0.25}
        isDisabled={disable}
        _disabled={{
          backgroundColor: '#DCF7E3',
        }}
        dropdownIcon={
          <MaterialCommunityIcons
            name={'chevron-down'}
            color={'#0A2117'}
            size={24}
          />
        }
        fontSize={17}
        onValueChange={itemValue => onChange(itemValue)}
        _selectedItem={{
          endIcon: <CheckIcon size={4} />,
        }}>
        {itens.map((item, index) => (
          <Select.Item key={index} label={item.label} value={item.value} />
        ))}
      </Select>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  subContainer: {},
  textStyle: {
    paddingBottom: 16,
    fontFamily: 'Roboto-Regular',
    fontWeight: 'normal',
    color: '#0A2117',
    fontSize: 17,
  },
});

export default BasicSelect;
