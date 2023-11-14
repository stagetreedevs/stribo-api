/* eslint-disable react/react-in-jsx-scope */
import {VStack, HStack, Text, Pressable} from 'native-base';
import Feather from 'react-native-vector-icons/Feather';
type Props = {
  navigation: any;
  username: string;
};

function Header({navigation, username}: Props) {
  return (
    <VStack w={'100%'} h={160} p={4}>
      <HStack w={'100%'} justifyContent="flex-end" paddingRight={2}>
        <Pressable onPress={() => navigation.navigate('Profile')}>
          <Feather name={'user'} color={'#DCF7E3'} size={25} />
        </Pressable>
      </HStack>
      <Text
        marginY={8}
        fontSize={'40px'}
        color={'#DCF7E3'}
        fontFamily={'IBMPlexSans-Regular'}
        fontWeight={'normal'}>
        Olá, {username}!
      </Text>
    </VStack>
  );
}

export default Header;
