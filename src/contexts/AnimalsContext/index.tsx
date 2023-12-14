/* eslint-disable react/react-in-jsx-scope */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createContext, useEffect, useState} from 'react';
import Toast from 'react-native-toast-message';
import {api} from '../../service/api';

interface Node {
  children: React.ReactNode;
}

export type AnimalProps = {
  owner: string;
  name: string;
  race: string;
  coat: string;
  registerNumber: string;
  property: string;
  sex: string;
  photo: string;
  occupation: string;
  castrated: boolean;
  sale: string;
  value: string;
  birthDate: string;
  castrationDate: string;
  father: string;
  mother: string;
};
type AnimalFilter = {
  order: string;
  initialDate: Date;
  lastDate: Date;
  race: string;
  coat: string;
  sex: string;
  live: boolean;
  nutritional: string;
};

type AnimalContextProps = {
  animals: AnimalProps[] | null;
  refresh: boolean;
  setAnimals: React.Dispatch<React.SetStateAction<AnimalProps[] | null>>;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  getAnimals: () => Promise<void>;
  editAnimal: () => Promise<void>;
  filterAnimal: (form: AnimalFilter) => Promise<void>;
};

export const AnimalsContext = createContext<AnimalContextProps>(
  {} as AnimalContextProps,
);

const AnimalsProvider = ({children}: Node) => {
  const [animals, setAnimals] = useState<AnimalProps[] | null>(null);
  const [refresh, setRefresh] = useState<boolean>(true);

  const getAnimals = async () => {
    try {
      const userRegisted = await AsyncStorage.getItem('@StriboApp_User');
      const Token = await AsyncStorage.getItem('@StriboApp_Token');
      if (userRegisted && Token) {
        api.defaults.headers.Authorization = `Bearer ${JSON.parse(Token)}`;
        const {data} = await api.get<AnimalProps[]>(
          `animal/${JSON.parse(userRegisted)}/owner`,
        );
        setAnimals(data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAnimals();
  }, [refresh]);

  const editAnimal = async () => {
    setAnimals(null);
  };
  const filterAnimal = async (form: AnimalFilter) => {
    console.log(form);

    try {
      const {data} = await api.post<AnimalProps[]>('animal/filter', form);
      console.log(data);
      if (!data) {
        return setAnimals(null);
      }
      setAnimals(data);
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Não foi possível buscar seus animais!',
        text2: 'Tente Novamente mais tarde!',
      });
    }
  };

  return (
    <AnimalsContext.Provider
      value={{
        animals,
        refresh,
        setAnimals,
        setRefresh,
        getAnimals,
        editAnimal,
        filterAnimal,
      }}>
      {children}
    </AnimalsContext.Provider>
  );
};
export default AnimalsProvider;
