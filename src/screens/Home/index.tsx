/* eslint-disable react/react-in-jsx-scope */
import {FlatList, Button, StatusBar, Text, VStack} from 'native-base';

type Props = {
  navigation: any;
};

type arrayProps = {
  username: string;
  callId: string;
};

function Home({navigation}: Props) {
  const array: arrayProps[] = [
    {
      username: 'luis',
      callId: '1',
    },
    {
      username: 'alex',
      callId: '1',
    },
  ];
  return (
    <VStack flex={1} bg="#0A2117" justifyContent={'flex-end'}>
      <StatusBar backgroundColor={'#0A2117'} barStyle="light-content" />
      <VStack
        bg={'white'}
        h="95%"
        w="100%"
        borderTopRadius={25}
        paddingX={6}
        paddingY={8}>
        <FlatList
          data={array}
          renderItem={({item}) => (
            <Button
              my={2}
              onPress={() =>
                navigation.navigate('VideoCallPage', {
                  username: item.username,
                  callId: item.callId,
                })
              }>
              <Text>Entrar como {item.username}</Text>
            </Button>
          )}
        />
      </VStack>
    </VStack>
  );
}

export default Home;
