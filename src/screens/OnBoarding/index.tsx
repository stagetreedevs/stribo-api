/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import {VStack, StatusBar, HStack, Text, Pressable} from 'native-base';
import {SafeAreaView} from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import {Polyline, Svg} from 'react-native-svg';
import {useContext} from 'react';
import {AuthContext} from '../../contexts/AuthContext';
import BasicText from '../../components/BasicText';

type Props = {
  route: any;
};

const Tooltip = () => {
  return (
    <>
      <VStack
        bg={'#6AF3B4'}
        paddingY={3}
        paddingX={6}
        borderRadius={20}
        mb={-5}
        w="100%">
        <BasicText theme="dark" size={18} fontWeight={'light'}>
          Clique no botão abaixo para adicionar uma propriedade
        </BasicText>
      </VStack>
      <Svg width={50} height={50} viewBox="0 0 100 100">
        <Polyline
          points="10 30 65 20 35 70"
          fill="#6AF3B4"
          stroke="#6AF3B4"
          strokeWidth="1"
        />
      </Svg>
    </>
  );
};
function OnBoarding({route}: Props) {
  const {params} = route;
  const {register} = useContext(AuthContext);

  return (
    <VStack backgroundColor={'#0A2117'} flex={1}>
      <StatusBar backgroundColor={'#0A2117'} barStyle="light-content" />
      <SafeAreaView
        style={{
          flex: 1,
          padding: 8,
          paddingHorizontal: 18,
          alignItems: 'flex-end',
          justifyContent: 'space-between',
        }}>
        <VStack flex={1}>
          <HStack w={'100%'} justifyContent="flex-end" paddingRight={2}>
            <Feather name={'user'} color={'#DCF7E3'} size={25} />
          </HStack>
          <Text
            marginY={8}
            fontSize={'40px'}
            color={'#DCF7E3'}
            fontFamily={'IBMPlexSans-Regular'}
            fontWeight={'normal'}>
            Quase lá...
          </Text>
          <Text
            fontSize={'23px'}
            color={'#DCF7E3'}
            fontFamily={'IBMPlexSans-Regular'}
            fontWeight={'normal'}>
            Só falta cadastrar sua propriedade. Você poderá adicionar quantas
            desejar.
          </Text>
        </VStack>
        <Pressable
          onPress={() => register(params?.name)}
          alignItems={'flex-end'}
          w={'100%'}>
          <Tooltip />
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
      </SafeAreaView>
    </VStack>
  );
}

export default OnBoarding;
