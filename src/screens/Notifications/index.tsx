/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import {
  VStack,
  Text,
  Input,
  Button,
  HStack,
  Pressable,
  Divider,
  FlatList,
} from 'native-base';
import {useEffect, useState} from 'react';

import Modal from 'react-native-modal';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import BasicHeader from '../../components/BasicHeader';
type NotificationsProps = {
  title: string;
  message: string;
  hour: string;
  read: boolean;
};

type RequestNotificationsProps = {
  date: string;
  notifications: NotificationsProps[];
};

const BaseAllNotifications = [
  {
    date: '03/05/2023',
    notifications: [
      {
        title: 'Tilte',
        message:
          'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quisquam corporis illo autem similique rerum odit eveniet, neque quae ipsa nesciunt hic explicabo cum magnam iusto porro doloribus placeat eaque eligendi!',
        hour: '23h00',
        read: false,
      },
      {
        title: 'Tilte',
        message:
          'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quisquam corporis illo autem similique rerum odit eveniet, neque quae ipsa nesciunt hic explicabo cum magnam iusto porro doloribus placeat eaque eligendi!',
        hour: '16h00',
        read: false,
      },
      {
        title: 'Tilte',
        message:
          'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quisquam corporis illo autem similique rerum odit eveniet, neque quae ipsa nesciunt hic explicabo cum magnam iusto porro doloribus placeat eaque eligendi!',
        hour: '13h00',
        read: true,
      },
      {
        title: 'Tilte',
        message:
          'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quisquam corporis illo autem similique rerum odit eveniet, neque quae ipsa nesciunt hic explicabo cum magnam iusto porro doloribus placeat eaque eligendi!',
        hour: '09h00',
        read: true,
      },
    ],
  },
  {
    date: '02/05/2023',
    notifications: [
      {
        title: 'Tilte',
        message:
          'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quisquam corporis illo autem similique rerum odit eveniet, neque quae ipsa nesciunt hic explicabo cum magnam iusto porro doloribus placeat eaque eligendi!',
        hour: '23h00',
        read: false,
      },
      {
        title: 'Tilte',
        message:
          'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quisquam corporis illo autem similique rerum odit eveniet, neque quae ipsa nesciunt hic explicabo cum magnam iusto porro doloribus placeat eaque eligendi!',
        hour: '16h00',
        read: false,
      },
      {
        title: 'Tilte',
        message:
          'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quisquam corporis illo autem similique rerum odit eveniet, neque quae ipsa nesciunt hic explicabo cum magnam iusto porro doloribus placeat eaque eligendi!',
        hour: '13h00',
        read: true,
      },
      {
        title: 'Tilte',
        message:
          'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quisquam corporis illo autem similique rerum odit eveniet, neque quae ipsa nesciunt hic explicabo cum magnam iusto porro doloribus placeat eaque eligendi!',
        hour: '09h00',
        read: true,
      },
    ],
  },
];

const ListNotifications = (
  notification: RequestNotificationsProps[],
  all: boolean,
) => {
  return (
    <FlatList
      data={notification}
      showsVerticalScrollIndicator={false}
      renderItem={({item, index}) => {
        return (
          <VStack key={index} w="100%">
            <HStack w="100%" space={6} alignItems="center" marginTop={8}>
              <Text
                color={'#018749'}
                fontSize="15px"
                fontFamily={'IBMPlexSans-SemiBold'}
                fontWeight="semibold">
                {item.date}
              </Text>
              <Divider />
            </HStack>
            {item.notifications.map((notification, index) => {
              return all ? (
                <HStack
                  key={index}
                  w="100%"
                  justifyContent={'space-between'}
                  marginTop={8}>
                  <VStack w="80%">
                    <Text
                      fontSize={'17px'}
                      color={!notification.read ? '#0A2117' : '#0A211790'}
                      fontFamily={'Roboto-Medium'}
                      fontWeight="medium">
                      {notification.title}
                    </Text>
                    <Text
                      fontSize={'14px'}
                      color={'#0A211790'}
                      fontFamily={'Roboto-Regular'}>
                      {notification.message}
                    </Text>
                  </VStack>
                  <Text
                    fontSize={'17px'}
                    color={!notification.read ? '#0A2117' : '#0A211790'}
                    fontFamily={'Roboto-Medium'}
                    fontWeight="medium">
                    {notification.hour}
                  </Text>
                </HStack>
              ) : (
                all === notification.read && (
                  <HStack
                    key={index}
                    w="100%"
                    justifyContent={'space-between'}
                    marginTop={8}>
                    <VStack w="80%">
                      <Text
                        fontSize={'17px'}
                        color={!notification.read ? '#0A2117' : '#0A211790'}
                        fontFamily={'Roboto-Medium'}
                        fontWeight="medium">
                        {notification.title}
                      </Text>
                      <Text
                        fontSize={'14px'}
                        color={'#0A211790'}
                        fontFamily={'Roboto-Regular'}>
                        {notification.message}
                      </Text>
                    </VStack>
                    <Text
                      fontSize={'17px'}
                      color={!notification.read ? '#0A2117' : '#0A211790'}
                      fontFamily={'Roboto-Medium'}
                      fontWeight="medium">
                      {notification.hour}
                    </Text>
                  </HStack>
                )
              );
            })}
          </VStack>
        );
      }}
      ListFooterComponent={() => <VStack h={100} />}
    />
  );
};

