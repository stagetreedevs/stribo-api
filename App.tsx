import {NavigationContainer} from '@react-navigation/native';
import {Text, NativeBaseProvider} from 'native-base';
import Toast from 'react-native-toast-message';
import Routes from './src/routes';

function App(): JSX.Element {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Routes />
        <Toast />
      </NavigationContainer>
    </NativeBaseProvider>
  );
}

export default App;
