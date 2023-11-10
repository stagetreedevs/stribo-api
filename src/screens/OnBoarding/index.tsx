/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import {VStack, StatusBar, HStack, Text} from 'native-base';
import {SafeAreaView} from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import {Polyline, Svg} from 'react-native-svg';
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
        <Text
          fontSize={'18px'}
          color={'#0A2117'}
          fontFamily={'Roboto-Regular'}
          fontWeight={'light'}>
          Clique no botão abaixo para adicionar uma propriedade
        </Text>
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
function OnBoarding() {
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
        <VStack alignItems={'flex-end'} w={'100%'}>
          <Tooltip />
          <VStack
            justifyContent="center"
            alignItems={'center'}
            backgroundColor={'#6AF3B4'}
            w={20}
            h={20}
            borderRadius={20}>
            <Feather name={'plus'} color={'#0A2117'} size={25} />
          </VStack>
        </VStack>
      </SafeAreaView>
    </VStack>
  );
}

export default OnBoarding;
