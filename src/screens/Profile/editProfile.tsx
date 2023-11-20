/* eslint-disable react/react-in-jsx-scope */
import {
  CheckIcon,
  Divider,
  HStack,
  Image,
  Input,
  Pressable,
  ScrollView,
  Select,
  VStack,
} from 'native-base';
import {useContext, useState} from 'react';
import {
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';
import BasicHeader from '../../components/BasicHeader';
import {AuthContext, UserProps} from '../../contexts/AuthContext';
import BasicText from '../../components/BasicText';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

function EditProfile({navigation}: any) {
  const {user, updateUser} = useContext(AuthContext);
  const [form, setForm] = useState<UserProps>(user as UserProps);
  const [language, setLanguage] = useState(user?.type);
  const [photo, setPhoto] = useState<string | undefined>(user?.photo);
  const handleOpenLibrary = () =>
    launchImageLibrary({} as ImageLibraryOptions, handleChageImage);
  const handleChageImage = ({assets}: any) => {
    if (assets) {
      console.log('assets => ', assets[0].uri);

      setPhoto(assets[0].uri);
      setForm({...form, photo: assets[0].uri});
    }
  };

  return (
    <VStack flex={1} bg="#DCF7E3" paddingX={6}>
      <BasicHeader navigation={navigation} name="Dados" />
      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <VStack mb={4} mt={2} alignItems="center">
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
          <Pressable
            p={3}
            borderRadius={75}
            bg={'#0A2117'}
            position="absolute"
            bottom={0}
            right={'25%'}
            onPress={handleOpenLibrary}>
            <MaterialCommunityIcons
              name={'pencil-outline'}
              color={'#DCF7E3'}
              size={36}
            />
          </Pressable>
        </VStack>
        <VStack flex={1} space={4} mb={16}>
          <VStack>
            <BasicText theme="dark" size={14} opacity={0.6}>
              Primeiro Nome
            </BasicText>
            <Input
              size={'lg'}
              height={'40px'}
              mt={-3}
              variant={'underlined'}
              placeholderTextColor={'#0A2117'}
              borderColor={'#0A2117'}
              type={'text'}
              placeholder={'Digite seu primeiro nome'}
              value={form.name}
              onChangeText={v => setForm({...form, name: v})}
              _focus={{
                borderColor: '#0A2117',
              }}
            />
          </VStack>
          <VStack>
            <BasicText theme="dark" size={14} opacity={0.6}>
              Último Nome
            </BasicText>
            <Input
              size={'lg'}
              height={'40px'}
              mt={-3}
              variant={'underlined'}
              placeholderTextColor={'#0A2117'}
              borderColor={'#0A2117'}
              type={'text'}
              placeholder={'Digite seu último nome'}
              value={form.last_name}
              onChangeText={v => setForm({...form, last_name: v})}
              _focus={{
                borderColor: '#0A2117',
              }}
            />
          </VStack>
          <VStack>
            <BasicText theme="dark" size={14} opacity={0.6}>
              CPF
            </BasicText>
            <Input
              size={'lg'}
              height={'40px'}
              mt={-3}
              variant={'underlined'}
              placeholderTextColor={'#0A2117'}
              borderColor={'#0A2117'}
              type={'text'}
              placeholder={'Digite seu CPF'}
              value={form.cpf}
              onChangeText={v => setForm({...form, cpf: v})}
              _focus={{
                borderColor: '#0A2117',
              }}
            />
          </VStack>
          <VStack>
            <BasicText theme="dark" size={14} opacity={0.6}>
              Perfil
            </BasicText>
            <Select
              height={'40px'}
              mt={-3}
              selectedValue={language}
              accessibilityLabel="Subcategoria"
              placeholder="Selecione sua Categoria"
              borderColor="#0A2117"
              dropdownIcon={
                <MaterialCommunityIcons
                  name={'chevron-down'}
                  color={'#0A2117'}
                  size={24}
                />
              }
              variant="underlined"
              placeholderTextColor={'#0A2117'}
              h={12}
              fontSize={17}
              onValueChange={itemValue => setLanguage(itemValue)}
              _selectedItem={{
                endIcon: <CheckIcon size={4} />,
              }}>
              <Select.Item label="Administrador" value="Administrador" />
              <Select.Item label="Personalizado" value="Personalizado" />
              <Select.Item label="Acesso completo" value="Acesso completo" />
              <Select.Item label="Cuidador(a)" value="Cuidador(a)" />
            </Select>
          </VStack>
          <VStack>
            <BasicText theme="dark" size={14} opacity={0.6}>
              Telefone
            </BasicText>
            <Input
              size={'lg'}
              height={'40px'}
              mt={-3}
              variant={'underlined'}
              placeholderTextColor={'#0A2117'}
              borderColor={'#0A2117'}
              type={'text'}
              placeholder={'Digite seu telefone'}
              value={form.phone}
              onChangeText={v => setForm({...form, phone: v})}
              _focus={{
                borderColor: '#0A2117',
              }}
            />
          </VStack>
        </VStack>
      </ScrollView>

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
            updateUser({...form, type: language});
            navigation.goBack();
          }}>
          <HStack space={2}>
            <MaterialCommunityIcons
              name={'check'}
              color={'#DCF7E3'}
              size={24}
            />
            <BasicText theme="light" fontWeight="medium">
              Salvar
            </BasicText>
          </HStack>
        </Pressable>
      </HStack>
    </VStack>
  );
}

export default EditProfile;
