/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import {
  Divider,
  HStack,
  Input,
  Pressable,
  ScrollView,
  VStack,
} from 'native-base';
import {useContext, useState} from 'react';
import DatePicker from 'react-native-date-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BasicHeader from '../BasicHeader';
import BasicText from '../BasicText';
import RadioForm from 'react-native-simple-radio-button';
import BasicSelect from '../BasicSelect';
import BasicInput from '../BasicInput';
import {AnimalsContext} from '../../contexts/AnimalsContext';

function FilterAnimals({navigation}: any) {
  const {filterAnimal, refresh, setRefresh} = useContext(AnimalsContext);
  const [date, setDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({
    order: '',
    live: '',
    manage: '',
    status: '',
    function: '',
    sex: '',
    coat: '',
    race: '',
    animal: '',
  });
  const [selectDate, setSelectDate] = useState(false);
  var radio_props = [
    {label: 'Em Vida', value: 'alive'},
    {label: 'Óbito', value: 'dead'},
  ];

  return (
    <VStack flex={1} bg="#DCF7E3" justifyContent={'flex-start'} paddingX={6}>
      <BasicHeader navigation={navigation} name="Filtro" />
      <VStack flex={1} w="100%">
        <ScrollView
          flex={1}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled>
          <VStack flex={1} mb={16} space={4}>
            <HStack w={'100%'} justifyContent="space-between">
              <VStack w={'48%'}>
                <BasicText size={14} theme="dark" opacity={0.5}>
                  Nasc. entre...
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
                  e...
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
            <BasicSelect
              itens={radio_props}
              itemSelected={filters.animal}
              label="Animal"
              onChange={itemValue =>
                setFilters({...filters, animal: itemValue})
              }
            />
            <BasicSelect
              itens={radio_props}
              itemSelected={filters.race}
              label="Raça"
              onChange={itemValue => setFilters({...filters, race: itemValue})}
            />
            <BasicSelect
              itens={radio_props}
              itemSelected={filters.coat}
              label="Pelagem"
              onChange={itemValue => setFilters({...filters, coat: itemValue})}
            />
            <BasicSelect
              itens={radio_props}
              itemSelected={filters.sex}
              label="Sexo"
              onChange={itemValue => setFilters({...filters, sex: itemValue})}
            />
            <BasicSelect
              itens={radio_props}
              itemSelected={filters.function}
              label="Função"
              onChange={itemValue =>
                setFilters({...filters, function: itemValue})
              }
            />
            <BasicSelect
              itens={radio_props}
              itemSelected={filters.status}
              label="Status Reprodutivo"
              onChange={itemValue =>
                setFilters({...filters, status: itemValue})
              }
            />
            <VStack mb={6}>
              <BasicInput
                text={filters.manage}
                label="Manejo Nutricional"
                search
                onChangeText={v => {
                  setFilters({...filters, manage: v});
                }}
              />
            </VStack>
            <RadioForm
              radio_props={radio_props}
              initial={0}
              formHorizontal={true}
              animation={false}
              buttonColor={'#0A2117'}
              selectedButtonColor={'#0A2117'}
              buttonSize={14}
              labelStyle={{marginRight: 24, marginLeft: 8}}
              onPress={(value: string) => {
                console.log(value);
              }}
            />
            <BasicSelect
              itens={radio_props}
              itemSelected={filters.order}
              label="Ordenar por"
              onChange={itemValue => setFilters({...filters, order: itemValue})}
            />
          </VStack>
        </ScrollView>
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
          onPress={() => {
            setFilters({
              order: '',
              live: '',
              manage: '',
              status: '',
              function: '',
              sex: '',
              coat: '',
              race: '',
              animal: '',
            });
            setRefresh(!refresh);
            navigation.goBack();
          }}>
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
          onPress={() => {
            filterAnimal({
              order: filters.order,
              initialDate: date,
              lastDate: toDate,
              race: filters.race,
              coat: filters.coat,
              sex: filters.sex,
              live: filters.live === 'alive' ? true : false,
              nutritional: '',
            });
            navigation.goBack();
          }}>
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
        onConfirm={dateValue => {
          setOpen(false);
          console.log('date => ', dateValue);

          if (selectDate) {
            setDate(dateValue);
          } else {
            setToDate(dateValue);
          }
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </VStack>
  );
}

export default FilterAnimals;
