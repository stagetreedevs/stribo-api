import React, {createContext, useEffect, useState} from 'react';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
interface Node {
  children: React.ReactNode;
}

type AuthProps = {
  user: any;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
};

export const AuthContext = createContext<AuthProps>({} as AuthProps);

const AuthProvider = ({children}: Node) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function getUser() {
      try {
        const userRegisted = await AsyncStorage.getItem('@StriboApp_UserToken');
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
      setUser(data.access_token);
      AsyncStorage.setItem(
        '@StriboApp_UserToken',
        JSON.stringify(data.access_token),
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

  async function register(email: string, password: string) {
    try {
      // const response = await auth().createUserWithEmailAndPassword(
      //   email,
      //   password,
      // );
      console.log();
      AsyncStorage.setItem('@TherapyHubPsy', JSON.stringify(''));
      setUser('');
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

  async function forgotPassword(email: string) {
    try {
      // const response = await auth().sendPasswordResetEmail(email);
      // console.log(response);
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

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        register,
        forgotPassword,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
