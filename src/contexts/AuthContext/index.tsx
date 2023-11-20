import React, {createContext, useEffect, useState} from 'react';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
interface Node {
  children: React.ReactNode;
}
export type UserProps = {
  name: string | undefined;
  last_name: string | undefined;
  username: string;
  type: string | undefined;
  cpf: string;
  phone: string;
  photo: string;
  recieve_notifications: boolean;
  token: string;
  first_login: boolean;
};

type AuthProps = {
  user: UserProps | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  register: (email: string) => Promise<void>;
  updateUser: (form: UserProps) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
};

export const AuthContext = createContext<AuthProps>({} as AuthProps);

const AuthProvider = ({children}: Node) => {
  const [user, setUser] = useState<UserProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function getUser() {
      try {
        const userRegisted = await AsyncStorage.getItem('@StriboApp_User');
        console.log(userRegisted);

        if (userRegisted) {
          setUser(JSON.parse(userRegisted));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    getUser();
  }, []);

  async function signIn(email: string, password: string) {
    try {
      const {data} = await axios.post(
        'https://api.escuelajs.co/api/v1/auth/login',
        {email, password},
      );
      setUser({
        name: '',
        last_name: '',
        username: 'marialmeida@gmail.com',
        type: 'Administrador',
        cpf: '987.654.321-00',
        phone: '(11) 98765 4321',
        photo:
          'https://zinnyfactor.com/wp-content/uploads/2020/04/93-938050_png-file-transparent-white-user-icon-png-download.jpg',
        recieve_notifications: true,
        token: data.access_token,
        first_login: true,
      });
      AsyncStorage.setItem(
        '@StriboApp_User',
        JSON.stringify({
          name: 'Maria',
          username: 'marialmeida@gmail.com',
          type: 'Administrador',
          cpf: '987.654.321-00',
          phone: '(11) 98765 4321',
          photo:
            'https://zinnyfactor.com/wp-content/uploads/2020/04/93-938050_png-file-transparent-white-user-icon-png-download.jpg',
          recieve_notifications: true,
          token: data.access_token,
          first_login: true,
        }),
      );

      console.log(data);

      Toast.show({
        type: 'success',
        text1: 'Login',
        text2: 'Efetuado com sucesso!',
      });
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Email ou senha incorretos',
        text2: 'Confira os dados e tente Novamente!',
      });
      throw error;
    }
  }

  async function register(name: string) {
    try {
      setUser({
        ...user,
        name: name,
        first_login: false,
      } as UserProps);
      AsyncStorage.setItem(
        '@StriboApp_User',
        JSON.stringify({
          name: name,
          username: user?.username,
          type: user?.type,
          cpf: user?.cpf,
          phone: user?.phone,
          photo: user?.photo,
          recieve_notifications: true,
          token: user?.token,
          first_login: false,
        }),
      );
      Toast.show({
        type: 'success',
        text1: 'Registro',
        text2: 'Efetuado com sucesso!',
      });
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Houve um Erro No Registro...',
        text2: 'Tente Novamente Mais Tarde!',
      });
    }
  }

  async function updateUser(form: UserProps) {
    try {
      setUser(form);
      AsyncStorage.setItem(
        '@StriboApp_User',
        JSON.stringify({
          name: form.name,
          last_name: form.last_name,
          username: form.username,
          type: form.type,
          cpf: form.cpf,
          phone: form.phone,
          photo: form.photo,
          recieve_notifications: form.recieve_notifications,
          token: form.token,
          first_login: form.first_login,
        }),
      );
      Toast.show({
        type: 'success',
        text1: 'Editado',
        text2: 'Atualizado com sucesso!',
      });
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Houve um Erro Na Edição...',
        text2: 'Tente Novamente Mais Tarde!',
      });
    }
  }

  async function forgotPassword(email: string) {
    try {
      // const response = await auth().sendPasswordResetEmail(email);
      console.log(email);
      Toast.show({
        type: 'success',
        text1: 'Email Enviado!',
        text2: 'Confira o Link Para a Redefinição da Sua Senha!',
      });
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Houve um Erro No Envio do Email...',
        text2: 'Tente Novamente Mais Tarde!',
      });
    }
  }

  async function signOut() {
    try {
      setUser(null);
      AsyncStorage.removeItem('@StriboApp_User');

      Toast.show({
        type: 'success',
        text1: 'Login',
        text2: 'Efetuado com sucesso!',
      });
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Email ou senha incorretos',
        text2: 'Confira os dados e tente Novamente!',
      });
      throw error;
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut,
        register,
        updateUser,
        forgotPassword,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
