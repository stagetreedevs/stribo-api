import {NavigationContainer} from '@react-navigation/native';
import {Text, NativeBaseProvider} from 'native-base';
import Toast from 'react-native-toast-message';
import AuthProvider from './src/contexts/AuthContext';
import Routes from './src/routes';

function App(): JSX.Element {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <AuthProvider>
          <Routes />
          <Toast />
        </AuthProvider>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}

export default App;
