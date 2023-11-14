import {NavigationContainer} from '@react-navigation/native';
import {Text, NativeBaseProvider} from 'native-base';
import {MenuProvider} from 'react-native-popup-menu';
import Toast from 'react-native-toast-message';
import AuthProvider from './src/contexts/AuthContext';
import Routes from './src/routes';

function App(): JSX.Element {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <AuthProvider>
          <MenuProvider>
            <Routes />
            <Toast />
          </MenuProvider>
        </AuthProvider>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}

export default App;
