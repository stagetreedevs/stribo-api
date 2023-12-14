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
  Tag,
} from 'native-base';
import {useCallback, useContext, useEffect, useState} from 'react';
import Header from '../../components/Header';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BasicText from '../../components/BasicText';
import Feather from 'react-native-vector-icons/Feather';
import {AuthContext} from '../../contexts/AuthContext';
import {api} from '../../service/api';
import userShape from '../../../assets/usershape.jpg';
import Toast from 'react-native-toast-message';
import {RefreshControl} from 'react-native-gesture-handler';
//import {AdminData} from './Data';

type Props = {
  navigation: any;
};
type AdminDataProps = {
  name: string;
  username: string;
  cpf: string;
  phone: string;
  role: string;
  status: string;
  photo: string;
};
function Properts({navigation}: Props) {
  const [focus, setFocus] = useState(0);
  const [selectedTab, setSelectedTab] = useState<number>(1);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [AdminData, setAdminData] = useState<AdminDataProps[]>(
    [] as AdminDataProps[],
  );
  const [search, setSearch] = useState<string>('');
  const {property, refresh} = useContext(AuthContext);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const searchAdmins = async () => {
        const {data} = await api.get(`property/${property?.id}/admins`);
        setAdminData(data);
        console.log('refreshing');
      };
      searchAdmins();
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
  }, [property?.id]);
  useEffect(() => {
    const searchAdmins = async () => {
      const {data} = await api.get(`property/${property?.id}/admins`);
      setAdminData(data);
    };
    searchAdmins();
  }, [property?.id, refresh]);

  const EmptyState = (
    <VStack
      width={'100%'}
      height={400}
      justifyContent="center"
      alignItems="center">
      <MaterialCommunityIcons
        color="#0A2117"
        name={'border-none-variant'}
        size={64}
        style={{
          marginBottom: 16,
        }}
      />
      <BasicText theme="dark" marginBottom={'20%'}>
        Você não possui administradores cadastrados
      </BasicText>
    </VStack>
  );

  const StockPage = (
    <>
      <HStack w={'100%'} alignItems="center" justifyContent={'space-between'}>
        <Input
          size={'lg'}
          w={'75%'}
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
        <Pressable onPress={() => navigation.navigate('FilterNotifications')}>
          <MaterialCommunityIcons
            color="#0A2117"
            name={'tune-variant'}
            size={24}
          />
        </Pressable>
        <Pressable onPress={() => navigation.navigate('FilterNotifications')}>
          <MaterialCommunityIcons
            color="#0A2117"
            name={'export-variant'}
            size={24}
          />
        </Pressable>
      </HStack>
    </>
  );

  const MovimentationPage = (
    <>
      <HStack w={'100%'} alignItems="center" justifyContent={'space-between'}>
        <Input
          size={'lg'}
          w={'75%'}
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
        <Pressable onPress={() => navigation.navigate('FilterNotifications')}>
          <MaterialCommunityIcons
            color="#0A2117"
            name={'tune-variant'}
            size={24}
          />
        </Pressable>
        <Pressable onPress={() => navigation.navigate('FilterNotifications')}>
          <MaterialCommunityIcons
            color="#0A2117"
            name={'export-variant'}
            size={24}
          />
        </Pressable>
      </HStack>
      <HStack space={2}>
        <Pressable
          borderWidth={1}
          borderColor="#0A211799"
          borderRadius={25}
          px={6}
          h={10}
          alignItems="center"
          justifyContent="center"
          bg={selectedTab !== 1 ? 'transparent' : '#0A2117'}
          onPress={() => setSelectedTab(1)}>
          <BasicText theme={selectedTab !== 1 ? 'dark' : 'light'}>
            Tudo
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
          onPress={() => setSelectedTab(2)}>
          <BasicText theme={selectedTab !== 2 ? 'dark' : 'light'}>
            Entrada
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
          bg={selectedTab !== 3 ? 'transparent' : '#0A2117'}
          onPress={() => setSelectedTab(3)}>
          <BasicText theme={selectedTab !== 3 ? 'dark' : 'light'}>
            Saída
          </BasicText>
        </Pressable>
      </HStack>
    </>
  );

  const Admin = (
    <FlatList
      data={AdminData}
      flex={1}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      renderItem={({item, index}) => (
        <Pressable onPress={() => navigation.navigate('EditAdmin', {item})}>
          <HStack key={index} justifyContent="space-between" marginY={2}>
            <HStack space={2}>
              <Image
                source={item.photo ? {uri: item.photo} : userShape}
                alt="userImage"
                h="50px"
                w="50px"
                borderRadius={25}
              />
              <VStack>
                <BasicText theme={'dark'}>
                  {item.status === 'Pendente' ? item.username : item.name}
                </BasicText>
                <BasicText theme={'dark'} size={14} opacity={0.5}>
                  {item.role}
                </BasicText>
              </VStack>
            </HStack>
            <Tag
              h={'25%'}
              p={0}
              borderRadius={4}
              bg={
                item.status === 'Ativo'
                  ? '#A9E8BA'
                  : item.status === 'Inativo'
                  ? '#0A211720'
                  : '#FFD78A'
              }>
              <BasicText theme="dark" size={14} marginX={0.5}>
                {item.status}
              </BasicText>
            </Tag>
          </HStack>
        </Pressable>
      )}
      ListEmptyComponent={EmptyState}
    />
  );

  return (
    <VStack flex={1} backgroundColor="#0A2117" justifyContent={'flex-end'}>
      <Header navigation={navigation} screen={'Propriedade'} />
      <FlatList
        data={['Estoque', 'Movimentações', 'Administradores']}
        horizontal
        maxHeight={12}
        showsHorizontalScrollIndicator={false}
        renderItem={({item, index}) => (
          <Pressable onPress={() => setFocus(index)}>
            <Text
              key={index}
              marginX={5}
              fontSize={'23px'}
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
        {focus === 0 ? StockPage : focus === 1 ? MovimentationPage : Admin}
      </VStack>
      <Pressable
        onPress={() => navigation.navigate('NewAdmin')}
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

export default Properts;
