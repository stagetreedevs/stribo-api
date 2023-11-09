/* eslint-disable react/react-in-jsx-scope */
import {createStackNavigator} from '@react-navigation/stack';
import Home from '../screens/Home';
import Login from '../screens/Login';
import FirstLogin from '../screens/FirstLogin';
import Register from '../screens/Register';
import ForgotPassword from '../screens/ForgotPassword';
import {useContext} from 'react';
import {AuthContext} from '../contexts/AuthContext';
import {StatusBar, VStack} from 'native-base';
import Logo from '../../assets/striboLogo.svg';
import OnBoarding from '../screens/OnBoarding';

const Stack = createStackNavigator();
function Routes() {
  const {user, loading} = useContext(AuthContext);

  if (loading) {
    return (
      <VStack
        backgroundColor={'#0A2117'}
        flex={1}
        justifyContent="center"
        alignItems="center">
        <StatusBar backgroundColor={'#0A2117'} barStyle="light-content" />
        <Logo width={300} height={200} />
      </VStack>
    );
  }
  if (user) {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="FirstLoginPage" component={FirstLogin} />
        <Stack.Screen name="OnBoarding" component={OnBoarding} />
        <Stack.Screen name="HomePage" component={Home} />
      </Stack.Navigator>
    );
  }
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="LoginPage" component={Login} />
      <Stack.Screen name="RegisterPage" component={Register} />
      <Stack.Screen name="ForgotPasswordPage" component={ForgotPassword} />
    </Stack.Navigator>
  );
}

export default Routes;
