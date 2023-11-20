/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import {VStack, HStack, Text, Pressable} from 'native-base';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
type Props = {
  navigation: any;
  username?: string;
  screen?: string;
  home?: boolean;
};

function Header({navigation, username, home, screen}: Props) {
  return (
    <VStack w={'100%'} h={160} p={4}>
      {home ? (
        <HStack w={'100%'} justifyContent="flex-end" paddingRight={2}>
          <Pressable onPress={() => navigation.navigate('Profile')}>
            <Feather name={'user'} color={'#DCF7E3'} size={25} />
          </Pressable>
        </HStack>
      ) : (
        <HStack w={'100%'} justifyContent="space-between" paddingRight={2}>
          <Pressable onPress={() => navigation.goBack()}>
            <MaterialIcons name={'arrow-back'} color={'#DCF7E3'} size={26} />
          </Pressable>
          <HStack space={4}>
            <Pressable
              onPress={() => navigation.navigate('Notifications')}
              alignItems={'center'}
              justifyContent={'center'}>
              <MaterialCommunityIcons
                name={'checkbox-blank-circle'}
                size={6}
                color={'red'}
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 0,
                }}
              />
              <MaterialCommunityIcons
                name={'bell-outline'}
                color={'#DCF7E3'}
                size={25}
              />
            </Pressable>
            <Pressable onPress={() => navigation.navigate('Profile')}>
              <MaterialCommunityIcons
                name={'dots-vertical'}
                color={'#DCF7E3'}
                size={25}
              />
            </Pressable>
          </HStack>
        </HStack>
      )}
      {home ? (
        <Text
          marginY={8}
          fontSize={'40px'}
          color={'#DCF7E3'}
          fontFamily={'IBMPlexSans-Regular'}
          fontWeight={'normal'}>
          Olá, {username}!
        </Text>
      ) : (
        <Text
          marginY={8}
          fontSize={'40px'}
          color={'#DCF7E3'}
          fontFamily={'IBMPlexSans-Regular'}
          fontWeight={'normal'}>
          {screen}
        </Text>
      )}
    </VStack>
  );
}

export default Header;
