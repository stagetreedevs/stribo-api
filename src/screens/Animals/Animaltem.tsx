import {Checkbox, HStack, Image, Pressable, VStack} from 'native-base';
import {useEffect, useRef, useState} from 'react';
import {Swipeable, GestureHandlerRootView} from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BasicText from '../../components/BasicText';

/* eslint-disable react/react-in-jsx-scope */
const AnimalItem = ({item, showSheet, setSelected, navigation}: any) => {
  const ref = useRef() as React.MutableRefObject<Swipeable>;
  const [isSelected, setIsSelected] = useState<boolean>(false);

  useEffect(() => {
    if (!showSheet) {
      ref.current.close();
    }
  }, [showSheet]);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Swipeable
        ref={ref}
        renderLeftActions={() => (
          <VStack w={'50px'} justifyContent="center" alignItems="center">
            <Checkbox
              aria-label="label"
              value="true"
              mr={'15px'}
              colorScheme="green"
              defaultIsChecked
            />
          </VStack>
        )}
        onSwipeableOpenStartDrag={() => {
          setIsSelected(true);
          setSelected(item.id, item, false);
        }}
        onSwipeableWillClose={() => {
          setIsSelected(false);
          setSelected(item.id, item, true);
        }}>
        <Pressable
          aria-label="arial"
          onPress={() => navigation.navigate('EditAnimal', {item})}
          onLongPress={() => console.log(item)}>
          <HStack
            justifyContent="space-between"
            marginY={1}
            py={2}
            borderLeftRadius={8}
            bgColor={isSelected ? '#BAEDC880' : 'transparent'}>
            <HStack space={2}>
              {item.photo ? (
                <Image
                  ml={2}
                  source={{uri: item.photo}}
                  alt="userImage"
                  h="50px"
                  w="50px"
                  borderRadius={25}
                  borderColor="#0A2117"
                />
              ) : (
                <VStack
                  borderRadius={25}
                  borderWidth={0.5}
                  h="50px"
                  w="50px"
                  justifyContent="center"
                  alignItems="center">
                  <MaterialCommunityIcons
                    name={'horse-variant'}
                    size={35}
                    // eslint-disable-next-line react-native/no-inline-styles
                    style={{
                      marginTop: 2,
                    }}
                    color={'#0A2117'}
                  />
                </VStack>
              )}
              <VStack>
                <BasicText theme={'dark'}>{item.name}</BasicText>
                <BasicText theme={'dark'} size={14} opacity={0.5}>
                  {item.registerNumber ? item.registerNumber : 'Sem registro'}
                </BasicText>
              </VStack>
            </HStack>
          </HStack>
        </Pressable>
      </Swipeable>
    </GestureHandlerRootView>
  );
};
export default AnimalItem;
