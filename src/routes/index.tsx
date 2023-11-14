/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
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
import TabBar from '../components/TabBar';
import {SafeAreaView} from 'react-native-safe-area-context';
import {View} from 'react-native';
import Notifications from '../screens/Notifications';
import Profile from '../screens/Profile';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const SafeArea = ({Component, theme, ...props}: any) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#DCF7E3',
      }}>
      <View
        style={{
          height: 50,
          width: '100%',
          position: 'absolute',
          top: 0,
          backgroundColor: theme === 'light' ? '#DCF7E3' : '#0A2117',
        }}
      />
      <StatusBar
        backgroundColor={theme === 'light' ? '#DCF7E3' : '#0A2117'}
        barStyle={theme === 'light' ? 'dark-content' : 'light-content'}
      />
      <SafeAreaView style={{flex: 1}}>
        <Component {...props} />
      </SafeAreaView>
    </View>
  );
};
function TabRoutes() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={props => <TabBar {...props} />}>
      <Tab.Screen name="HomePage" component={Home} />
      <Tab.Screen name="Tab1" component={Home} />
      <Tab.Screen
        name="Tab2"
        component={Home}
        initialParams={{notification: true}}
      />
      <Tab.Screen name="Tab3" component={Home} />
      <Tab.Screen name="Tab4" component={Home} />
    </Tab.Navigator>
  );
}
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
    if (user.first_login) {
      return (
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="FirstLoginPage" component={FirstLogin} />
          <Stack.Screen name="OnBoarding" component={OnBoarding} />
        </Stack.Navigator>
      );
    }
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Tab">
          {props => <SafeArea Component={TabRoutes} theme="dark" {...props} />}
        </Stack.Screen>
        <Stack.Screen name="Animals">
          {props => <SafeArea Component={TabRoutes} theme="dark" {...props} />}
        </Stack.Screen>
        <Stack.Screen name="Notifications">
          {props => (
            <SafeArea Component={Notifications} theme="light" {...props} />
          )}
        </Stack.Screen>

        <Stack.Screen name="Profile">
          {props => <SafeArea Component={Profile} theme="light" {...props} />}
        </Stack.Screen>
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
