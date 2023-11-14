/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import {HStack, Pressable, Text} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import {Alert} from 'react-native';

type BasicHeaderProps = {
  navigation: any;
  name: string;
  notification?: boolean;
  menu?: boolean;
  showModal?: () => void;
};

const SimpleMenu = () => {
  return (
    <Menu
      style={{
        flex: 1,
      }}>
      <MenuTrigger>
        <MaterialCommunityIcons
          name={'dots-vertical'}
          color={'#0A2117'}
          size={26}
        />
      </MenuTrigger>
      <MenuOptions
        customStyles={{
          optionsContainer: {
            backgroundColor: '#DCF7E3',
            borderRadius: 16,
            padding: 8,
            paddingHorizontal: 12,
            width: 'auto',
          },
        }}>
        <MenuOption onSelect={() => Alert.alert('Delete')}>
          <HStack space={3} mr={4} alignItems="center">
            <MaterialCommunityIcons
              name={'pencil-outline'}
              color={'#0A2117'}
              size={22}
            />
            <Text
              fontSize={'16px'}
              color={'#0A2117'}
              fontWeight={340}
              fontFamily={'Roboto-Regular'}>
              Editar dados
            </Text>
          </HStack>
        </MenuOption>
        <MenuOption onSelect={() => Alert.alert('Delete')}>
          <HStack space={3} mr={4} alignItems="center">
            <MaterialCommunityIcons
              name={'form-textbox-password'}
              color={'#0A2117'}
              size={22}
            />
            <Text
              fontSize={'16px'}
              color={'#0A2117'}
              fontWeight={340}
              fontFamily={'Roboto-Regular'}>
              Alterar senha
            </Text>
          </HStack>
        </MenuOption>
        <MenuOption onSelect={() => Alert.alert('Delete')}>
          <HStack space={3} mr={4} alignItems="center">
            <MaterialCommunityIcons
              name={'trash-can-outline'}
              color={'#E75535'}
              size={22}
            />
            <Text
              fontSize={'16px'}
              color={'#E75535'}
              fontWeight={340}
              fontFamily={'Roboto-Regular'}>
              Excluir Conta
            </Text>
          </HStack>
        </MenuOption>
      </MenuOptions>
    </Menu>
  );
};

function BasicHeader({
  navigation,
  name,
  notification,
  menu,
  showModal,
}: BasicHeaderProps) {
  return (
    <HStack
      w={'100%'}
      alignItems={'center'}
      justifyContent={'space-between'}
      mb={4}>
      <HStack space={8} alignItems="center">
        <Pressable onPress={() => navigation.goBack()} padding={0}>
          <MaterialIcons name={'arrow-back'} color={'#0A2117'} size={26} />
        </Pressable>
        <Text
          fontFamily={'IBMPlexSans-Regular'}
          fontSize={23}
          color={'#0A2117'}>
          {name}
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
      ) : menu ? (
        <HStack w={30}>
          <SimpleMenu />
        </HStack>
      ) : (
        <></>
      )}
    </HStack>
  );
}

export default BasicHeader;
