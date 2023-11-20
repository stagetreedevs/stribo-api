/* eslint-disable react/react-in-jsx-scope */
import {
  CheckIcon,
  Divider,
  HStack,
  Input,
  Pressable,
  Select,
  VStack,
} from 'native-base';
import {useState} from 'react';
import DatePicker from 'react-native-date-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BasicHeader from '../BasicHeader';
import BasicText from '../BasicText';

function FilterNotification({navigation}: any) {
  const [date, setDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState('');
  const [selectDate, setSelectDate] = useState(false);
  return (
    <VStack flex={1} bg="#DCF7E3" justifyContent={'flex-start'} paddingX={6}>
      <BasicHeader navigation={navigation} name="Filtro" />
      <VStack flex={1} w="100%">
        <VStack flex={1} space={6}>
          <HStack w={'100%'} justifyContent="space-between">
            <VStack w={'48%'}>
              <BasicText size={14} theme="dark" opacity={0.5}>
                Entre a data...
              </BasicText>
              <Input
                size={'lg'}
                height={'48px'}
                variant={'underlined'}
                placeholderTextColor={'#0A2117'}
                borderColor={'#0A2117'}
                type={'text'}
                value={date.toLocaleDateString()}
                InputRightElement={
                  <Pressable
                    marginX={4}
                    marginY={0}
                    onPress={() => {
                      setSelectDate(true);
                      setOpen(!open);
                    }}>
                    <MaterialCommunityIcons
                      name={'calendar-blank-outline'}
                      color={'#0A2117'}
                      size={24}
                    />
                  </Pressable>
                }
                _focus={{
                  borderColor: '#0A2117',
                }}
              />
            </VStack>
            <VStack w={'48%'}>
              <BasicText size={14} theme="dark" opacity={0.5}>
                ... e a data
              </BasicText>
              <Input
                size={'lg'}
                height={'48px'}
                variant={'underlined'}
                placeholderTextColor={'#0A2117'}
                borderColor={'#0A2117'}
                type={'text'}
                value={toDate.toLocaleDateString()}
                InputRightElement={
                  <Pressable
                    marginX={4}
                    marginY={0}
                    onPress={() => {
                      setSelectDate(false);
                      setOpen(!open);
                    }}>
                    <MaterialCommunityIcons
                      name={'calendar-blank-outline'}
                      color={'#0A2117'}
                      size={24}
                    />
                  </Pressable>
                }
                _focus={{
                  borderColor: '#0A2117',
                }}
              />
            </VStack>
          </HStack>
          <Input
            size={'lg'}
            height={'48px'}
            variant={'underlined'}
            placeholderTextColor={'#0A211799'}
            borderColor={'#0A211799'}
            type={'text'}
            placeholder={'Operador'}
            InputRightElement={
              <Pressable
                onPress={() => {
                  setSelectDate(false);
                  setOpen(!open);
                }}>
                <MaterialCommunityIcons
                  color="#0A2117"
                  name={'magnify'}
                  size={24}
                />
              </Pressable>
            }
            _focus={{
              borderColor: '#0A2117',
            }}
          />
          <Input
            size={'lg'}
            height={'48px'}
            variant={'underlined'}
            placeholderTextColor={'#0A211799'}
            borderColor={'#0A211799'}
            type={'text'}
            placeholder={'Animal'}
            InputRightElement={
              <Pressable
                onPress={() => {
                  setSelectDate(false);
                  setOpen(!open);
                }}>
                <MaterialCommunityIcons
                  color="#0A2117"
                  name={'magnify'}
                  size={24}
                />
              </Pressable>
            }
            _focus={{
              borderColor: '#0A2117',
            }}
          />
          <Select
            selectedValue={language}
            accessibilityLabel="Categoria"
            borderColor="#0A211799"
            dropdownIcon={
              <MaterialCommunityIcons
                name={'chevron-down'}
                color={'#0A2117'}
                size={24}
              />
            }
            variant="underlined"
            placeholder="Categoria"
            placeholderTextColor={'#0A211799'}
            h={12}
            fontSize={17}
            onValueChange={itemValue => setLanguage(itemValue)}
            _selectedItem={{
              endIcon: <CheckIcon size={4} />,
            }}>
            <Select.Item label="JavaScript" value="js" />
          </Select>
          <Select
            selectedValue={language}
            accessibilityLabel="Subcategoria"
            placeholder="Subcategoria"
            borderColor="#0A211799"
            dropdownIcon={
              <MaterialCommunityIcons
                name={'chevron-down'}
                color={'#0A2117'}
                size={24}
              />
            }
            variant="underlined"
            placeholderTextColor={'#0A211799'}
            h={12}
            fontSize={17}
            onValueChange={itemValue => setLanguage(itemValue)}
            _selectedItem={{
              endIcon: <CheckIcon size={4} />,
            }}>
            <Select.Item label="JavaScript" value="js" />
          </Select>

          <Select
            selectedValue={language}
            accessibilityLabel="Ordenar por"
            placeholder="Ordenar por"
            borderColor="#0A211799"
            dropdownIcon={
              <MaterialCommunityIcons
                name={'chevron-down'}
                color={'#0A2117'}
                size={24}
              />
            }
            variant="underlined"
            placeholderTextColor={'#0A211799'}
            h={12}
            fontSize={17}
            onValueChange={itemValue => setLanguage(itemValue)}
            _selectedItem={{
              endIcon: <CheckIcon size={4} />,
            }}>
            <Select.Item label="JavaScript" value="js" />
          </Select>
        </VStack>
      </VStack>
      <Divider borderColor="#0A2117" borderWidth={0.5} w={1000} marginX={-10} />
      <HStack
        h={75}
        w="100%"
        alignItems={'center'}
        justifyContent="space-around">
        <Pressable
          px={6}
          width="45%"
          h={'50px'}
          alignItems="center"
          justifyContent="center"
          bg={'transparent'}
          onPress={() => navigation.goBack()}>
          <HStack space={2}>
            <MaterialCommunityIcons
              name={'eraser'}
              color={'#0A2117'}
              size={24}
            />
            <BasicText theme="dark" fontWeight="medium">
              Limpar
            </BasicText>
          </HStack>
        </Pressable>
        <Pressable
          borderWidth={1}
          borderColor="#0A211799"
          borderRadius={50}
          px={6}
          width="45%"
          h={'50px'}
          alignItems="center"
          justifyContent="center"
          bg={'#0A2117'}
          onPress={() => navigation.goBack()}>
          <HStack space={2}>
            <MaterialCommunityIcons
              name={'check'}
              color={'#DCF7E3'}
              size={24}
            />
            <BasicText theme="light" fontWeight="medium">
              Filtrar
            </BasicText>
          </HStack>
        </Pressable>
      </HStack>

      <DatePicker
        modal
        mode="date"
        open={open}
        date={selectDate ? date : toDate}
        onConfirm={date => {
          setOpen(false);
          console.log(date);

          if (selectDate) {
            setDate(date);
          } else {
            setToDate(date);
          }
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </VStack>
  );
}

export default FilterNotification;