function Notifications({navigation}: any) {
  const [showModal, setShowModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState(true);
  const [seach, setSeach] = useState('');
  const [AllNotificationsValues, setAllNotificationsValues] =
    useState<RequestNotificationsProps[]>(BaseAllNotifications);

  useEffect(() => {
    const AllNotificationsFiltered = BaseAllNotifications.filter(
      value => seach === value.date,
    );
    if (AllNotificationsFiltered.length > 0) {
      setAllNotificationsValues(AllNotificationsFiltered);
    } else {
      setAllNotificationsValues(BaseAllNotifications);
    }
  }, [seach]);

  return (
    <VStack flex={1} bg="#DCF7E3" justifyContent={'flex-start'} paddingX={6}>
      <BasicHeader
        navigation={navigation}
        name="Notificações"
        notification={true}
        showModal={() => setShowModal(true)}
      />
      <VStack flex={1} space={4} mt={2}>
        <HStack w={'100%'} alignItems="center" justifyContent={'space-between'}>
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
            value={seach}
            onChangeText={v => setSeach(v)}
          />
          <MaterialCommunityIcons
            color="#0A2117"
            name={'tune-variant'}
            size={28}
          />
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
            bg={!selectedTab ? 'transparent' : '#0A2117'}
            onPress={() => setSelectedTab(true)}>
            <Text
              fontSize={'17px'}
              color={!selectedTab ? '#0A2117' : '#DCF7E3'}
              fontFamily={'Roboto-Regular'}>
              Todas
            </Text>
          </Pressable>
          <Pressable
            borderWidth={1}
            borderColor="#0A211799"
            borderRadius={25}
            px={6}
            h={10}
            alignItems="center"
            justifyContent="center"
            bg={selectedTab ? 'transparent' : '#0A2117'}
            onPress={() => setSelectedTab(false)}>
            <Text
              fontSize={'17px'}
              color={selectedTab ? '#0A2117' : '#DCF7E3'}
              fontFamily={'Roboto-Regular'}>
              Não lidas
            </Text>
          </Pressable>
        </HStack>
        {selectedTab
          ? ListNotifications(AllNotificationsValues, true)
          : ListNotifications(AllNotificationsValues, false)}
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
          h={'50%'}
          bg="#DCF7E3"
          borderRadius={25}
          padding={6}
          space={4}
          alignItems="center"
          justifyContent={'center'}>
          <VStack alignItems="center" justifyContent={'center'}>
            <MaterialCommunityIcons
              name={'bell-check-outline'}
              color={'#0A2117'}
              size={36}
            />
            <Text
              fontSize={'32px'}
              color={'#0A2117'}
              fontFamily={'IBMPlexSans-Regular'}
              textAlign="center">
              Marcar como vistas?
            </Text>
          </VStack>
          <Text
            fontSize={'17px'}
            color={'#0A2117'}
            fontFamily={'Roboto-Regular'}
            textAlign="center">
            Deseja marcar todas as notificações como vistas?
          </Text>
          <Button
            h={'50px'}
            w={'100%'}
            borderRadius={24}
            bg="#0A2117"
            mt={4}
            onPress={() => {
              setShowModal(false);
            }}
            _pressed={{
              bg: '#0A4217',
            }}>
            <HStack space={2}>
              <MaterialIcons name={'done'} color={'#DCF7E3'} size={25} />
              <Text
                fontSize={'17px'}
                fontWeight={'medium'}
                color={'#DCF7E3'}
                fontFamily="Roboto-Medium">
                Sim, marcar
              </Text>
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
            <Text
              fontSize={'17px'}
              fontWeight={'bold'}
              color={'#0A2117'}
              fontFamily="Roboto-Bold">
              Voltar
            </Text>
          </Button>
        </VStack>
      </Modal>
    </VStack>
  );
}

export default Notifications;
