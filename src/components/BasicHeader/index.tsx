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
import BasicText from '../BasicText';
import {useContext} from 'react';
import {AuthContext} from '../../contexts/AuthContext';

type BasicHeaderProps = {
  navigation: any;
  name: string;
  notification?: boolean;
  menu?: boolean;
  menuType?: string;
  showModal?: () => void;
  functionOption?: () => void;
  goBack?: () => void;
};
type MenuProps = {
  navigation: any;
  functionOption?: () => void;
  type?: string;
};

const SimpleMenu = ({functionOption, navigation, type}: MenuProps) => {
  const {signOut} = useContext(AuthContext);

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
        {type === 'profile' ? (
          <>
            <MenuOption onSelect={() => navigation.navigate('EditProfile')}>
              <HStack space={3} mr={4} alignItems="center">
                <MaterialCommunityIcons
                  name={'pencil-outline'}
                  color={'#0A2117'}
                  size={22}
                />
                <BasicText size={16} theme="dark">
                  Editar dados
                </BasicText>
              </HStack>
            </MenuOption>
            <MenuOption onSelect={() => navigation.navigate('EditPassword')}>
              <HStack space={3} mr={4} alignItems="center">
                <MaterialCommunityIcons
                  name={'form-textbox-password'}
                  color={'#0A2117'}
                  size={22}
                />
                <BasicText size={16} theme="dark">
                  Alterar senha
                </BasicText>
              </HStack>
            </MenuOption>
            <MenuOption onSelect={signOut}>
              <HStack space={3} mr={4} alignItems="center">
                <MaterialCommunityIcons
                  name={'arrow-expand-left'}
                  color={'#E75535'}
                  size={22}
                />
                <BasicText size={16} theme="#E75535">
                  Sair da Conta
                </BasicText>
              </HStack>
            </MenuOption>
            <MenuOption onSelect={functionOption}>
              <HStack space={3} mr={4} alignItems="center">
                <MaterialCommunityIcons
                  name={'trash-can-outline'}
                  color={'#E75535'}
                  size={22}
                />
                <BasicText size={16} theme="#E75535">
                  Excluir Conta
                </BasicText>
              </HStack>
            </MenuOption>
          </>
        ) : (
          <MenuOption onSelect={functionOption}>
            <HStack space={3} mr={4} alignItems="center">
              <MaterialCommunityIcons
                name={'trash-can-outline'}
                color={'#E75535'}
                size={22}
              />
              <BasicText size={16} theme="#E75535">
                Excluir
              </BasicText>
            </HStack>
          </MenuOption>
        )}
      </MenuOptions>
    </Menu>
  );
};

function BasicHeader({
  navigation,
  name,
  notification,
  menu,
  menuType = 'profile',
  showModal,
  functionOption,
  goBack = () => navigation.goBack(),
}: BasicHeaderProps) {
  return (
    <HStack
      w={'100%'}
      alignItems={'center'}
      justifyContent={'space-between'}
      mb={4}>
      <HStack space={8} alignItems="center">
        <Pressable onPress={goBack} padding={0}>
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
          <SimpleMenu
            navigation={navigation}
            functionOption={functionOption}
            type={menuType}
          />
        </HStack>
      ) : (
        <></>
      )}
    </HStack>
  );
}

export default BasicHeader;
