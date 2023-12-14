/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import {
  Text,
  VStack,
  Pressable,
  HStack,
  FlatList,
  Input,
  Image,
} from 'native-base';
import {useCallback, useContext, useEffect, useState} from 'react';
import Header from '../../components/Header';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
//import {AnimalsData as Data} from './Data';
import BasicText from '../../components/BasicText';
import Feather from 'react-native-vector-icons/Feather';
import {AnimalsContext} from '../../contexts/AnimalsContext';
import {RefreshControl} from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

type Props = {
  navigation: any;
};

function Animals({navigation}: Props) {
  const {animals, getAnimals} = useContext(AnimalsContext);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [focus, setFocus] = useState(0);
  const [AnimalsData, setAnimalsData] = useState(animals);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [search, setSearch] = useState<string>('');

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      getAnimals();
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Não foi possivel atualizar a página',
        text2: 'Tente Novamente mais tarde!',
      });
    } finally {
      setRefreshing(false);
    }
  }, [getAnimals]);
  useEffect(() => {
    setAnimalsData(animals);
  }, [animals]);

  const EmptyState = (
    <VStack
      width={'100%'}
      height={250}
      justifyContent="center"
      alignItems="center">
      <MaterialCommunityIcons
        color="#0A2117"
        name={'horse-variant'}
        size={64}
        style={{
          marginBottom: 16,
        }}
      />
      <BasicText theme="dark">Sua caixa de animais está vazia</BasicText>
    </VStack>
  );

  const AnimalsPage = (
    <VStack flex={1}>
      <VStack>
        <HStack w={'100%'} alignItems="center">
          <Input
            size={'lg'}
            w={'85%'}
            height={'52px'}
            variant={'outline'}
            placeholder="Buscar"
            placeholderTextColor={'#0A211799'}
            borderColor={'#0A211799'}
            type={'text'}
            borderRadius={25}
            _focus={{
              borderColor: '#0A2117',
              color: '#0A2117',
              bg: '#00000000',
            }}
            InputRightElement={
              <MaterialCommunityIcons
                color="#0A2117"
                name={'magnify'}
                size={24}
                style={{
                  marginHorizontal: 16,
                }}
              />
            }
            value={search}
            onChangeText={v => setSearch(String(v))}
          />
          <VStack flex={1} alignItems="center" pl={2}>
            <Pressable onPress={() => navigation.navigate('FilterAnimals')}>
              <MaterialCommunityIcons
                color="#0A2117"
                name={'tune-variant'}
                size={28}
              />
            </Pressable>
          </VStack>
        </HStack>
        <HStack space={2} mt={4}>
          <Pressable
            borderWidth={1}
            borderColor="#0A211799"
            borderRadius={25}
            px={6}
            h={10}
            alignItems="center"
            justifyContent="center"
            bg={selectedTab !== 0 ? 'transparent' : '#0A2117'}
            onPress={() => {
              setSelectedTab(0);
              setAnimalsData(animals);
            }}>
            <BasicText theme={selectedTab !== 0 ? 'dark' : 'light'}>
              Todos
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
            bg={selectedTab !== 1 ? 'transparent' : '#0A2117'}
            onPress={() => {
              setSelectedTab(1);
              if (animals) {
                setAnimalsData(animals.filter(item => item.sex === 'male'));
              }
            }}>
            <BasicText theme={selectedTab !== 1 ? 'dark' : 'light'}>
              Machos
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
            bg={selectedTab !== 2 ? 'transparent' : '#0A2117'}
            onPress={() => {
              setSelectedTab(2);
              if (animals) {
                setAnimalsData(animals.filter(item => item.sex === 'female'));
              }
            }}>
            <BasicText theme={selectedTab !== 2 ? 'dark' : 'light'}>
              Fêmeas
            </BasicText>
          </Pressable>
        </HStack>
      </VStack>
      <FlatList
        mt={4}
        data={AnimalsData}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({item, index}) => (
          <Pressable onPress={() => navigation.navigate('EditAnimal', {item})}>
            <HStack key={index} justifyContent="space-between" marginY={2}>
              <HStack space={2}>
                {item.photo ? (
                  <Image
                    source={{uri: item.photo}}
                    alt="userImage"
                    h="50px"
                    w="50px"
                    borderRadius={25}
                    borderColor="#0A2117"
                  />
                ) : (
                  <VStack
                    borderRadius={25}
                    borderWidth={0.5}
                    h="50px"
                    w="50px"
                    justifyContent="center"
                    alignItems="center">
                    <MaterialCommunityIcons
                      name={'horse-variant'}
                      size={35}
                      style={{
                        marginTop: 2,
                      }}
                      color={'#0A2117'}
                    />
                  </VStack>
                )}
                <VStack>
                  <BasicText theme={'dark'}>{item.name}</BasicText>
                  <BasicText theme={'dark'} size={14} opacity={0.5}>
                    {item.castrated ? item.registerNumber : 'Sem registro'}
                  </BasicText>
                </VStack>
              </HStack>
            </HStack>
          </Pressable>
        )}
        ListEmptyComponent={EmptyState}
      />
    </VStack>
  );

  const Clinical = (
    <VStack>
      <HStack w={'100%'} alignItems="center">
        <Input
          size={'lg'}
          w={'85%'}
          height={'52px'}
          variant={'outline'}
          placeholder="Buscar"
          placeholderTextColor={'#0A211799'}
          borderColor={'#0A211799'}
          type={'text'}
          borderRadius={25}
          _focus={{
            borderColor: '#0A2117',
            color: '#0A2117',
            bg: '#00000000',
          }}
          InputRightElement={
            <MaterialCommunityIcons
              color="#0A2117"
              name={'magnify'}
              size={24}
              style={{
                marginHorizontal: 16,
              }}
            />
          }
          value={search}
          onChangeText={v => setSearch(String(v))}
        />
        <VStack flex={1} alignItems="center" pl={2}>
          <Pressable onPress={() => navigation.navigate('FilterNotifications')}>
            <MaterialCommunityIcons
              color="#0A2117"
              name={'tune-variant'}
              size={28}
            />
          </Pressable>
        </VStack>
      </HStack>
      <HStack space={2} mt={4} width="105%">
        <FlatList
          data={['Todos', 'Anteriores', 'Próximos', 'Hoje']}
          horizontal
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <VStack w={2} />}
          renderItem={({item, index}) => (
            <Pressable
              key={index}
              borderWidth={1}
              borderColor="#0A211799"
              borderRadius={25}
              mr={index === 3 ? 4 : 0}
              px={6}
              h={10}
              alignItems="center"
              justifyContent="center"
              bg={selectedTab !== index ? 'transparent' : '#0A2117'}
              onPress={() => setSelectedTab(index)}>
              <BasicText theme={selectedTab !== index ? 'dark' : 'light'}>
                {item}
              </BasicText>
            </Pressable>
          )}
        />
      </HStack>
    </VStack>
  );

  const Reproductive = (
    <VStack>
      <HStack w={'100%'} alignItems="center">
        <Input
          size={'lg'}
          w={'85%'}
          height={'52px'}
          variant={'outline'}
          placeholder="Buscar"
          placeholderTextColor={'#0A211799'}
          borderColor={'#0A211799'}
          type={'text'}
          borderRadius={25}
          _focus={{
            borderColor: '#0A2117',
            color: '#0A2117',
            bg: '#00000000',
          }}
          InputRightElement={
            <MaterialCommunityIcons
              color="#0A2117"
              name={'magnify'}
              size={24}
              style={{
                marginHorizontal: 16,
              }}
            />
          }
          value={search}
          onChangeText={v => setSearch(String(v))}
        />
        <VStack flex={1} alignItems="center" pl={2}>
          <Pressable onPress={() => navigation.navigate('FilterNotifications')}>
            <MaterialCommunityIcons
              color="#0A2117"
              name={'tune-variant'}
              size={28}
            />
          </Pressable>
        </VStack>
      </HStack>
      <HStack space={2} mt={4} width="105%">
        <FlatList
          data={['Todos', 'Anteriores', 'Próximos', 'Hoje']}
          horizontal
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <VStack w={2} />}
          renderItem={({item, index}) => (
            <Pressable
              key={index}
              borderWidth={1}
              borderColor="#0A211799"
              borderRadius={25}
              mr={index === 3 ? 4 : 0}
              px={6}
              h={10}
              alignItems="center"
              justifyContent="center"
              bg={selectedTab !== index ? 'transparent' : '#0A2117'}
              onPress={() => setSelectedTab(index)}>
              <BasicText theme={selectedTab !== index ? 'dark' : 'light'}>
                {item}
              </BasicText>
            </Pressable>
          )}
        />
      </HStack>
    </VStack>
  );

  const Management = <BasicText theme="dark">Gerenciamento</BasicText>;

  const Competitions = <BasicText theme="dark">Competições</BasicText>;

  return (
    <VStack flex={1} backgroundColor="#0A2117" justifyContent={'flex-end'}>
      <Header navigation={navigation} screen={'Animais'} />
      <FlatList
        data={[
          'Animais',
          'Clínico',
          'Reprodutivo',
          'Gerenciamentos',
          'Competições',
        ]}
        horizontal
        showsHorizontalScrollIndicator={false}
        maxHeight={12}
        renderItem={({item, index}) => (
          <Pressable
            onPress={() => {
              setSelectedTab(0);
              setFocus(index);
            }}>
            <Text
              key={index}
              marginX={5}
              fontSize={'22px'}
              color={focus === index ? '#DCF7E3' : '#DCF7E350'}
              fontFamily={'IBMPlexSans-Regular'}
              fontWeight={'normal'}>
              {item}
            </Text>
          </Pressable>
        )}
      />
      <VStack
        flex={1}
        backgroundColor="#DCF7E3"
        justifyContent={'flex-start'}
        borderTopRadius={25}
        p={4}
        space={2}>
        {focus === 0
          ? AnimalsPage
          : focus === 1
          ? Clinical
          : focus === 2
          ? Reproductive
          : focus === 3
          ? Management
          : Competitions}
      </VStack>
      <Pressable
        onPress={() => navigation.navigate('NewAnimal')}
        position="absolute"
        right={'5%'}
        bottom={'2.5%'}
        shadow="6">
        <VStack
          justifyContent="center"
          alignItems={'center'}
          backgroundColor={'#6AF3B4'}
          w={'72px'}
          h={'72px'}
          borderRadius={20}>
          <Feather name={'plus'} color={'#0A2117'} size={25} />
        </VStack>
      </Pressable>
    </VStack>
  );
}

export default Animals;
