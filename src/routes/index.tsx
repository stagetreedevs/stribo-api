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
import {KeyboardAvoidingView, StatusBar, VStack} from 'native-base';
import Logo from '../../assets/striboLogo.svg';
import OnBoarding from '../screens/OnBoarding';
import TabBar from '../components/TabBar';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Platform, View} from 'react-native';
import Notifications from '../screens/Notifications';
import Profile from '../screens/Profile';
import FilterNotifications from '../components/FilterNotifications';
import Policy from '../screens/Policy';
import TermsOfUse from '../screens/TermsOfUse';
import Properts from '../screens/Properts';
import EditProfile from '../screens/Profile/editProfile';
import EditPassword from '../screens/Profile/editPassword';
import NewAdmin from '../screens/Properts/NewAdmin';
import EditAdmin from '../screens/Properts/EditAdmin';
import Animals from '../screens/Animals';
import FilterAnimals from '../components/FilterAnimals';
import NewAnimal from '../screens/Animals/newAnimal';
import AddProperty from '../screens/AddProperty';
import EditAnimal from '../screens/Animals/editAnimal';

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
      <Tab.Screen name="PropertsPage" component={Properts} />
      <Tab.Screen
        name="Animals"
        component={Animals}
        initialParams={{notification: true}}
      />
      <Tab.Screen name="Tab3" component={Home} />
      <Tab.Screen name="Tab4" component={Home} />
    </Tab.Navigator>
  );
}
function Routes() {
  const {user, loading, property} = useContext(AuthContext);

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
        </Stack.Navigator>
      );
    }

    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {!property && (
          <>
            <Stack.Screen name="OnBoarding" component={OnBoarding} />
            <Stack.Screen name="AddProperty">
              {props => (
                <SafeArea Component={AddProperty} theme="dark" {...props} />
              )}
            </Stack.Screen>
          </>
        )}
        <Stack.Screen name="Tab">
          {props => <SafeArea Component={TabRoutes} theme="dark" {...props} />}
        </Stack.Screen>
        <Stack.Screen name="NewAdmin">
          {props => <SafeArea Component={NewAdmin} theme="light" {...props} />}
        </Stack.Screen>
        <Stack.Screen name="EditAdmin">
          {props => <SafeArea Component={EditAdmin} theme="light" {...props} />}
        </Stack.Screen>
        <Stack.Screen name="Notifications">
          {props => (
            <SafeArea Component={Notifications} theme="light" {...props} />
          )}
        </Stack.Screen>
        <Stack.Screen name="FilterNotifications">
          {props => (
            <SafeArea
              Component={FilterNotifications}
              theme="light"
              {...props}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="FilterAnimals">
          {props => (
            <KeyboardAvoidingView
              flex={1}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
              <SafeArea Component={FilterAnimals} theme="light" {...props} />
            </KeyboardAvoidingView>
          )}
        </Stack.Screen>
        <Stack.Screen name="NewAnimal">
          {props => (
            <KeyboardAvoidingView
              flex={1}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
              <SafeArea Component={NewAnimal} theme="light" {...props} />
            </KeyboardAvoidingView>
          )}
        </Stack.Screen>
        <Stack.Screen name="EditAnimal">
          {props => (
            <KeyboardAvoidingView
              flex={1}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
              <SafeArea Component={EditAnimal} theme="light" {...props} />
            </KeyboardAvoidingView>
          )}
        </Stack.Screen>
        <Stack.Screen name="Profile">
          {props => <SafeArea Component={Profile} theme="light" {...props} />}
        </Stack.Screen>
        <Stack.Screen name="EditProfile">
          {props => (
            <KeyboardAvoidingView
              flex={1}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
              <SafeArea Component={EditProfile} theme="light" {...props} />
            </KeyboardAvoidingView>
          )}
        </Stack.Screen>
        <Stack.Screen name="EditPassword">
          {props => (
            <SafeArea Component={EditPassword} theme="light" {...props} />
          )}
        </Stack.Screen>
        <Stack.Screen name="Policy">
          {props => <SafeArea Component={Policy} theme="light" {...props} />}
        </Stack.Screen>
        <Stack.Screen name="TermsOfUse">
          {props => (
            <SafeArea Component={TermsOfUse} theme="light" {...props} />
          )}
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
