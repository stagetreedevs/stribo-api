/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/react-in-jsx-scope */
import {
  CheckIcon,
  Divider,
  FlatList,
  HStack,
  Pressable,
  ScrollView,
  Select,
  Spinner,
  Text,
  VStack,
} from 'native-base';
import {Formik} from 'formik';
import {useContext, useEffect, useState} from 'react';
import BasicHeader from '../../../components/BasicHeader';
import BasicText from '../../../components/BasicText';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Keyboard} from 'react-native';
import BasicInput from '../../../components/BasicInput';
import {functions} from '../Data';
import {AuthContext} from '../../../contexts/AuthContext';
import Toast from 'react-native-toast-message';
import {api} from '../../../service/api';

function NewAdmin({navigation}: any) {
  const [allFunctions, setAllFunctions] = useState(functions);
  const {property, refresh, setRefresh} = useContext(AuthContext);

  const [haveItem, setHaveItem] = useState(false);
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    username: '',
    cpf: '',
    phone: '',
    role: '',
  });
  const handleCreate = async () => {
    try {
      setLoading(true);
      await api.post(`admin/${property?.id}`, form);
      setValid(false);
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
        text1: 'Email ou senha incorretos',
        text2: 'Confira os dados e tente Novamente!',
      });
    } finally {
      setLoading(false);
    }
  };
  const handleAllSet = async (index: number, type: string) => {
    console.log(index);

    let newArr = [...allFunctions];
    if (type === 'view') {
      newArr[index].allView = !newArr[index].allView;
      newArr[index].props.map(item => (item.view = newArr[index].allView));
      newArr[index].haveItem.view = newArr[index].allView;
    } else if (type === 'edit') {
      newArr[index].allEdit = !newArr[index].allEdit;
      newArr[index].props.map(item => (item.edit = newArr[index].allEdit));
      newArr[index].haveItem.edit = newArr[index].allEdit;
    } else {
      newArr[index].allDelete = !newArr[index].allDelete;
      newArr[index].props.map(item => (item.delete = newArr[index].allDelete));
      newArr[index].haveItem.delete = newArr[index].allDelete;
    }
    setAllFunctions(newArr);
  };
  const clear = async () => {
    let newArr = [...allFunctions];
    allFunctions.map((item, index) => {
      newArr[index].haveItem.view = false;
      newArr[index].haveItem.edit = false;
      newArr[index].haveItem.delete = false;
      item.props.map(props => {
        if (props.view) {
          newArr[index].haveItem.view = true;
          newArr[index].allView = false;
        }
        if (props.edit) {
          newArr[index].haveItem.edit = true;
          newArr[index].allEdit = false;
        }
        if (props.delete) {
          newArr[index].haveItem.delete = true;
          newArr[index].allDelete = false;
        }
      });
      newArr[index].allView = false;
      newArr[index].props.map(item => (item.view = false));
      newArr[index].haveItem.view = false;
      newArr[index].allEdit = false;
      newArr[index].props.map(item => (item.edit = false));
      newArr[index].haveItem.edit = false;
      newArr[index].allDelete = false;
      newArr[index].props.map(item => (item.delete = false));
      newArr[index].haveItem.delete = false;
    });
    setForm({cpf: '', username: '', phone: '', role: ''});
    setAllFunctions(newArr);
  };
  const allAccess = async (access?: number) => {
    let newArr = [...allFunctions];
    allFunctions.map((item, index) => {
      if (access) {
        if (index === access) {
          newArr[index].haveItem.view = true;
          newArr[index].haveItem.edit = true;
          newArr[index].haveItem.delete = true;
          item.props.map(props => {
            if (props.view) {
              newArr[index].haveItem.view = true;
              newArr[index].allView = true;
            }
            if (props.edit) {
              newArr[index].haveItem.edit = true;
              newArr[index].allEdit = true;
            }
            if (props.delete) {
              newArr[index].haveItem.delete = true;
              newArr[index].allDelete = true;
            }
          });
          newArr[index].allView = true;
          newArr[index].props.map(item => (item.view = true));
          newArr[index].haveItem.view = true;
          newArr[index].allEdit = true;
          newArr[index].props.map(item => (item.edit = true));
          newArr[index].haveItem.edit = true;
          newArr[index].allDelete = true;
          newArr[index].props.map(item => (item.delete = true));
          newArr[index].haveItem.delete = true;
        } else {
          newArr[index].haveItem.view = false;
          newArr[index].haveItem.edit = false;
          newArr[index].haveItem.delete = false;
          item.props.map(props => {
            if (props.view) {
              newArr[index].haveItem.view = true;
              newArr[index].allView = false;
            }
            if (props.edit) {
              newArr[index].haveItem.edit = true;
              newArr[index].allEdit = false;
            }
            if (props.delete) {
              newArr[index].haveItem.delete = true;
              newArr[index].allDelete = false;
            }
          });
          newArr[index].allView = false;
          newArr[index].props.map(item => (item.view = false));
          newArr[index].haveItem.view = false;
          newArr[index].allEdit = false;
          newArr[index].props.map(item => (item.edit = false));
          newArr[index].haveItem.edit = false;
          newArr[index].allDelete = false;
          newArr[index].props.map(item => (item.delete = false));
          newArr[index].haveItem.delete = false;
        }
      } else {
        newArr[index].haveItem.view = true;
        newArr[index].haveItem.edit = true;
        newArr[index].haveItem.delete = true;
        item.props.map(props => {
          if (props.view) {
            newArr[index].haveItem.view = true;
            newArr[index].allView = true;
          }
          if (props.edit) {
            newArr[index].haveItem.edit = true;
            newArr[index].allEdit = true;
          }
          if (props.delete) {
            newArr[index].haveItem.delete = true;
            newArr[index].allDelete = true;
          }
        });
        newArr[index].allView = true;
        newArr[index].props.map(item => (item.view = true));
        newArr[index].haveItem.view = true;
        newArr[index].allEdit = true;
        newArr[index].props.map(item => (item.edit = true));
        newArr[index].haveItem.edit = true;
        newArr[index].allDelete = true;
        newArr[index].props.map(item => (item.delete = true));
        newArr[index].haveItem.delete = true;
      }
    });
    setAllFunctions(newArr);
  };
  useEffect(() => {
    let newArr = [...allFunctions];
    allFunctions.map((item, index) => {
      let view = 0;
      let edit = 0;
      let delet = 0;
      newArr[index].haveItem.view = false;
      newArr[index].haveItem.edit = false;
      newArr[index].haveItem.delete = false;
      item.props.map(props => {
        if (props.view) {
          view++;
          newArr[index].haveItem.view = true;
          if (view === item.props.length) {
            newArr[index].allView = true;
          } else {
            newArr[index].allView = false;
          }
        }
        if (props.edit) {
          edit++;
          newArr[index].haveItem.edit = true;
          if (edit === item.props.length) {
            newArr[index].allEdit = true;
          } else {
            newArr[index].allEdit = false;
          }
        }
        if (props.delete) {
          delet++;
          newArr[index].haveItem.delete = true;
          if (delet === item.props.length) {
            newArr[index].allDelete = true;
          } else {
            newArr[index].allDelete = false;
          }
        }

        setAllFunctions(newArr);
      });
    });
  }, [haveItem]);
  useEffect(() => {
    if (
      form.cpf.length > 4 &&
      form.phone.length > 4 &&
      form.username.length > 4 &&
      form.role
    ) {
      setValid(true);
    } else {
      setValid(false);
    }
    if (form.role === 'Acesso completo') {
      allAccess();
    } else if (form.role === 'Financeiro') {
      allAccess(7);
    } else if (form.role === 'Cuidador(a)') {
      allAccess(2);
    } else {
      allAccess(8);
    }
  }, [form]);
  const PermissionView = ({item, index}: any) => {
    return (
      <VStack key={index} w="100%" my={2}>
        <HStack w="100%" justifyContent={'space-between'} my={2} pr={4}>
          <Text
            color={'#0A2117'}
            fontSize="16px"
            fontFamily={'IBMPlexSans-SemiBold'}
            fontWeight="semibold">
            {item.name}
          </Text>
          <HStack space={1}>
            <Pressable
              p={2}
              borderRadius={25}
              background={
                item.allView
                  ? '#6AF3B4'
                  : item.haveItem.view
                  ? '#0A21171A'
                  : 'transparent'
              }
              onPress={() => handleAllSet(index, 'view')}>
              <MaterialCommunityIcons
                name={'eye-outline'}
                size={20}
                color={item.haveItem.view ? '#0A2117' : '#0A21178A'}
              />
            </Pressable>
            <Pressable
              p={2}
              borderRadius={25}
              background={
                item.allEdit
                  ? '#6AF3B4'
                  : item.haveItem.edit
                  ? '#0A21171A'
                  : 'transparent'
              }
              onPress={() => handleAllSet(index, 'edit')}>
              <MaterialCommunityIcons
                name={'pencil-outline'}
                size={20}
                color={item.haveItem.edit ? '#0A2117' : '#0A21178A'}
              />
            </Pressable>
            <Pressable
              p={2}
              borderRadius={25}
              background={
                item.allDelete
                  ? '#6AF3B4'
                  : item.haveItem.delete
                  ? '#0A21171A'
                  : 'transparent'
              }
              onPress={() => handleAllSet(index, 'delete')}>
              <MaterialCommunityIcons
                name={'trash-can-outline'}
                size={20}
                color={item.haveItem.delete ? '#0A2117' : '#0A21178A'}
              />
            </Pressable>
          </HStack>
        </HStack>
        <VStack borderLeftWidth={0.75} borderColor="#0A2117" space={2} p={4}>
          {item.props.map((props: any, key: any) => (
            <HStack key={key} w="100%" justifyContent={'space-between'} my={2}>
              <VStack>
                <BasicText theme="dark">{props.name}</BasicText>
              </VStack>
              <HStack space={1}>
                <Pressable
                  p={2}
                  borderRadius={25}
                  background={props.view ? '#6AF3B4' : 'transparent'}
                  onPress={() => {
                    let newArr = [...allFunctions];
                    newArr[index].props[key].view =
                      !newArr[index].props[key].view;
                    setHaveItem(!haveItem);
                    setAllFunctions(newArr);
                  }}>
                  <MaterialCommunityIcons
                    name={'eye-outline'}
                    size={20}
                    color={props.view ? '#0A2117' : '#0A21178A'}
                  />
                </Pressable>
                <Pressable
                  p={2}
                  borderRadius={25}
                  background={props.edit ? '#6AF3B4' : 'transparent'}
                  onPress={() => {
                    let newArr = [...allFunctions];
                    newArr[index].props[key].edit =
                      !newArr[index].props[key].edit;
                    setHaveItem(!haveItem);
                    setAllFunctions(newArr);
                  }}>
                  <MaterialCommunityIcons
                    name={'pencil-outline'}
                    size={20}
                    color={props.edit ? '#0A2117' : '#0A21178A'}
                  />
                </Pressable>
                <Pressable
                  p={2}
                  borderRadius={25}
                  background={props.delete ? '#6AF3B4' : 'transparent'}
                  onPress={() => {
                    let newArr = [...allFunctions];
                    newArr[index].props[key].delete =
                      !newArr[index].props[key].delete;
                    setHaveItem(!haveItem);
                    setAllFunctions(newArr);
                  }}>
                  <MaterialCommunityIcons
                    name={'trash-can-outline'}
                    size={20}
                    color={props.delete ? '#0A2117' : '#0A21178A'}
                  />
                </Pressable>
              </HStack>
            </HStack>
          ))}
        </VStack>
      </VStack>
    );
  };
  return (
    <Formik initialValues={form} onSubmit={handleCreate}>
      {({handleSubmit}) => (
        <VStack flex={1} bg="#DCF7E3" paddingX={6}>
          <BasicHeader navigation={navigation} name="Novo Administrador" />
          <ScrollView flex={1} showsVerticalScrollIndicator={false}>
            <VStack space={4}>
              <VStack pt={2}>
                <BasicInput
                  text={form.username}
                  label="Email do Administrador"
                  onChangeText={v => setForm({...form, username: v})}
                />
              </VStack>
              <VStack>
                <BasicInput
                  text={form.cpf}
                  type="number"
                  label="CPF do Administrador"
                  maxLength={14}
                  onChangeText={v => {
                    let value = v.replace(/\D/g, '');
                    value = value.replace(/(\d)(\d{2})$/, '$1-$2');
                    value = value.replace(/(?=(\d{3})+(\D))\B/g, '.');
                    setForm({...form, cpf: value});
                  }}
                />
              </VStack>
              <VStack>
                <BasicInput
                  text={form.phone}
                  type="number"
                  label="Telefone do Administrador"
                  maxLength={15}
                  onChangeText={v => {
                    let phone = v.replace(/\D/g, '');
                    phone = phone.replace(/^(\d{2})(\d)/g, '($1) $2');
                    phone = phone.replace(/(\d)(\d{4})$/, '$1 $2');
                    setForm({...form, phone: phone});
                  }}
                />
              </VStack>
              <VStack marginY={4} space={4}>
                <BasicText theme="dark" size={14} opacity={0.5}>
                  Selecione abaixo um perfil pré-configurado e/ou marque a
                  seguir as funções às quais o usuário terá acesso.
                </BasicText>
                <VStack>
                  <Select
                    selectedValue={form.role}
                    accessibilityLabel="Selecionar perfil"
                    placeholder="Selecionar perfil"
                    borderColor="#0A211799"
                    dropdownIcon={
                      <MaterialCommunityIcons
                        name={'chevron-down'}
                        color={'#0A2117'}
                        size={24}
                      />
                    }
                    variant="underlined"
                    placeholderTextColor={'#0A211799'}
                    h={12}
                    fontSize={17}
                    onValueChange={itemValue =>
                      setForm({...form, role: itemValue})
                    }
                    _selectedItem={{
                      endIcon: <CheckIcon size={4} />,
                    }}>
                    <Select.Item label="Financeiro" value="Financeiro" />
                    <Select.Item label="Cuidador(a)" value="Cuidador(a)" />
                    <Select.Item
                      label="Acesso completo"
                      value="Acesso completo"
                    />
                    <Select.Item
                      label="Perfil Personalizado"
                      value="Perfil Personalizado"
                    />
                  </Select>
                  {!form.role && (
                    <BasicText
                      theme="dark"
                      opacity={0.25}
                      position="absolute"
                      top={2.5}
                      left="37.5%">
                      (opcional)
                    </BasicText>
                  )}
                </VStack>
              </VStack>

              <HStack w="100%" space={6} alignItems="center" marginTop={8}>
                <Text
                  color={'#018749'}
                  fontSize="15px"
                  fontFamily={'IBMPlexSans-SemiBold'}
                  fontWeight="semibold">
                  Funções
                </Text>
                <Divider flex={1} />
              </HStack>
              <VStack height={600}>
                <BasicText theme="#0A21178A" size={14}>
                  Clique nos ícones{' '}
                  <BasicText theme="dark" size={14} fontWeight="bold">
                    Visualizar
                  </BasicText>
                  ,{' '}
                  <BasicText theme="dark" size={14} fontWeight="bold">
                    Editar
                  </BasicText>{' '}
                  ou{' '}
                  <BasicText theme="dark" size={14} fontWeight="bold">
                    Excluir
                  </BasicText>{' '}
                  para determinar o que o usuário poderá fazer dentro de cada
                  função.
                </BasicText>

                <FlatList
                  data={allFunctions}
                  nestedScrollEnabled
                  maxToRenderPerBatch={1}
                  windowSize={1}
                  removeClippedSubviews={true}
                  renderItem={PermissionView}
                />
              </VStack>
            </VStack>
            <Pressable flex={1} onPress={() => Keyboard.dismiss()} />
          </ScrollView>
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
              px={6}
              width="45%"
              h={'50px'}
              alignItems="center"
              justifyContent="center"
              bg={'transparent'}
              onPress={clear}>
              <HStack space={2}>
                <MaterialCommunityIcons
                  name={'eraser'}
                  color={'#0A2117'}
                  size={24}
                />
                <BasicText theme="dark" fontWeight="medium">
                  Limpar
                </BasicText>
              </HStack>
            </Pressable>
            <Pressable
              borderRadius={50}
              px={6}
              width="45%"
              h={'50px'}
              alignItems="center"
              justifyContent="center"
              bg={valid === !loading ? '#0A2117' : '#0A21175A'}
              disabled={!valid === !loading}
              onPress={() => handleSubmit()}>
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
      )}
    </Formik>
  );
}

export default NewAdmin;
