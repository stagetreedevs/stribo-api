/* eslint-disable @typescript-eslint/no-shadow */
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
import {useContext, useEffect, useState} from 'react';

import Modal from 'react-native-modal';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import BasicHeader from '../../components/BasicHeader';
import BasicText from '../../components/BasicText';
import {
  NotificationContext,
  RequestNotificationsProps,
} from '../../contexts/NotificationContext';

const EmptyState = (
  <VStack flex={1} justifyContent="center" alignItems="center">
    <MaterialCommunityIcons
      color="#0A2117"
      name={'mailbox-open-up-outline'}
      size={64}
      style={{
        marginBottom: 16,
      }}
    />
    <BasicText theme="dark" marginBottom={'20%'}>
      Sua Caixa de Notificações está vazia
    </BasicText>
  </VStack>
);
const ListNotifications = (
  notification: RequestNotificationsProps[],
  all: boolean,
) => {
  return (
    <FlatList
      data={notification}
      showsVerticalScrollIndicator={false}
      renderItem={({item, index}) => {
        const date = new Date(item.date).toLocaleDateString('pt-BR');
        return (
          <VStack key={index} w="100%">
            <HStack w="100%" space={6} alignItems="center" marginTop={8}>
              <Text
                color={'#018749'}
                fontSize="15px"
                fontFamily={'IBMPlexSans-SemiBold'}
                fontWeight="semibold">
                {date}
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
                    <BasicText
                      theme="dark"
                      fontWeight="medium"
                      opacity={notification.read ? 0.5 : 1}>
                      {notification.title}
                    </BasicText>
                    <BasicText theme="dark" size={14} opacity={0.5}>
                      {notification.message}
                    </BasicText>
                  </VStack>
                  <BasicText
                    theme="dark"
                    fontWeight="medium"
                    opacity={notification.read ? 0.5 : 1}>
                    {notification.hour}
                  </BasicText>
                </HStack>
              ) : (
                all === notification.read && (
                  <HStack
                    key={index}
                    w="100%"
                    justifyContent={'space-between'}
                    marginTop={8}>
                    <VStack w="80%">
                      <BasicText
                        theme="dark"
                        fontWeight="medium"
                        opacity={notification.read ? 0.5 : 1}>
                        {notification.title}
                      </BasicText>
                      <BasicText theme="dark" size={14} opacity={0.5}>
                        {notification.message}
                      </BasicText>
                    </VStack>
                    <BasicText
                      theme="dark"
                      fontWeight="medium"
                      opacity={notification.read ? 0.5 : 1}>
                      {notification.hour}
                    </BasicText>
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
  const [search, setSearch] = useState('');
  const {notifications, allNotificationsReads} =
    useContext(NotificationContext);
  const [AllNotificationsValues, setAllNotificationsValues] = useState<
    RequestNotificationsProps[] | null
  >();

  useEffect(() => {
    setAllNotificationsValues(notifications);
  }, [notifications]);

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
            value={search}
            onChangeText={v => setSearch(String(v))}
          />
          <Pressable onPress={() => navigation.navigate('FilterNotifications')}>
            <MaterialCommunityIcons
              color="#0A2117"
              name={'tune-variant'}
              size={28}
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
            bg={!selectedTab ? 'transparent' : '#0A2117'}
            onPress={() => setSelectedTab(true)}>
            <BasicText theme={!selectedTab ? 'dark' : 'light'}>Todas</BasicText>
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
            <BasicText theme={selectedTab ? 'dark' : 'light'}>
              Não lidas
            </BasicText>
          </Pressable>
        </HStack>
        {AllNotificationsValues && AllNotificationsValues?.length > 0
          ? selectedTab
            ? ListNotifications(AllNotificationsValues, true)
            : ListNotifications(AllNotificationsValues, false)
          : EmptyState}
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
          <BasicText theme="dark" textAlign="center">
            Deseja marcar todas as notificações como vistas?
          </BasicText>
          <Button
            h={'50px'}
            w={'100%'}
            borderRadius={24}
            bg="#0A2117"
            mt={4}
            onPress={() => {
              allNotificationsReads();
              setShowModal(false);
            }}
            _pressed={{
              bg: '#0A4217',
            }}>
            <HStack space={2}>
              <MaterialIcons name={'done'} color={'#DCF7E3'} size={25} />
              <BasicText theme="light" fontWeight={'medium'}>
                Sim, marcar
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
              Voltar
            </BasicText>
          </Button>
        </VStack>
      </Modal>
    </VStack>
  );
}

export default Notifications;
