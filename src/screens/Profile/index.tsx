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
import {useContext, useState} from 'react';
import {Switch} from 'react-native-switch';
import BasicHeader from '../../components/BasicHeader';
import {AuthContext} from '../../contexts/AuthContext';

function Profile({navigation}: any) {
  const {user} = useContext(AuthContext);
  const [photo, setPhoto] = useState<string>(
    'https://zinnyfactor.com/wp-content/uploads/2020/04/93-938050_png-file-transparent-white-user-icon-png-download.jpg',
  );
  const [notification, setNotification] = useState<boolean>(true);

  return (
    <VStack flex={1} bg="#DCF7E3" justifyContent={'flex-start'} paddingX={6}>
      <BasicHeader navigation={navigation} name="Perfil" menu={true} />
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
            <Text
              fontFamily={'Roboto-Regular'}
              fontSize={'14px'}
              color={'#0A211799'}>
              {user?.username}
            </Text>
          </VStack>
          <VStack w="100%" space={4}>
            <VStack>
              <Text
                fontFamily={'Roboto-Regular'}
                fontSize={'14px'}
                color={'#0A211799'}>
                CPF
              </Text>
              <Text
                fontFamily={'Roboto-Regular'}
                fontSize={'17px'}
                color={'#0A2117'}>
                {user?.cpf}
              </Text>
            </VStack>
            <VStack>
              <Text
                fontFamily={'Roboto-Regular'}
                fontSize={'14px'}
                color={'#0A211799'}>
                Perfil
              </Text>
              <Text
                fontFamily={'Roboto-Regular'}
                fontSize={'17px'}
                color={'#0A2117'}>
                {user?.type}
              </Text>
            </VStack>
            <VStack>
              <Text
                fontFamily={'Roboto-Regular'}
                fontSize={'14px'}
                color={'#0A211799'}>
                Telefone
              </Text>
              <Text
                fontFamily={'Roboto-Regular'}
                fontSize={'17px'}
                color={'#0A2117'}>
                {user?.phone}
              </Text>
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
            <Text
              fontFamily={'Roboto-Regular'}
              fontSize={'17px'}
              color={'#0A2117'}>
              Notificações
            </Text>
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
                <Text
                  color={'#0A2117'}
                  fontSize={'17px'}
                  fontWeight={'semibold'}
                  fontFamily="Roboto-Bold">
                  Política de Privacidade
                </Text>
              </VStack>
            </Button>
          </VStack>

          <VStack w="100%" alignItems={'center'}>
            <Button
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
                <Text
                  color={'#0A2117'}
                  fontSize={'17px'}
                  fontWeight={'semibold'}
                  fontFamily="Roboto-Bold">
                  Termos de Uso
                </Text>
              </VStack>
            </Button>
          </VStack>
        </VStack>
      </ScrollView>
    </VStack>
  );
}

export default Profile;
