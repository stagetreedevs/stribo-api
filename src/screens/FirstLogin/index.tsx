/* eslint-disable react/react-in-jsx-scope */
import {
  StatusBar,
  VStack,
  Text,
  Input,
  Icon,
  Pressable,
  ScrollView,
  Button,
  HStack,
} from 'native-base';
import {useContext, useState} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import Logo from '../../../assets/striboLogo.svg';
import BasicText from '../../components/BasicText';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {AuthContext} from '../../contexts/AuthContext';
function FirstLogin() {
  const {register} = useContext(AuthContext);

  const [show, setShow] = useState(true);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  async function handleSignIn(google: boolean) {
    if (google) {
      await GoogleSignin.hasPlayServices();
      const {user} = await GoogleSignin.signIn();
      console.log(user);
      return register(user.givenName as string, user.id);
    }
    if (name === '') {
      return Toast.show({
        type: 'error',
        text1: 'Campo de Nome Vazio!',
        text2: 'Confira os dados e tente Novamente!',
      });
    }
    if (password === '') {
      return Toast.show({
        type: 'error',
        text1: 'Senha Vazio!',
        text2: 'Confira os dados e tente Novamente!',
      });
    }
    try {
      register(name, password);
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Email ou senha incorretos',
        text2: 'Confira os dados e tente Novamente!',
      });
    } finally {
      setShow(true);
    }
  }

  return (
    <VStack
      flex={1}
      bg="#0A2117"
      justifyContent={'flex-end'}
      alignItems="center">
      <StatusBar backgroundColor={'#0A2117'} barStyle="light-content" />
      <Logo width={300} height={200} />
      <VStack
        bg={'#DCF7E3'}
        h="75%"
        w="100%"
        borderTopRadius={25}
        paddingX={6}
        paddingY={8}>
        <ScrollView flex={1}>
          <VStack flex={1} w="100%" alignItems="center" space={4}>
            <VStack w={'100%'} pr={4} space={4}>
              <Text
                fontSize={'23px'}
                fontFamily="IBMPlexSans-Bold"
                fontWeight={'medium'}>
                Bem-vindo(a)!
              </Text>
              <BasicText size={14} theme="dark">
                Estamos quase lá. Agora só falta você informar alguns dados. Se
                preferir, você pode vincular seu cadastro à sua conta do Google.
                Nesse caso, não precisa preencher os campos abaixo.
              </BasicText>
            </VStack>
            <Input
              size={'lg'}
              height={'48px'}
              type="text"
              placeholder="Seu nome"
              placeholderTextColor={'dark.400'}
              borderColor={'dark.400'}
              mb={2}
              variant={'underlined'}
              _focus={{
                borderColor: '#202020',
              }}
              onChangeText={text => setName(text)}
            />
            <Input
              size={'lg'}
              height={'48px'}
              variant={'underlined'}
              placeholder="Defina sua senha"
              placeholderTextColor={'dark.400'}
              borderColor={'dark.400'}
              type={show ? 'password' : 'text'}
              InputRightElement={
                <Pressable
                  marginX={4}
                  marginY={0}
                  onPress={() => setShow(!show)}>
                  <Icon
                    as={
                      <MaterialCommunityIcons
                        name={show ? 'eye-outline' : 'eye-off-outline'}
                      />
                    }
                    color={'#0A2117'}
                    size={6}
                  />
                </Pressable>
              }
              _focus={{
                borderColor: '#202020',
              }}
              onChangeText={text => setPassword(text)}
            />
            <VStack marginY={2} w="100%" space={8}>
              <Button
                h={'50px'}
                borderRadius={24}
                bg="#0A2117"
                onPress={() => handleSignIn(false)}>
                <HStack flex={1} space={4}>
                  <Icon
                    as={<MaterialIcons name={'done'} />}
                    color={'#DCF7E3'}
                    size={6}
                  />
                  <BasicText theme="light" fontWeight={'bold'}>
                    Concluir Cadastro
                  </BasicText>
                </HStack>
              </Button>
              <Button
                h={'50px'}
                borderRadius={24}
                bg="#DCF7E3"
                borderColor={'#0A2117'}
                borderWidth={1}
                onPress={() => handleSignIn(true)}
                _pressed={{
                  bg: '#d0ead7',
                }}>
                <HStack flex={1} space={4}>
                  <Icon
                    as={<MaterialCommunityIcons name={'google'} />}
                    color={'#0A2117'}
                    size={6}
                  />
                  <BasicText theme="dark" fontWeight={'medium'}>
                    Continuar com o Google
                  </BasicText>
                </HStack>
              </Button>
            </VStack>
          </VStack>
        </ScrollView>
      </VStack>
    </VStack>
  );
}

export default FirstLogin;
