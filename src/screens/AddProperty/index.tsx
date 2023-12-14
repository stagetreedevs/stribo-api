/* eslint-disable react/react-in-jsx-scope */
import {Button, HStack, VStack} from 'native-base';
import {useContext, useState} from 'react';
import Toast from 'react-native-toast-message';
import BasicText from '../../components/BasicText';
import {AuthContext} from '../../contexts/AuthContext';
import Header from '../../components/Header';
import Feather from 'react-native-vector-icons/Feather';
import BasicInput from '../../components/BasicInput';
import {Keyboard, Pressable} from 'react-native';
function AddProperty({navigation}: any) {
  const {addProperty} = useContext(AuthContext);

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  async function handleAdd() {
    if (name === '') {
      return Toast.show({
        type: 'error',
        text1: 'Campo de Nome Vazio!',
        text2: 'Confira os dados e tente Novamente!',
      });
    }
    try {
      addProperty(name, code);
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Não foi possível efetuar o cadastro',
        text2: 'Confira os dados e tente Novamente!',
      });
    }
  }

  return (
    <VStack flex={1} backgroundColor="#0A2117" justifyContent={'flex-end'}>
      <Header navigation={navigation} screen={'Adicionar propriedade'} />

      <VStack
        flex={1}
        backgroundColor="#DCF7E3"
        justifyContent={'flex-start'}
        borderTopRadius={25}
        p={4}
        space={2}>
        <Pressable onPress={() => Keyboard.dismiss()}>
          <VStack paddingTop={4} pb={2} space={4}>
            <BasicInput
              label="Nome da Propriedade"
              text={name}
              onChangeText={v => setName(v)}
            />
            <BasicInput
              label="Código da Propriedade (opcional)"
              text={code}
              onChangeText={v => setCode(v)}
            />
          </VStack>
          <BasicText theme="dark" opacity={0.5} size={14} w="90%">
            Esse é o código de inscrição da propriedade no órgão de defesa
            agropecuária do estado.
          </BasicText>
        </Pressable>
        <Button
          h={'50px'}
          borderRadius={24}
          bg="#0A2117"
          mt={4}
          onPress={() => handleAdd()}>
          <HStack
            ml={-4}
            space={2}
            alignItems="center"
            justifyContent={'center'}>
            <Feather name={'plus'} color={'#DCF7E3'} size={25} />

            <BasicText theme="light" fontWeight={'bold'}>
              Adicionar
            </BasicText>
          </HStack>
        </Button>
      </VStack>
    </VStack>
  );
}

export default AddProperty;
