/* eslint-disable react/react-in-jsx-scope */
import {VStack, HStack, Text} from 'native-base';
import Feather from 'react-native-vector-icons/Feather';

function Header({username}: any) {
  return (
    <VStack w={'100%'} h={160} p={4}>
      <HStack w={'100%'} justifyContent="flex-end" paddingRight={2}>
        <Feather name={'user'} color={'#DCF7E3'} size={25} />
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
