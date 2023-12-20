/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import {Text, VStack, Pressable, HStack, FlatList, Input} from 'native-base';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Header from '../../components/Header';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
//import {AnimalsData as Data} from './Data';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import BasicText from '../../components/BasicText';
import Feather from 'react-native-vector-icons/Feather';
import {AnimalProps, AnimalsContext} from '../../contexts/AnimalsContext';
import Toast from 'react-native-toast-message';
import AnimalItem from './Animaltem';
import BottomSheet from '@gorhom/bottom-sheet';
import {RefreshControl} from 'react-native';

type Props = {
  navigation: any;
};
const SimpleMenu = () => {
  return (
    <Menu
      style={{
        flex: 1,
      }}>
      <MenuTrigger>
        <MaterialCommunityIcons
          name={'dots-vertical'}
          color={'#0A2117'}
          size={26}
        />
      </MenuTrigger>
      <MenuOptions
        customStyles={{
          optionsContainer: {
            backgroundColor: '#DCF7E3',
            borderRadius: 16,
            padding: 8,
            paddingHorizontal: 12,
            width: 'auto',
          },
        }}>
        <MenuOption onSelect={() => console.log()}>
          <HStack space={3} mr={4} alignItems="center">
            <BasicText size={16} theme="dark">
              Manejo Nutricional
            </BasicText>
          </HStack>
        </MenuOption>
        <MenuOption onSelect={() => console.log()}>
          <HStack space={3} mr={4} alignItems="center">
            <BasicText size={16} theme="dark">
              Procedimento Sanitário
            </BasicText>
          </HStack>
        </MenuOption>
        <MenuOption onSelect={() => console.log()}>
          <HStack space={3} mr={4} alignItems="center">
            <BasicText size={16} theme="dark">
              Procedimento Clínico
            </BasicText>
          </HStack>
        </MenuOption>
        <MenuOption onSelect={() => console.log()}>
          <HStack space={3} mr={4} alignItems="center">
            <BasicText size={16} theme="dark">
              Procedimento Reprodutivo
            </BasicText>
          </HStack>
        </MenuOption>
      </MenuOptions>
    </Menu>
  );
};

function Animals({navigation}: Props) {
  const {animals, getAnimals, deleteAnimal} = useContext(AnimalsContext);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [focus, setFocus] = useState(0);
  const [showSheet, setShowSheet] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['1%', '10%'], []);
  const handleSheetChanges = useCallback((index: number) => {
    if (index === 0) {
      setShowSheet(false);
      setSelected(null);
      setAnimalSelected(null);
    }
  }, []);
  const [AnimalsData, setAnimalsData] = useState(animals);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [animalSelected, setAnimalSelected] = useState<AnimalProps[] | null>(
    null,
  );
  const [search, setSearch] = useState<string>('');

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setSelected(null);
    setAnimalSelected(null);
    setShowSheet(false);
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
    setAnimalSelected(null);
    setSelected(null);
    setShowSheet(false);
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
  const setIndexSelected = (
    index: number | null,
    item: AnimalProps | null,
    pop: boolean,
  ) => {
    // console.log(index);

    setSelected(index);

    if (animalSelected) {
      if (animalSelected.length > 0) {
        if (item) {
          if (pop) {
            const animalArr = animalSelected.filter(
              animal => animal.id !== item.id,
            );
            if (animalArr.length === 0) {
              console.log(animalArr.length === 0);

              setAnimalSelected(null);
              setShowSheet(false);
            } else {
              setAnimalSelected(animalArr);
            }
          } else {
            const animalArr = animalSelected;
            animalArr.push(item);
            setAnimalSelected(animalArr);
          }
        } else {
          console.log(showSheet);

          setAnimalSelected(null);
          setShowSheet(false);
        }
      }
    } else {
      if (item && !pop) {
        setAnimalSelected([item]);
        setShowSheet(true);
      } else {
        setAnimalSelected(null);
        setShowSheet(false);
      }
    }
  };

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
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({item}) => (
          <VStack key={item.id}>
            <AnimalItem
              item={item}
              selected={selected}
              showSheet={showSheet}
              setSelected={setIndexSelected}
              navigation={navigation}
            />
          </VStack>
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
        bottom={showSheet ? '12.5%' : '2.5%'}
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
      {showSheet && animalSelected && (
        <BottomSheet
          ref={bottomSheetRef}
          index={1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          backgroundStyle={{
            backgroundColor: '#DCF7E3',
            borderWidth: 1,
            borderColor: '#00000030',
            borderRadius: 25,
          }}>
          <HStack
            flex={1}
            px={8}
            alignItems="center"
            justifyContent="space-between">
            <Pressable onPress={() => handleSheetChanges(0)}>
              <MaterialCommunityIcons
                color="#0A2117"
                name={'checkbox-multiple-marked'}
                size={22}
              />
            </Pressable>
            <HStack space={4} w={animalSelected.length === 1 ? '30%' : '20%'}>
              {animalSelected.length === 1 ? (
                <Pressable
                  onPress={() => {
                    return navigation.navigate('EditAnimal', {
                      item: animalSelected[0],
                    });
                  }}>
                  <MaterialCommunityIcons
                    color="#0A2117"
                    name={'pencil-outline'}
                    size={22}
                  />
                </Pressable>
              ) : null}
              <Pressable
                onPress={() => {
                  if (animalSelected.length > 0) {
                    animalSelected.forEach(item => {
                      deleteAnimal(item.id);
                    });
                  } else {
                    deleteAnimal(animalSelected[0].id);
                  }
                }}>
                <MaterialCommunityIcons
                  color="#0A2117"
                  name={'trash-can-outline'}
                  size={22}
                />
              </Pressable>
              <SimpleMenu />
            </HStack>
          </HStack>
        </BottomSheet>
      )}
    </VStack>
  );
}

export default Animals;
