/* eslint-disable react/react-in-jsx-scope */
import {
  CheckIcon,
  Divider,
  FlatList,
  HStack,
  Pressable,
  ScrollView,
  Select,
  Text,
  VStack,
} from 'native-base';
import {useState} from 'react';
import BasicHeader from '../../../components/BasicHeader';
import BasicText from '../../../components/BasicText';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Keyboard} from 'react-native';
import BasicInput from '../../../components/BasicInput';
import {functions} from '../Data';

function NewAdmin({navigation}: any) {
  const [form, setForm] = useState({
    email: '',
    cpf: '',
    tel: '',
    profile: '',
  });

  return (
    <VStack flex={1} bg="#DCF7E3" paddingX={6}>
      <BasicHeader navigation={navigation} name="Novo Administrador" />

      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <VStack>
          <BasicInput
            text={form.email}
            label="Email do Administrador"
            onChangeText={v => setForm({...form, email: v})}
          />
        </VStack>
        <VStack>
          <BasicInput
            text={form.cpf}
            label="CPF do Administrador"
            onChangeText={v => setForm({...form, cpf: v})}
          />
        </VStack>
        <VStack>
          <BasicInput
            text={form.tel}
            label="Telefone do Administrador"
            onChangeText={v => setForm({...form, tel: v})}
          />
        </VStack>
        <VStack marginY={4} space={4}>
          <BasicText theme="dark" size={14} opacity={0.5}>
            Selecione abaixo um perfil pré-configurado e/ou marque a seguir as
            funções às quais o usuário terá acesso.
          </BasicText>
          <VStack>
            <Select
              selectedValue={form.profile}
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
                setForm({...form, profile: itemValue})
              }
              _selectedItem={{
                endIcon: <CheckIcon size={4} />,
              }}>
              <Select.Item label="JavaScript" value="js" />
            </Select>
            {!form.profile && (
              <BasicText
                theme="dark"
                opacity={0.25}
                position="absolute"
                top={2.5}
                left="37.5%">
                (opicional)
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
        <FlatList
          data={functions}
          height={575}
          showsVerticalScrollIndicator={false}
          renderItem={({item, index}) => {
            return (
              <VStack key={index} w="100%" my={2}>
                <HStack w="100%" justifyContent={'space-between'} my={2}>
                  <Text
                    color={'#0A2117'}
                    fontSize="16px"
                    fontFamily={'IBMPlexSans-SemiBold'}
                    fontWeight="semibold">
                    {item.name}
                  </Text>
                  <HStack space={4} mr={2}>
                    <MaterialCommunityIcons
                      name={'eye-outline'}
                      size={20}
                      color="#0A211785"
                    />
                    <MaterialCommunityIcons
                      name={'pencil-outline'}
                      size={20}
                      color="#0A211785"
                    />
                    <MaterialCommunityIcons
                      name={'trash-can-outline'}
                      size={20}
                      color="#0A211785"
                    />
                  </HStack>
                </HStack>
                <VStack
                  borderLeftWidth={0.75}
                  borderColor="#0A211785"
                  space={2}
                  p={2}>
                  {item.props.map((propName, index) => (
                    <HStack
                      key={index}
                      w="100%"
                      justifyContent={'space-between'}
                      my={2}>
                      <VStack>
                        <BasicText theme="dark">{propName}</BasicText>
                      </VStack>
                      <HStack space={4}>
                        <MaterialCommunityIcons
                          name={'eye-outline'}
                          size={20}
                          color="#0A211785"
                        />
                        <MaterialCommunityIcons
                          name={'pencil-outline'}
                          size={20}
                          color="#0A211785"
                        />
                        <MaterialCommunityIcons
                          name={'trash-can-outline'}
                          size={20}
                          color="#0A211785"
                        />
                      </HStack>
                    </HStack>
                  ))}
                </VStack>
              </VStack>
            );
          }}
          ListFooterComponent={() => <VStack h={100} />}
        />
        <Pressable flex={1} onPress={() => Keyboard.dismiss()} />
      </ScrollView>
      <Divider borderColor="#0A2117" borderWidth={0.5} w={1000} marginX={-10} />
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
          onPress={() => navigation.goBack()}>
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
          borderWidth={1}
          borderColor="#0A211799"
          borderRadius={50}
          px={6}
          width="45%"
          h={'50px'}
          alignItems="center"
          justifyContent="center"
          bg={'#0A2117'}
          onPress={() => navigation.goBack()}>
          <HStack space={2}>
            <MaterialCommunityIcons
              name={'check'}
              color={'#DCF7E3'}
              size={24}
            />
            <BasicText theme="light" fontWeight="medium">
              Adicionar
            </BasicText>
          </HStack>
        </Pressable>
      </HStack>
    </VStack>
  );
}

export default NewAdmin;
