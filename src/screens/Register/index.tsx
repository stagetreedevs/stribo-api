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
} from 'native-base';
import {useState} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';
function Register() {
  const [show, setShow] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  async function handleRegister() {
    if (confirmPassword !== password) {
      return Toast.show({
        type: 'error',
        text1: 'As Senhas Não Conferem',
        text2: 'Confira os dados e tente Novamente!',
      });
    }
    try {
      // await register(email, password);
    } catch (error) {
      console.log(error);
    } finally {
      setShow(true);
    }
  }

  return (
    <VStack flex={1} bg="#0A2117" justifyContent={'flex-end'}>
      <StatusBar backgroundColor={'#0A2117'} barStyle="light-content" />
      <Text
        color={'white'}
        fontSize={26}
        fontFamily={'Poppins-SemiBold'}
        marginX={6}
        marginY={8}>
        Registre-se!
      </Text>
      <VStack
        bg={'white'}
        h="75%"
        w="100%"
        borderTopRadius={25}
        paddingX={6}
        paddingY={8}>
        <ScrollView flex={1}>
          <VStack mb={6}>
            <Text color={'#202020'} fontFamily="Poppins-SemiBold" fontSize={15}>
              Email
            </Text>
            <Input
              borderRadius={10}
              type="text"
              placeholder="Email"
              InputLeftElement={
                <Icon
                  as={<MaterialIcons name="person" size={12} />}
                  size={6}
                  marginX={2}
                />
              }
              _focus={{
                bg: 'white',
                borderColor: '#202020',
              }}
              onChangeText={text => setEmail(text)}
            />
          </VStack>
          <VStack mb={6}>
            <Text color={'#202020'} fontFamily="Poppins-SemiBold" fontSize={15}>
              Senha
            </Text>
            <Input
              borderRadius={10}
              placeholder="Senha"
              type={show ? 'password' : 'text'}
              InputLeftElement={
                <Icon
                  as={<MaterialIcons name="lock-outline" size={12} />}
                  size={6}
                  marginX={2}
                />
              }
              InputRightElement={
                <Pressable marginX={4} onPress={() => setShow(!show)}>
                  <Icon
                    as={
                      <MaterialIcons
                        name={show ? 'visibility' : 'visibility-off'}
                        size={12}
                      />
                    }
                    size={6}
                  />
                </Pressable>
              }
              _focus={{
                bg: 'white',
                borderColor: '#202020',
              }}
              onChangeText={text => setPassword(text)}
            />
          </VStack>
          <VStack>
            <Text color={'#202020'} fontFamily="Poppins-SemiBold" fontSize={15}>
              Confimar Senha
            </Text>
            <Input
              borderRadius={10}
              placeholder="Confirmar Senha"
              type={show ? 'password' : 'text'}
              InputLeftElement={
                <Icon
                  as={<MaterialIcons name="lock-outline" size={12} />}
                  size={6}
                  marginX={2}
                />
              }
              InputRightElement={
                <Pressable marginX={4} onPress={() => setShow(!show)}>
                  <Icon
                    as={
                      <MaterialIcons
                        name={show ? 'visibility' : 'visibility-off'}
                        size={12}
                      />
                    }
                    size={6}
                  />
                </Pressable>
              }
              _focus={{
                bg: 'white',
                borderColor: '#202020',
              }}
              onChangeText={text => setConfirmPassword(text)}
            />
          </VStack>
          <VStack marginY={8} space={4}>
            <Button borderRadius={12} bg="#0A2117" onPress={handleRegister}>
              <Text color={'white'} fontFamily="Poppins-SemiBold">
                Entrar
              </Text>
            </Button>
            <Button
              borderRadius={12}
              bg="white"
              borderColor={'#0A2117'}
              borderWidth={1}
              _pressed={{
                bg: '#ccc',
              }}>
              <Text color={'#0A2117'} fontFamily="Poppins-SemiBold">
                Cadastrar
              </Text>
            </Button>
          </VStack>
        </ScrollView>
      </VStack>
    </VStack>
  );
}

export default Register;
