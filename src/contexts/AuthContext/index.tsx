/* eslint-disable @typescript-eslint/no-shadow */
import React, {createContext, useEffect, useState} from 'react';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {api} from '../../service/api';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
interface Node {
  children: React.ReactNode;
}
export type UserProps = {
  id: string;
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
export type Property = {
  admins: string[];
  id: string;
  name: string;
  code: string;
  owner: string;
};

type AuthProps = {
  user: UserProps | null;
  property: Property | null;
  loading: boolean;
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  signIn: (email: string, password: string) => Promise<void>;
  signInGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  register: (name: string, newPassword: string) => Promise<void>;
  addProperty: (name: string, code?: string) => Promise<void>;
  updateUser: (form: any) => Promise<void>;
  editPassword: (password: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
};
GoogleSignin.configure({
  webClientId:
    '537488061151-knbo4dhmekrisck2lm2hbl6qlceomsnl.apps.googleusercontent.com',
});
export const AuthContext = createContext<AuthProps>({} as AuthProps);

const AuthProvider = ({children}: Node) => {
  const [user, setUser] = useState<UserProps | null>(null);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(true);

  async function getProperty() {
    try {
      const userRegisted = await AsyncStorage.getItem('@StriboApp_User');
      if (userRegisted) {
        const {data} = await api.get(
          `property/user/${JSON.parse(userRegisted)}/properties`,
        );
        setProperty(data[0]);
      }
    } catch (error) {
      setProperty(null);
      console.log(error);
    }
  }
  useEffect(() => {
    async function getUser() {
      try {
        const userRegisted = await AsyncStorage.getItem('@StriboApp_User');
        const Token = await AsyncStorage.getItem('@StriboApp_Token');

        if (Token) {
          api.defaults.headers.Authorization = `Bearer ${JSON.parse(Token)}`;
        }

        if (userRegisted && Token) {
          const getUserData = async () => {
            const {data} = await api.get<UserProps>(
              `user/${JSON.parse(userRegisted)}`,
            );
            return data;
          };

          Promise.all([getUserData(), getProperty()])
            .then(responses => {
              setUser(responses[0]);
            })
            .finally(() => setLoading(false));
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
    getUser();
  }, []);

  async function addProperty(name: string, code?: string) {
    console.log(api.defaults.headers, {
      name: name,
      code: code ? code : '',
      owner: user?.id,
    });

    try {
      const {data} = await api.post('property', {
        name: name,
        code: code ? code : '',
        owner: user?.id,
      });
      setProperty(data);
      Toast.show({
        type: 'success',
        text1: 'Propriedade',
        text2: 'Cadastrada com sucesso!',
      });
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Não foi possível cadastrar sua propriedade',
        text2: 'Confira os dados e tente Novamente!',
      });
      throw error;
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const {data} = await api.post('login', {username: email, password});
      setUser(data.user);
      api.defaults.headers.Authorization = `Bearer ${data.accessToken}`;
      AsyncStorage.setItem(
        '@StriboApp_Token',
        JSON.stringify(data.accessToken),
      );
      AsyncStorage.setItem('@StriboApp_User', JSON.stringify(data.user.id));

      getProperty();

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
  async function signInGoogle() {
    try {
      await GoogleSignin.hasPlayServices();
      const {user} = await GoogleSignin.signIn();
      const {data} = await api.post('user/auth-db', {
        email: user.email,
        firstName: user.givenName,
        lastName: user.familyName,
        picture: user.photo,
      });
      setUser(data.user);
      api.defaults.headers.Authorization = `Bearer ${data.accessToken}`;
      AsyncStorage.setItem(
        '@StriboApp_Token',
        JSON.stringify(data.accessToken),
      );
      AsyncStorage.setItem('@StriboApp_User', JSON.stringify(data.user.id));

      getProperty();

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

  async function register(name: string, newPassword: string) {
    try {
      if (user) {
        if (user.type === 'admin') {
          const {data} = await api.patch(`admin/${user.id}/firstLogin`, {
            name,
            newPassword,
          });
          AsyncStorage.setItem(
            '@StriboApp_Token',
            JSON.stringify(data.accessToken),
          );
          api.defaults.headers.Authorization = `Bearer ${data.accessToken}`;
        } else {
          const {data} = await api.patch(`user/${user.id}/firstLogin`, {
            name,
            newPassword,
          });
          AsyncStorage.setItem(
            '@StriboApp_Token',
            JSON.stringify(data.accessToken),
          );
          api.defaults.headers.Authorization = `Bearer ${data.accessToken}`;
        }

        setUser({
          ...user,
          name: name,
          first_login: false,
        } as UserProps);
      }
      Toast.show({
        type: 'success',
        text1: 'Registro',
        text2: 'Efetuado com sucesso!',
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Houve um Erro No Registro...',
        text2: 'Tente Novamente Mais Tarde!',
      });
    }
  }

  async function updateUser(form: any) {
    try {
      const {data} = await api.put(`user/${user?.id}`, form, {
        headers: {'Content-Type': ' multipart/form-data'},
      });
      console.log(form);
      setUser(data);
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
  async function editPassword(password: string) {
    try {
      console.log(user?.id, password);

      await api.patch(`user/${user?.id}/password`, {newPassword: password});

      Toast.show({
        type: 'success',
        text1: 'Senha redefinida!',
        text2: 'Confira o Link Para a Redefinição da Sua Senha!',
      });
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Houve um Erro Na redefinição de senha...',
        text2: 'Tente Novamente Mais Tarde!',
      });
    }
  }

  async function signOut() {
    try {
      setUser(null);
      AsyncStorage.removeItem('@StriboApp_User');
      AsyncStorage.removeItem('@StriboApp_Token');
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
        property,
        loading,
        refresh,
        setRefresh,
        signIn,
        signInGoogle,
        signOut,
        register,
        addProperty,
        updateUser,
        forgotPassword,
        editPassword,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
