/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import {Text, VStack, Pressable, Icon, HStack} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useState} from 'react';
import Header from '../../components/Header';
import {ImageBackground} from 'react-native';
import HorsesBackGound from '../../../assets/horsesBackGround2.jpg';

type Props = {
  navigation: any;
};

function Home({navigation}: Props) {
  const [show, setShow] = useState(false);
  return (
    <VStack flex={1} backgroundColor="#0A2117" justifyContent={'flex-end'}>
      <Header username="Maria" />
      <VStack
        flex={1}
        backgroundColor="#DCF7E3"
        justifyContent={'flex-start'}
        borderTopRadius={25}
        p={4}
        space={2}>
        <VStack
          w={'100%'}
          h={100}
          borderRadius={20}
          bg="#0A211710"
          p={4}
          px={6}
          justifyContent="space-between">
          <HStack
            w={'100%'}
            justifyContent="space-between"
            alignItems={'flex-end'}>
            <Text
              fontSize={'17px'}
              fontWeight={'normal'}
              color={'#0A2117'}
              fontFamily="Roboto-Medium"
              mb={2}>
              Balanço Semanal (R$)
            </Text>
            <Pressable onPress={() => setShow(!show)}>
              <MaterialCommunityIcons
                name={!show ? 'eye-outline' : 'eye-off-outline'}
                color={'#0A2117'}
                size={26}
              />
            </Pressable>
          </HStack>
          <Text
            fontSize={show ? '25px' : '40px'}
            fontWeight={'normal'}
            color={'#0A2117'}
            fontFamily="IBMPlexSans-Regular">
            {show ? 'R$ 1900,75' : '*****'}
          </Text>
        </VStack>
        <HStack w={'100%'} h={150} justifyContent="space-between">
          <Pressable
            w={'77.5%'}
            h={150}
            borderRadius={25}
            onPress={() => navigation.navigate('Animals')}>
            <ImageBackground
              source={HorsesBackGound}
              resizeMode="cover"
              style={{
                width: '100%',
                height: '100%',
              }}
              imageStyle={{
                borderRadius: 16,
              }}>
              <VStack
                backgroundColor="#0A211765"
                flex={1}
                borderRadius={16}
                p={4}>
                <Text
                  fontSize={'14px'}
                  fontWeight={'normal'}
                  color={'#DCF7E3'}
                  fontFamily="Roboto-Regular">
                  Animais
                </Text>
                <Text
                  fontSize={'46px'}
                  lineHeight={60}
                  fontWeight={'medium'}
                  color={'#DCF7E3'}
                  fontFamily="IBMPlexSans-Regular">
                  21
                </Text>
              </VStack>
            </ImageBackground>
          </Pressable>
          <VStack justifyContent={'space-between'}>
            <Pressable
              onPress={() => navigation.navigate('Notifications')}
              backgroundColor="#FFD78A"
              borderRadius={16}
              alignItems={'center'}
              justifyContent={'center'}
              w="70px"
              h="70px">
              <MaterialCommunityIcons
                name={'checkbox-blank-circle'}
                size={6}
                color={'red'}
                style={{
                  position: 'absolute',
                  right: '32.5%',
                  top: '30%',
                }}
              />
              <MaterialCommunityIcons
                name={'bell-outline'}
                color={'#0A2117'}
                size={26}
              />
            </Pressable>
            <Pressable
              backgroundColor="#0C3121"
              borderRadius={16}
              alignItems={'center'}
              justifyContent={'center'}
              w="70px"
              h="70px">
              <MaterialCommunityIcons
                name={'gender-male-female'}
                color={'#DCF7E3'}
                size={26}
              />
            </Pressable>
          </VStack>
        </HStack>
        <HStack
          w={'100%'}
          justifyContent="space-between"
          bg="#A9E8BA"
          borderRadius={16}
          p={4}>
          <VStack>
            <Text
              fontSize={'17px'}
              fontWeight={'medium'}
              color={'#0A2117'}
              fontFamily="Roboto-Medium">
              Relatórios
            </Text>
            <Text
              fontSize={'14px'}
              fontWeight={'normal'}
              color={'#0A2117'}
              fontFamily="Roboto-Regular">
              Lorem Ipsum, Dolor Sit, Consectetur, etc
            </Text>
          </VStack>
          <MaterialCommunityIcons
            name={'chart-line'}
            color={'#0A2117'}
            size={24}
          />
        </HStack>
        <HStack
          w={'100%'}
          justifyContent="space-between"
          bg="#BAEDC880"
          borderRadius={16}
          p={4}>
          <VStack>
            <Text
              fontSize={'17px'}
              fontWeight={'medium'}
              color={'#0A2117'}
              fontFamily="Roboto-Medium">
              Cadastrar
            </Text>
            <Text
              fontSize={'14px'}
              fontWeight={'normal'}
              color={'#0A2117'}
              fontFamily="Roboto-Regular">
              Animais, Parceiros, Despesas, etc
            </Text>
          </VStack>
          <MaterialCommunityIcons name={'plus'} color={'#0A2117'} size={24} />
        </HStack>
      </VStack>
    </VStack>
  );
}

export default Home;
