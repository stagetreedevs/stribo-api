/* eslint-disable react/react-in-jsx-scope */
import {
  Divider,
  HStack,
  Image,
  Pressable,
  ScrollView,
  Spinner,
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
import BasicInput from '../../components/BasicInput';
import BasicSelect from '../../components/BasicSelect';

function EditProfile({navigation}: any) {
  const {user, updateUser} = useContext(AuthContext);
  const [form, setForm] = useState<UserProps>(user as UserProps);
  const [type, setType] = useState(user?.type);
  const [loading, setLoading] = useState(false);
  const selectValues = [
    {label: 'Administrador', value: 'Administrador'},
    {label: 'Personalizado', value: 'Personalizado'},
    {label: 'Acesso completo', value: 'Acesso completo'},
    {label: 'Cuidador(a)', value: 'Cuidador(a)'},
    {label: 'Super Admin', value: 'Super Admin'},
  ];
  const [photo, setPhoto] = useState<any>();
  const [photoUri, setPhotoUri] = useState<string | undefined>(user?.photo);
  const handleOpenLibrary = () =>
    launchImageLibrary({} as ImageLibraryOptions, handleChageImage);
  const handleChageImage = ({assets}: any) => {
    if (assets) {
      console.log(assets[0]);
      setPhoto(assets[0]);
      setPhotoUri(assets[0].uri);
    }
  };

  return (
    <VStack flex={1} bg="#DCF7E3" paddingX={6}>
      <BasicHeader navigation={navigation} name="Dados" />
      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <VStack mb={4} mt={2} alignItems="center">
          <Image
            source={{uri: photoUri}}
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
          <BasicInput
            text={form.name}
            label="Primeiro nome"
            onChangeText={v => {
              setForm({...form, name: v});
            }}
          />
          <BasicInput
            text={form.last_name}
            label="Último nome"
            onChangeText={v => {
              setForm({...form, last_name: v});
            }}
          />
          <BasicInput
            text={form.cpf}
            label="CPF"
            onChangeText={v => {
              setForm({...form, cpf: v});
            }}
          />
          <BasicSelect
            itens={selectValues}
            itemSelected={type}
            label="Perfil"
            disable
            onChange={t => setType(t)}
          />
          <BasicInput
            text={form.phone}
            label="Telefone"
            onChangeText={v => {
              setForm({...form, phone: v});
            }}
          />
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
          disabled={loading}
          px={6}
          width="100%"
          h={'50px'}
          alignItems="center"
          justifyContent="center"
          bg={loading ? '#0A2117A5' : '#0A2117'}
          onPress={async () => {
            const formData = new FormData();

            Object.entries(form).forEach(entry => {
              const [key, value] = entry;
              if (key === 'type') {
                return;
              }

              formData.append(key, String(value));
            });
            formData.append('type', type);

            if (photo) {
              formData.append('image', {
                uri: photo.uri,
                name: photo.fileName,
                type: photo.type,
              });
            }
            setLoading(true);
            await updateUser(formData);
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
            {loading && <Spinner />}
          </HStack>
        </Pressable>
      </HStack>
    </VStack>
  );
}

export default EditProfile;
