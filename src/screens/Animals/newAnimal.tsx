/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import {
  Button,
  Divider,
  HStack,
  Image,
  Pressable,
  ScrollView,
  Spinner,
  Text,
  VStack,
} from 'native-base';
import {useContext, useEffect, useState} from 'react';
import {
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';
import BasicHeader from '../../components/BasicHeader';
import BasicText from '../../components/BasicText';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BasicInput from '../../components/BasicInput';
import BasicSelect from '../../components/BasicSelect';
import DatePicker from 'react-native-date-picker';
import Modal from 'react-native-modal';
import Toast from 'react-native-toast-message';
import {api} from '../../service/api';
import {AuthContext} from '../../contexts/AuthContext';
import {AnimalsContext} from '../../contexts/AnimalsContext';

function NewAnimal({navigation}: any) {
  const [disable, setDisable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    race: '',
    coat: '',
    photo: '',
    registerNumber: '',
    castrated: false,
    property: '',
    owner_name: '',
    sex: '',
    function: '',
    sale: '',
    value: '',
    castrationDate: new Date(),
    birthDate: new Date(),
    father: '',
    mother: '',
  });
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectDate, setSelectDate] = useState(false);
  const RaceValues = [
    {label: 'Padrão', value: 'Padrão'},
    {label: 'Diferenciado', value: 'Diferenciado'},
    {label: 'Mustang', value: 'Mustang'},
  ];
  const CoatValues = [
    {label: 'Castanha', value: 'Castanha'},
    {label: 'Rajado', value: 'Rajado'},
    {label: 'Preta', value: 'Preta'},
    {label: 'Branca', value: 'Branca'},
  ];
  const {user} = useContext(AuthContext);
  const {refresh, setRefresh} = useContext(AnimalsContext);

  const [photo, setPhoto] = useState<any>();
  const handleOpenLibrary = () =>
    launchImageLibrary({} as ImageLibraryOptions, handleChageImage);
  const handleChageImage = ({assets}: any) => {
    if (assets) {
      console.log('assets => ', assets[0].uri);

      setPhoto(assets[0]);
      setForm({...form, photo: assets[0].uri});
    }
  };
  const handleCreate = async () => {
    try {
      setLoading(true);
      const formData = new FormData();

      Object.entries(form).forEach(entry => {
        const [key, value] = entry;
        if (key === 'photo' || key === 'function') {
          return;
        }
        console.log(key, String(value));

        formData.append(key, String(value));
      });
      if (photo) {
        formData.append('photo', {
          uri: photo.uri,
          name: photo.fileName,
          type: photo.type,
        });
      }
      formData.append('owner', String(user?.id));

      await api.post('animal', formData, {
        headers: {'Content-Type': 'multipart/form-data'},
      });
      setDisable(false);
      Toast.show({
        type: 'success',
        text1: 'Edição',
        text2: 'Efetuada com sucesso!',
      });
      setRefresh(!refresh);
      navigation.goBack();
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Não foi possivel efetuar o cadastro',
        text2: 'Confira os dados e tente Novamente!',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      form.name !== '' &&
      form.sale !== '' &&
      form.coat !== '' &&
      form.father !== '' &&
      form.function !== '' &&
      form.mother !== '' &&
      form.property !== '' &&
      form.race !== '' &&
      form.sex !== ''
    ) {
      if (form.property === 'Terceiros') {
        if (form.owner_name !== '') {
          setDisable(false);
        } else {
          return setDisable(true);
        }
      }

      setDisable(false);
    }
  }, [form]);

  return (
    <>
      <VStack flex={1} bg="#DCF7E3" paddingX={6}>
        <BasicHeader
          navigation={navigation}
          name="Adicionar animal"
          goBack={() => setShowModal(true)}
        />
        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
          <VStack mb={4} mt={2} alignItems="center">
            {photo ? (
              <Image
                source={{uri: form.photo}}
                alt="profile image"
                w={120}
                h={120}
                borderRadius={75}
                onError={() =>
                  setPhoto(
                    'https://zinnyfactor.com/wp-content/uploads/2020/04/93-938050_png-file-transparent-white-user-icon-png-download.jpg',
                  )
                }
              />
            ) : (
              <VStack
                backgroundColor={'#0A21175A'}
                w={120}
                h={120}
                borderRadius={75}
                alignItems="center"
                justifyContent="center">
                <MaterialCommunityIcons
                  name={'horse-variant'}
                  size={60}
                  color={'#0A21178A'}
                />
              </VStack>
            )}
            <Pressable
              p={3}
              borderRadius={75}
              bg={'#0A2117'}
              position="absolute"
              bottom={0}
              right={'30%'}
              onPress={handleOpenLibrary}>
              <MaterialCommunityIcons
                name={'pencil-outline'}
                color={'#DCF7E3'}
                size={25}
              />
            </Pressable>
          </VStack>
          <VStack flex={1} space={6} mb={16}>
            <BasicInput
              text={form.name}
              label="Nome"
              onChangeText={v => {
                setForm({...form, name: v});
              }}
            />
            <BasicSelect
              itens={RaceValues}
              itemSelected={form.race}
              label="Raça"
              onChange={t => setForm({...form, race: t})}
            />
            <BasicSelect
              itens={CoatValues}
              itemSelected={form.coat}
              label="Pelagem"
              onChange={t => setForm({...form, coat: t})}
            />
            {form.race && form.coat && form.name && (
              <>
                <BasicInput
                  text={form.registerNumber}
                  label="Nº de Registro"
                  onChangeText={v => {
                    setForm({...form, registerNumber: v});
                  }}
                />
                <VStack space={2} mt={-2}>
                  <BasicText theme={'dark'} opacity={0.6}>
                    A quem pertence o animal
                  </BasicText>
                  <HStack space={2} mb={4}>
                    <Pressable
                      borderWidth={1}
                      borderColor="#0A211799"
                      borderRadius={25}
                      px={6}
                      h={10}
                      alignItems="center"
                      justifyContent="center"
                      bg={
                        form.property === 'Propriedade'
                          ? '#0A2117'
                          : 'transparent'
                      }
                      onPress={() => {
                        if (user) {
                          setForm({
                            ...form,
                            property: 'Propriedade',
                            owner_name: user?.id,
                          });
                        }
                      }}>
                      <BasicText
                        theme={
                          form.property === 'Propriedade' ? 'light' : 'dark'
                        }>
                        Propriedade
                      </BasicText>
                    </Pressable>
                    <Pressable
                      borderWidth={1}
                      borderColor="#0A211799"
                      borderRadius={25}
                      px={6}
                      h={10}
                      alignItems="center"
                      justifyContent="center"
                      bg={
                        form.property === 'Terceiros'
                          ? '#0A2117'
                          : 'transparent'
                      }
                      onPress={() =>
                        setForm({
                          ...form,
                          property: 'Terceiros',
                          owner_name: '',
                        })
                      }>
                      <BasicText
                        theme={
                          form.property === 'Terceiros' ? 'light' : 'dark'
                        }>
                        Terceiros
                      </BasicText>
                    </Pressable>
                  </HStack>
                  {form.property === 'Terceiros' && (
                    <BasicInput
                      text={form.owner_name}
                      label="Proprietário"
                      onChangeText={v => setForm({...form, owner_name: v})}
                      search
                    />
                  )}
                </VStack>
                <VStack space={2} mt={-2}>
                  <BasicText theme={'dark'} opacity={0.6}>
                    Sexo
                  </BasicText>
                  <HStack space={2}>
                    <Pressable
                      borderWidth={1}
                      borderColor="#0A211799"
                      borderRadius={25}
                      px={6}
                      h={10}
                      alignItems="center"
                      justifyContent="center"
                      bg={form.sex === 'male' ? '#0A2117' : 'transparent'}
                      onPress={() => setForm({...form, sex: 'male'})}>
                      <BasicText theme={form.sex === 'male' ? 'light' : 'dark'}>
                        Macho
                      </BasicText>
                    </Pressable>
                    <Pressable
                      borderWidth={1}
                      borderColor="#0A211799"
                      borderRadius={25}
                      px={6}
                      h={10}
                      alignItems="center"
                      justifyContent="center"
                      bg={form.sex === 'female' ? '#0A2117' : 'transparent'}
                      onPress={() => setForm({...form, sex: 'female'})}>
                      <BasicText
                        theme={form.sex === 'female' ? 'light' : 'dark'}>
                        Fêmea
                      </BasicText>
                    </Pressable>
                  </HStack>
                </VStack>
                <BasicSelect
                  itens={[{label: 'Lorem Ipsum', value: 'Lorem'}]}
                  itemSelected={form.function}
                  label="Função"
                  onChange={t => setForm({...form, function: t})}
                />
                <VStack space={2} mt={-2}>
                  <BasicText theme={'dark'} opacity={0.6}>
                    É castrado?
                  </BasicText>
                  <HStack space={2}>
                    <Pressable
                      borderWidth={1}
                      borderColor="#0A211799"
                      borderRadius={25}
                      px={6}
                      h={10}
                      alignItems="center"
                      justifyContent="center"
                      bg={form.castrated ? '#0A2117' : 'transparent'}
                      onPress={() => setForm({...form, castrated: true})}>
                      <BasicText theme={form.castrated ? 'light' : 'dark'}>
                        Sim
                      </BasicText>
                    </Pressable>
                    <Pressable
                      borderWidth={1}
                      borderColor="#0A211799"
                      borderRadius={25}
                      px={6}
                      h={10}
                      alignItems="center"
                      justifyContent="center"
                      bg={!form.castrated ? '#0A2117' : 'transparent'}
                      onPress={() => setForm({...form, castrated: false})}>
                      <BasicText theme={!form.castrated ? 'light' : 'dark'}>
                        Não
                      </BasicText>
                    </Pressable>
                  </HStack>
                </VStack>
                <VStack space={2} mt={-2}>
                  <BasicText theme={'dark'} opacity={0.6}>
                    Animal à venda?
                  </BasicText>
                  <HStack space={2}>
                    <Pressable
                      borderWidth={1}
                      borderColor="#0A211799"
                      borderRadius={25}
                      px={6}
                      h={10}
                      alignItems="center"
                      justifyContent="center"
                      bg={form.sale === 'yes' ? '#0A2117' : 'transparent'}
                      onPress={() => setForm({...form, sale: 'yes'})}>
                      <BasicText theme={form.sale === 'yes' ? 'light' : 'dark'}>
                        Sim
                      </BasicText>
                    </Pressable>
                    <Pressable
                      borderWidth={1}
                      borderColor="#0A211799"
                      borderRadius={25}
                      px={6}
                      h={10}
                      alignItems="center"
                      justifyContent="center"
                      bg={form.sale === 'no' ? '#0A2117' : 'transparent'}
                      onPress={() => setForm({...form, sale: 'no'})}>
                      <BasicText theme={form.sale === 'no' ? 'light' : 'dark'}>
                        Não
                      </BasicText>
                    </Pressable>
                    <Pressable
                      borderWidth={1}
                      borderColor="#0A211799"
                      borderRadius={25}
                      px={6}
                      h={10}
                      alignItems="center"
                      justifyContent="center"
                      bg={form.sale === 'sale' ? '#0A2117' : 'transparent'}
                      onPress={() => setForm({...form, sale: 'sale'})}>
                      <BasicText
                        theme={form.sale === 'sale' ? 'light' : 'dark'}>
                        Vendido
                      </BasicText>
                    </Pressable>
                  </HStack>
                </VStack>
                {form.sale === 'yes' && (
                  <BasicInput
                    text={form.value}
                    label="Valor"
                    onChangeText={v => {
                      setForm({...form, value: v});
                    }}
                  />
                )}
                {form.castrated && (
                  <BasicInput
                    dateValue={form.castrationDate}
                    label="Data de castração"
                    onClick={() => {
                      setOpen(true);
                      setSelectDate(true);
                    }}
                    date
                  />
                )}
                <BasicInput
                  dateValue={form.birthDate}
                  label="Data de Nascimento"
                  onClick={() => {
                    setOpen(true);
                    setSelectDate(false);
                  }}
                  date
                />
                <BasicInput
                  text={form.father}
                  label="Pai"
                  onChangeText={v => setForm({...form, father: v})}
                />
                <BasicInput
                  text={form.mother}
                  label="Mãe"
                  onChangeText={v => setForm({...form, mother: v})}
                />
              </>
            )}
          </VStack>
        </ScrollView>
        <DatePicker
          modal
          mode="date"
          open={open}
          date={selectDate ? form.castrationDate : form.birthDate}
          onConfirm={dateValue => {
            setOpen(false);

            console.log(dateValue);
            if (selectDate) {
              setForm({...form, castrationDate: dateValue});
            } else {
              setForm({...form, birthDate: dateValue});
            }
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />

        <Divider
          borderColor="#0A2117"
          borderWidth={0.5}
          w={1000}
          marginX={-10}
        />
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
            disabled={disable !== loading}
            opacity={disable !== loading ? 0.4 : 1}
            onPress={handleCreate}>
            <HStack space={2}>
              <MaterialCommunityIcons
                name={'check'}
                color={'#DCF7E3'}
                size={24}
              />
              <BasicText theme="light" fontWeight="medium">
                Adicionar
              </BasicText>
              {loading && <Spinner />}
            </HStack>
          </Pressable>
        </HStack>
      </VStack>
      <Modal
        isVisible={showModal}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <VStack
          w={'95%'}
          bg="#DCF7E3"
          borderRadius={25}
          padding={6}
          space={4}
          alignItems="center"
          justifyContent={'center'}>
          <VStack alignItems="center" justifyContent={'center'}>
            <Text
              fontSize={'32px'}
              color={'#0A2117'}
              fontFamily={'IBMPlexSans-Regular'}
              textAlign="center">
              Sair sem salvar?
            </Text>
          </VStack>
          <BasicText theme="dark" textAlign="center">
            Se sair agora, perderá as alterações que você fez
          </BasicText>
          <Button
            h={'50px'}
            w={'100%'}
            borderRadius={24}
            bg={'#0A2117'}
            mt={4}
            onPress={() => {
              navigation.goBack();
              setShowModal(false);
            }}
            _pressed={{
              bg: '#0A4217',
            }}>
            <HStack space={2}>
              <BasicText theme={'light'} fontWeight={'medium'}>
                Sair sem salvar
              </BasicText>
            </HStack>
          </Button>

          <Button
            h={'50px'}
            w={'100%'}
            borderRadius={24}
            bg="transparent"
            borderColor="#0A2117"
            borderWidth={1}
            onPress={() => {
              setShowModal(false);
            }}
            _pressed={{
              bg: '#d0ead7',
            }}>
            <BasicText theme="dark" fontWeight={'bold'}>
              Continuar edição
            </BasicText>
          </Button>
        </VStack>
      </Modal>
    </>
  );
}

export default NewAnimal;
