/* eslint-disable react/react-in-jsx-scope */
import {Divider, HStack, Input, Pressable, VStack} from 'native-base';
import {useState} from 'react';
import BasicHeader from '../../components/BasicHeader';
import BasicText from '../../components/BasicText';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Keyboard} from 'react-native';

function EditPassword({navigation}: any) {
  const [form, setForm] = useState({
    password: '',
    newPassword: '',
  });

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
          onPress={() => {
            navigation.goBack();
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
          </HStack>
        </Pressable>
      </HStack>
    </VStack>
  );
}

export default EditPassword;
