/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import {
  Button,
  Divider,
  HStack,
  Image,
  ScrollView,
  Text,
  VStack,
} from 'native-base';
import {useContext, useEffect, useState} from 'react';

import Modal from 'react-native-modal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Switch} from 'react-native-switch';
import BasicHeader from '../../components/BasicHeader';
import {AuthContext} from '../../contexts/AuthContext';
import BasicText from '../../components/BasicText';
import {api} from '../../service/api';

function Profile({navigation}: any) {
  const {user, signOut} = useContext(AuthContext);
  const [photo, setPhoto] = useState<string | undefined>(user?.photo);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [notification, setNotification] = useState<boolean>(true);
  useEffect(() => {
    setPhoto(user?.photo);
  }, [user]);

  return (
    <VStack flex={1} bg="#DCF7E3" justifyContent={'flex-start'} paddingX={6}>
      <BasicHeader
        navigation={navigation}
        name="Perfil"
        menu={true}
        functionOption={() => setShowModal(true)}
      />
      <ScrollView flex={1} w="100%" showsVerticalScrollIndicator={false}>
        <VStack flex={1} space={4} alignItems="center">
          <Image
            source={{uri: photo}}
            alt="profile image"
            w={140}
            h={140}
            borderRadius={75}
            onError={() =>
              setPhoto(
                'https://zinnyfactor.com/wp-content/uploads/2020/04/93-938050_png-file-transparent-white-user-icon-png-download.jpg',
              )
            }
          />
          <VStack alignItems={'center'}>
            <Text
              fontFamily={'IBMPlexSans-Regular'}
              fontSize={23}
              color={'#0A2117'}>
              {user?.name}
            </Text>
            <BasicText theme="dark" size={14} opacity={0.6}>
              {user?.username}
            </BasicText>
          </VStack>
          <VStack w="100%" space={4}>
            <VStack>
              <BasicText theme="dark" size={14} opacity={0.6}>
                CPF
              </BasicText>
              <BasicText theme="dark">{user?.cpf}</BasicText>
            </VStack>
            <VStack>
              <BasicText theme="dark" size={14} opacity={0.6}>
                Perfil
              </BasicText>
              <BasicText theme="dark">{user?.type}</BasicText>
            </VStack>
            <VStack>
              <BasicText theme="dark" size={14} opacity={0.6}>
                Telefone
              </BasicText>
              <BasicText theme="dark">{user?.phone}</BasicText>
            </VStack>
          </VStack>

          <HStack w="100%" space={6} alignItems="center" marginTop={8}>
            <Text
              color={'#018749'}
              fontSize="15px"
              fontFamily={'IBMPlexSans-SemiBold'}
              fontWeight="semibold">
              CONFIGURAÇÕES
            </Text>
            <Divider />
          </HStack>

          <HStack w="100%" justifyContent={'space-between'} p={2} pl={0}>
            <BasicText theme="dark">Notificações</BasicText>
            <Switch
              circleActiveColor="#0A2117"
              circleInActiveColor="#6AF3B4"
              backgroundInactive="#0A2117"
              backgroundActive="#6AF3B4"
              circleSize={24}
              barHeight={25}
              value={notification}
              onValueChange={() => setNotification(!notification)}
              activeText=""
              inActiveText=""
            />
          </HStack>
        </VStack>

        <HStack w="100%" space={6} alignItems="center" marginTop={8}>
          <Text
            color={'#018749'}
            fontSize="15px"
            fontFamily={'IBMPlexSans-SemiBold'}
            fontWeight="semibold">
            INFORMAÇÕES
          </Text>
          <Divider />
        </HStack>
        <VStack p={6}>
          <VStack w="100%" alignItems={'center'}>
            <Button
              onPress={() => navigation.navigate('Policy')}
              bg="#DCF7E3"
              _pressed={{
                bg: '#d0ead700',
              }}>
              <VStack
                paddingX={4}
                paddingY={1}
                borderRadius={24}
                borderColor={'#0A2117'}
                borderWidth={1}>
                <BasicText theme="dark" fontWeight={'medium'}>
                  Política de Privacidade
                </BasicText>
              </VStack>
            </Button>
          </VStack>

          <VStack w="100%" alignItems={'center'}>
            <Button
              onPress={() => navigation.navigate('TermsOfUse')}
              bg="#DCF7E3"
              _pressed={{
                bg: '#d0ead700',
              }}>
              <VStack
                paddingX={4}
                paddingY={1}
                borderRadius={24}
                borderColor={'#0A2117'}
                borderWidth={1}>
                <BasicText theme="dark" fontWeight={'medium'}>
                  Termos de Uso
                </BasicText>
              </VStack>
            </Button>
          </VStack>
        </VStack>
      </ScrollView>
      <Modal
        isVisible={showModal}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <VStack
          w={'90%'}
          h={'65%'}
          bg="#DCF7E3"
          borderRadius={25}
          padding={6}
          space={4}
          alignItems="center"
          justifyContent={'center'}>
          <VStack alignItems="center" justifyContent={'center'} space={2}>
            <MaterialCommunityIcons
              name={'alert-outline'}
              color={'#0A2117'}
              size={40}
            />
            <Text
              fontSize={'32px'}
              color={'#0A2117'}
              fontFamily={'IBMPlexSans-Regular'}
              textAlign="center">
              Atenção!
            </Text>
          </VStack>
          <BasicText theme="dark" textAlign="center">
            Tem certeza que deseja excluir sua conta? Todos os seus dados
            cadastrados no Stribo, incluindo as propriedades, animais e
            controles financeiros, entre outros, serão permanentemente excluídos
            do nosso sistema. Proceda com cautela.
          </BasicText>
          <Button
            h={'50px'}
            w={'100%'}
            borderRadius={24}
            bg="#FFA28D"
            mt={4}
            onPress={() => {
              setShowModal(false);
              api.delete(`user/${user?.id}`);
              signOut();
            }}
            _pressed={{
              bg: '#E75535',
            }}>
            <HStack space={2}>
              <MaterialCommunityIcons
                name={'trash-can-outline'}
                color={'#0A2117'}
                size={25}
              />
              <BasicText theme="dark" fontWeight={'medium'}>
                Excluir conta
              </BasicText>
            </HStack>
          </Button>

          <Button
            h={'50px'}
            w={'100%'}
            borderRadius={24}
            bg="transparent"
            borderColor="#0A2117"
            borderWidth={1}
            onPress={() => {
              setShowModal(false);
            }}
            _pressed={{
              bg: '#d0ead7',
            }}>
            <BasicText theme="dark" fontWeight={'bold'}>
              Voltar
            </BasicText>
          </Button>
        </VStack>
      </Modal>
    </VStack>
  );
}

export default Profile;
