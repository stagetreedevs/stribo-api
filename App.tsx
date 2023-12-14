/* eslint-disable react/react-in-jsx-scope */
import {NavigationContainer} from '@react-navigation/native';
import {NativeBaseProvider, extendTheme} from 'native-base';
import {MenuProvider} from 'react-native-popup-menu';
import Toast from 'react-native-toast-message';
import AnimalsProvider from './src/contexts/AnimalsContext';
import AuthProvider from './src/contexts/AuthContext';
import NotificationProvider from './src/contexts/NotificationContext';
import Routes from './src/routes';

function App(): JSX.Element {
  const newColorTheme = {
    baseGreen: {
      900: '#0A2117',
      100: '#DCF7E3',
    },
  };
  const theme = extendTheme({colors: newColorTheme});
  return (
    <NativeBaseProvider theme={theme}>
      <NavigationContainer>
        <AuthProvider>
          <MenuProvider>
            <NotificationProvider>
              <AnimalsProvider>
                <Routes />
                <Toast />
              </AnimalsProvider>
            </NotificationProvider>
          </MenuProvider>
        </AuthProvider>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}

export default App;
