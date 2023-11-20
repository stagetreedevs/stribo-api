/* eslint-disable react/react-in-jsx-scope */
import {ScrollView, VStack} from 'native-base';
import BasicHeader from '../../components/BasicHeader';
import BasicText from '../../components/BasicText';

function Policy({navigation}: any) {
  return (
    <VStack flex={1} bg="#DCF7E3" justifyContent={'flex-start'} paddingX={6}>
      <BasicHeader navigation={navigation} name="Política de Privacidade" />
      <ScrollView flex={1} w="100%" showsVerticalScrollIndicator={false}>
        <BasicText theme="dark">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis et
          esse vel reiciendis, a eligendi ducimus, placeat aut sapiente ad sunt
          omnis amet tempora pariatur accusantium blanditiis sint delectus
          dolorem. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          Facilis et esse vel reiciendis, a eligendi ducimus, placeat aut
          sapiente ad sunt omnis amet tempora pariatur accusantium blanditiis
          sint delectus dolorem. Lorem ipsum dolor sit amet, consectetur
          adipisicing elit. Facilis et esse vel reiciendis, a eligendi ducimus,
          placeat aut sapiente ad sunt omnis amet tempora pariatur accusantium
          blanditiis sint delectus dolorem.
        </BasicText>
      </ScrollView>
    </VStack>
  );
}

export default Policy;
