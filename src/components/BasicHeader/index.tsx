/* eslint-disable react/react-in-jsx-scope */
import {HStack, Pressable, Text} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

type BasicHeaderProps = {
  navigation: any;
  notification: boolean;
  showModal: () => void;
};

function BasicHeader({navigation, notification, showModal}: BasicHeaderProps) {
  return (
    <HStack
      w={'100%'}
      alignItems={'center'}
      justifyContent={'space-between'}
      mb={8}>
      <HStack space={8} alignItems="center">
        <Pressable onPress={() => navigation.goBack()} padding={0}>
          <MaterialIcons name={'arrow-back'} color={'#0A2117'} size={26} />
        </Pressable>
        <Text
          fontFamily={'IBMPlexSans-Regular'}
          fontSize={23}
          color={'#0A2117'}>
          Notificaçoes
        </Text>
      </HStack>
      {notification ? (
        <Pressable onPress={showModal}>
          <MaterialCommunityIcons
            name={'bell-check-outline'}
            color={'#0A2117'}
            size={26}
          />
        </Pressable>
      ) : (
        <></>
      )}
    </HStack>
  );
}

export default BasicHeader;
