/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import {Text, VStack, Pressable, HStack} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useContext, useState, useCallback, useMemo, useRef} from 'react';
import Header from '../../components/Header';
import {ImageBackground} from 'react-native';
import HorsesBackGound from '../../../assets/horsesBackGround2.jpg';
import {AuthContext} from '../../contexts/AuthContext';
import BottomSheet from '@gorhom/bottom-sheet';
import BasicText from '../../components/BasicText';
import {AnimalsContext} from '../../contexts/AnimalsContext';

type Props = {
  navigation: any;
};

function Home({navigation}: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [showSheet, setShowSheet] = useState(false);
  const {user, signOut} = useContext(AuthContext);
  const {animals} = useContext(AnimalsContext);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['1%', '40%', '20%', '75%'], []);
  const handleSheetChanges = useCallback((index: number) => {
    if (index === 0) {
      setShowSheet(false);
    }
  }, []);

  return (
    <VStack flex={1} backgroundColor="#0A2117" justifyContent={'flex-end'}>
      <Header navigation={navigation} home username={user?.name as string} />
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
            <BasicText theme="dark" mb={2}>
              Balanço Semanal (R$)
            </BasicText>
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              <MaterialCommunityIcons
                name={!showPassword ? 'eye-outline' : 'eye-off-outline'}
                color={'#0A2117'}
                size={26}
              />
            </Pressable>
          </HStack>
          <Text
            fontSize={showPassword ? '25px' : '40px'}
            fontWeight={'normal'}
            color={'#0A2117'}
            fontFamily="IBMPlexSans-Regular">
            {showPassword ? 'R$ 1900,75' : '*****'}
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
                <BasicText theme="light" size={14} fontWeight={'normal'}>
                  Animais
                </BasicText>
                <Text
                  fontSize={'46px'}
                  lineHeight={60}
                  fontWeight={'medium'}
                  color={'#DCF7E3'}
                  fontFamily="IBMPlexSans-Regular">
                  {animals ? animals.length : ''}
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
            <BasicText theme="dark" fontWeight="medium">
              Relatórios
            </BasicText>
            <BasicText theme="dark" fontWeight="normal" size={14}>
              Lorem Ipsum, Dolor Sit, Consectetur, etc
            </BasicText>
          </VStack>
          <MaterialCommunityIcons
            name={'chart-line'}
            color={'#0A2117'}
            size={24}
          />
        </HStack>
        <Pressable onPress={() => setShowSheet(!showSheet)}>
          <HStack
            w={'100%'}
            justifyContent="space-between"
            bg="#BAEDC880"
            borderRadius={16}
            p={4}>
            <VStack>
              <BasicText theme="dark" fontWeight="medium">
                Cadastrar
              </BasicText>
              <BasicText theme="dark" fontWeight="normal" size={14}>
                Animais, Parceiros, Despesas, etc
              </BasicText>
            </VStack>
            <MaterialCommunityIcons name={'plus'} color={'#0A2117'} size={24} />
          </HStack>
        </Pressable>
      </VStack>

      {showSheet && (
        <BottomSheet
          ref={bottomSheetRef}
          index={1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          backgroundStyle={{
            backgroundColor: '#DCF7E3',
            borderWidth: 1,
            borderColor: '#00000030',
            borderRadius: 25,
          }}>
          <VStack flex={1} p={4}>
            <Text
              fontFamily={'IBMPlexSans-Regular'}
              fontSize={23}
              color={'#0A2117'}>
              Cadastrar
            </Text>
            <VStack py={8} space={8}>
              <Pressable onPress={() => navigation.navigate('NewAnimal')}>
                <HStack alignItems={'center'} space={4}>
                  <MaterialCommunityIcons
                    name="horse-variant"
                    color={'#0A2117'}
                    size={24}
                  />
                  <BasicText theme="dark">Animal</BasicText>
                </HStack>
              </Pressable>

              <Pressable>
                <HStack alignItems={'center'} space={4}>
                  <MaterialCommunityIcons
                    name="needle"
                    color={'#0A2117'}
                    size={24}
                  />
                  <BasicText theme="dark">
                    Procedimento Clínico/Sanitário
                  </BasicText>
                </HStack>
              </Pressable>

              <Pressable onPress={signOut}>
                <HStack alignItems={'center'} space={4}>
                  <MaterialCommunityIcons
                    name="gender-male-female"
                    color={'#0A2117'}
                    size={24}
                  />
                  <BasicText theme="dark">Procedimento Reprodutivo</BasicText>
                </HStack>
              </Pressable>

              <Pressable>
                <HStack alignItems={'center'} space={4}>
                  <MaterialCommunityIcons
                    name="package-variant-closed"
                    color={'#0A2117'}
                    size={24}
                  />
                  <BasicText theme="dark">Movimento de Estoque</BasicText>
                </HStack>
              </Pressable>

              <Pressable>
                <HStack alignItems={'center'} space={4}>
                  <MaterialCommunityIcons
                    name="account-multiple-outline"
                    color={'#0A2117'}
                    size={24}
                  />
                  <BasicText theme="dark">Cliente</BasicText>
                </HStack>
              </Pressable>

              <Pressable>
                <HStack alignItems={'center'} space={4}>
                  <MaterialCommunityIcons
                    name="account-multiple-outline"
                    color={'#0A2117'}
                    size={24}
                  />
                  <BasicText theme="dark">Fornecedor</BasicText>
                </HStack>
              </Pressable>

              <Pressable>
                <HStack alignItems={'center'} space={4}>
                  <MaterialCommunityIcons
                    name="chart-line"
                    color={'#0A2117'}
                    size={24}
                  />
                  <BasicText theme="dark">Despesa ou Receita</BasicText>
                </HStack>
              </Pressable>
            </VStack>
          </VStack>
        </BottomSheet>
      )}
    </VStack>
  );
}

export default Home;
