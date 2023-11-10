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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import Logo from '../../../assets/striboLogo.svg';
import {AuthContext} from '../../contexts/AuthContext';
function Login({navigation}: any) {
  const [show, setShow] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {signIn} = useContext(AuthContext);

  async function handleSignIn() {
    if (email === '') {
      return Toast.show({
        type: 'error',
        text1: 'Email Vazio!',
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
      await signIn(email, password);
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
          <VStack flex={1} w="100%" alignItems="center">
            <Input
              size={'lg'}
              height={'48px'}
              type="text"
              placeholder="Email Cadastrado"
              placeholderTextColor={'dark.400'}
              borderColor={'dark.400'}
              mb={2}
              variant={'underlined'}
              _focus={{
                borderColor: '#202020',
              }}
              onChangeText={text => setEmail(text)}
            />
            <Input
              size={'lg'}
              height={'48px'}
              variant={'underlined'}
              placeholder="Sua Senha"
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
                borderColor: '#0A2117',
              }}
              onChangeText={text => setPassword(text)}
            />
            <VStack marginY={8} w="100%">
              <Button
                h={'50px'}
                borderRadius={24}
                bg="#0A2117"
                onPress={handleSignIn}>
                <Text
                  fontSize={'17px'}
                  fontWeight={'bold'}
                  color={'#DCF7E3'}
                  fontFamily="Roboto-Bold">
                  Entrar
                </Text>
              </Button>
            </VStack>
            <Pressable
              marginY={4}
              onPress={() => navigation.navigate('ForgotPasswordPage')}>
              <Text
                color={'#0A2117'}
                fontSize={'17px'}
                fontWeight={'semibold'}
                fontFamily="Roboto-Bold">
                Esqueceu a senha?
              </Text>
            </Pressable>
            <VStack marginY={8} w="100%">
              <Button
                h={'50px'}
                borderRadius={24}
                bg="#DCF7E3"
                borderColor={'#0A2117'}
                borderWidth={1}
                _pressed={{
                  bg: '#d0ead7',
                }}>
                <HStack flex={1} space={4}>
                  <Icon
                    as={<MaterialCommunityIcons name={'google'} />}
                    color={'#0A2117'}
                    size={6}
                  />
                  <Text
                    color={'#0A2117'}
                    fontSize={'17px'}
                    fontWeight={'semibold'}
                    fontFamily="Roboto-Bold">
                    Continuar com o Google
                  </Text>
                </HStack>
              </Button>
            </VStack>
          </VStack>
        </ScrollView>
      </VStack>
    </VStack>
  );
}

export default Login;
