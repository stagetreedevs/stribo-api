/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import {
  StatusBar,
  VStack,
  Text,
  Input,
  ScrollView,
  Button,
  HStack,
} from 'native-base';
import Modal from 'react-native-modal';
import {useState} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Send from '../../../assets/send.svg';

import {SafeAreaView} from 'react-native-safe-area-context';
import BasicText from '../../components/BasicText';
import BasicHeader from '../../components/BasicHeader';
function ForgotPassword({navigation}: any) {
  const [showModal, setShowModal] = useState(false);
  return (
    <VStack flex={1} bg="#DCF7E3" justifyContent={'flex-start'} paddingX={6}>
      <StatusBar backgroundColor={'#DCF7E3'} barStyle="dark-content" />
      <SafeAreaView
        style={{
          flex: 1,
        }}>
        <BasicHeader name="Recuperar Senha" navigation={navigation} />
        <ScrollView flex={1}>
          <VStack flex={1}>
            <BasicText theme="dark" marginY={2}>
              Informe abaixo o seu email de cadastro. Se ele estiver em nosso
              banco de dados, enviaremos instruções para você recuperar a senha.
            </BasicText>
            <Input
              size={'lg'}
              height={'48px'}
              variant={'underlined'}
              placeholder="Email Cadastrado"
              placeholderTextColor={'dark.400'}
              borderColor={'dark.400'}
              type={'text'}
              marginY={2}
              _focus={{
                borderColor: '#202020',
              }}
            />
            <Button
              h={'50px'}
              borderRadius={24}
              bg="#0A2117"
              mt={4}
              onPress={() => setShowModal(true)}>
              <HStack
                ml={-4}
                space={2}
                alignItems="center"
                justifyContent={'center'}>
                <Send width={25} height={25} />
                <BasicText theme="light" fontWeight={'bold'}>
                  Enviar
                </BasicText>
              </HStack>
            </Button>
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
            w={'95%'}
            h={'55%'}
            bg="#DCF7E3"
            borderRadius={25}
            padding={6}
            space={4}
            alignItems="center"
            justifyContent={'center'}>
            <VStack alignItems="center" justifyContent={'center'}>
              <MaterialIcons
                name={'done'}
                color={'#0A2117'}
                size={50}
                style={{
                  marginBottom: 8,
                }}
              />
              <Text
                fontSize={'32px'}
                color={'#0A2117'}
                fontFamily={'IBMPlexSans-Regular'}
                textAlign="center">
                Solicitação enviada!
              </Text>
            </VStack>
            <BasicText theme="dark" textAlign="center">
              Caso demore a receber o email, verifique sua caixa de entrada ou
              de spams. Certifique-se também de que o email informado está
              correto e que é cadastrado em nosso app.
            </BasicText>
            <Button
              h={'50px'}
              w={'100%'}
              borderRadius={24}
              bg="#0A2117"
              mt={4}
              onPress={() => {
                setShowModal(false);
                navigation.navigate('LoginPage');
              }}>
              <BasicText theme="light" fontWeight={'bold'}>
                Enviar
              </BasicText>
            </Button>
          </VStack>
        </Modal>
      </SafeAreaView>
    </VStack>
  );
}

export default ForgotPassword;
