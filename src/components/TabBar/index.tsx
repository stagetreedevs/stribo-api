/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import {HStack, Pressable} from 'native-base';
import {useState} from 'react';
import {SafeAreaView} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

function TabBar({state, navigation, descriptors, ...props}: any) {
  const [notification, setNotification] = useState<boolean>(true);

  return (
    <SafeAreaView
      style={{
        width: '100%',
        height: 60,
        paddingHorizontal: 6,
      }}>
      <HStack
        w={'100%'}
        h="100%"
        justifyContent={'space-evenly'}
        alignItems={'center'}
        backgroundColor="#DCF7E3">
        {state.routes.map((route: any, index: number) => {
          const {options} = descriptors[route.key];

          let iconName: string = '';
          if (route.name === 'HomePage') {
            iconName = 'home-variant-outline';
          } else if (route.name === 'PropertsPage') {
            iconName = 'gate';
          } else if (route.name === 'Tab2') {
            iconName = 'horse-variant';
          } else if (route.name === 'Tab3') {
            iconName = 'handshake-outline';
          } else if (route.name === 'Tab4') {
            iconName = 'currency-usd';
          }
          const isFocused = state.index === index;
          const onPress = (name: string) => {
            //console.log(route.name);
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              console.log('Rota => ', name);
              navigation.navigate(name);
              if (name === 'Tab2') {
                setNotification(false);
              } else {
                setNotification(true);
              }
            }
          };
          return (
            <Pressable
              w={16}
              h={'40px'}
              alignItems={'center'}
              justifyContent={'center'}
              borderWidth={isFocused ? 0.5 : 0}
              borderRadius={25}
              key={index}
              onPress={() => onPress(route.name)}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}>
              {notification && route.name === 'Tab2' && (
                <MaterialCommunityIcons
                  name={'checkbox-blank-circle'}
                  size={6}
                  color={'red'}
                  style={{
                    marginTop: -6,
                  }}
                />
              )}
              <MaterialCommunityIcons
                name={iconName}
                size={25}
                color={'#0A2117'}
                style={{
                  marginTop: 4,
                }}
              />
            </Pressable>
          );
        })}
      </HStack>
    </SafeAreaView>
  );
}

export default TabBar;
