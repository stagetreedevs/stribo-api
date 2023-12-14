/* eslint-disable react/react-in-jsx-scope */
import {Divider, HStack, Input, Pressable, Spinner, VStack} from 'native-base';
import {useContext, useState} from 'react';
import BasicHeader from '../../components/BasicHeader';
import BasicText from '../../components/BasicText';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Keyboard} from 'react-native';
import Toast from 'react-native-toast-message';
import {AuthContext} from '../../contexts/AuthContext';

function EditPassword({navigation}: any) {
  const [form, setForm] = useState({
    password: '',
    newPassword: '',
  });
  const {editPassword} = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  return (
    <VStack flex={1} bg="#DCF7E3" paddingX={6}>
      <BasicHeader navigation={navigation} name="Alterar Senha" />

      <VStack flex={1} space={4}>
        <VStack>
          <Input
            size={'lg'}
            height={'48px'}
            variant={'underlined'}
            placeholderTextColor={'#0A211799'}
            borderColor={'#0A211799'}
            type={'text'}
            placeholder={'Digite sua senha atual'}
            value={form.password}
            onChangeText={v => setForm({...form, password: v})}
            _focus={{
              borderColor: '#0A2117',
            }}
          />
        </VStack>
        <VStack>
          <Input
            size={'lg'}
            height={'48px'}
            variant={'underlined'}
            placeholderTextColor={'#0A211799'}
            borderColor={'#0A211799'}
            type={'text'}
            placeholder={'Digite seu último nome'}
            value={form.newPassword}
            onChangeText={v => setForm({...form, newPassword: v})}
            _focus={{
              borderColor: '#0A2117',
            }}
          />
        </VStack>
        <Pressable flex={1} onPress={() => Keyboard.dismiss()} />
      </VStack>
      <Divider borderColor="#0A2117" borderWidth={0.5} w={1000} marginX={-10} />
      <HStack
        h={75}
        w="100%"
        alignItems={'center'}
        justifyContent="space-around">
        <Pressable
          borderWidth={1}
          borderColor="#0A2117"
          borderRadius={50}
          px={6}
          width="100%"
          h={'50px'}
          alignItems="center"
          justifyContent="center"
          bg={'#0A2117'}
          onPress={async () => {
            try {
              if (form.newPassword !== form.password) {
                return Toast.show({
                  type: 'error',
                  text1: 'As senhas devem ser iguais',
                  text2: 'Confira os dados e tente Novamente!',
                });
              }
              setLoading(true);
              await editPassword(form.password);
              navigation.goBack();
            } catch (error) {
              setLoading(false);
              console.log(error);
            }
          }}>
          <HStack space={2}>
            <MaterialCommunityIcons
              name={'check'}
              color={'#DCF7E3'}
              size={24}
            />
            <BasicText theme="light" fontWeight="medium">
              Alterar
            </BasicText>
            {loading && <Spinner />}
          </HStack>
        </Pressable>
      </HStack>
    </VStack>
  );
}

export default EditPassword;
