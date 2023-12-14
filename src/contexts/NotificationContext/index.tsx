/* eslint-disable react/react-in-jsx-scope */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createContext, useEffect, useState} from 'react';
import Toast from 'react-native-toast-message';
import {api} from '../../service/api';

interface Node {
  children: React.ReactNode;
}

export type NotificationsProps = {
  title: string;
  message: string;
  hour: string;
  read: boolean;
};
export type RequestNotificationsProps = {
  date: string;
  notifications: NotificationsProps[];
};
type NotificationFilter = {
  order: string;
  initialDate: Date;
  lastDate: Date;
  animal: string;
  operator: string;
  category: string;
  subCategory: string;
};
type NotificationsContextProps = {
  notifications: RequestNotificationsProps[] | null;
  refresh: boolean;
  setNotifications: React.Dispatch<
    React.SetStateAction<RequestNotificationsProps[] | null>
  >;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  getNotifications: () => Promise<void>;
  allNotificationsReads: () => Promise<void>;
  FilterNotifications: (form: NotificationFilter) => Promise<void>;
};

export const NotificationContext = createContext<NotificationsContextProps>(
  {} as NotificationsContextProps,
);

const NotificationProvider = ({children}: Node) => {
  const [notifications, setNotifications] = useState<
    RequestNotificationsProps[] | null
  >(null);
  const [refresh, setRefresh] = useState<boolean>(true);

  const getNotifications = async () => {
    try {
      const userRegisted = await AsyncStorage.getItem('@StriboApp_User');
      const Token = await AsyncStorage.getItem('@StriboApp_Token');
      if (userRegisted && Token) {
        api.defaults.headers.Authorization = `Bearer ${JSON.parse(Token)}`;
        const {data} = await api.get<RequestNotificationsProps[]>(
          `notification/${JSON.parse(userRegisted)}/all`,
        );
        console.log(data);

        setNotifications(data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getNotifications();
  }, [refresh]);

  const allNotificationsReads = async () => {
    try {
      const userRegisted = await AsyncStorage.getItem('@StriboApp_User');
      if (userRegisted) {
        await api.patch(
          `notification/${JSON.parse(userRegisted)}/mark-all-read`,
        );
        setRefresh(!refresh);
        Toast.show({
          type: 'success',
          text1: 'Sucesso!',
          text2: 'Todas as notificações foram marcadas como lidas!',
        });
      }
    } catch (error) {
      console.log(error);

      Toast.show({
        type: 'error',
        text1: 'Não foi possível marcar como lidas!',
        text2: 'Tente Novamente mais tarde!',
      });
    }
  };
  const FilterNotifications = async (form: NotificationFilter) => {
    try {
      const {data} = await api.post<RequestNotificationsProps[]>(
        'notification/filter',
        form,
      );
      console.log('data =>', data);
      if (!data) {
        return setNotifications(null);
      }
      setNotifications(data);
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Não foi possível filtrar suas notificações!',
        text2: 'Tente Novamente mais tarde!',
      });
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        refresh,
        setNotifications,
        setRefresh,
        getNotifications,
        allNotificationsReads,
        FilterNotifications,
      }}>
      {children}
    </NotificationContext.Provider>
  );
};
export default NotificationProvider;
