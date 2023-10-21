import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignIn from '../../screens/SignIn';
import Signup from '../../screens/Signup';
import Home from '../../screens/Home';
import { AuthContext } from '../../context/auth';
import HeaderTabs from './HeaderTabs';
import Profile from '../../screens/Profile';
import List from '../../screens/List';
import Notification from '../../screens/Notification';
import ForgotPassword from '../../screens/ForgotPassword';
import EnableLocation from '../../screens/EnableLocation';
import Splash from '../../screens/Splash';

const Stack = createNativeStackNavigator();

export default function ScreensNav() {
  const [state, setState] = useContext(AuthContext);

  const authenticated = state && state.token !== '' && state.user !== null;
  console.log('AUTHENTICATED =>', authenticated);

  return (
    <Stack.Navigator
      initialRouteName="Splash"
      //   screenOptions={{ headerShown: false }}
    >
      {authenticated ? (
        <>
          {/* <Stack.Screen name="Splash" component={Splash} /> */}
          <Stack.Screen
            name="EnableLocation"
            component={EnableLocation}
            options={{
              headerBackTitle: 'Back',
              title: 'Enable Location',
            }}
          />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{
              headerBackTitle: 'Enable',
              title: 'Walmart Shuttle',
              headerRight: () => <HeaderTabs />,
            }}
          />
          <Stack.Screen
            name="Profile"
            component={Profile}
            options={{
              headerBackTitle: 'Back',
            }}
          />
          <Stack.Screen
            name="Notification"
            component={Notification}
            options={{
              headerBackTitle: 'Back',
            }}
          />
          <Stack.Screen
            name="List"
            component={List}
            options={{
              headerBackTitle: 'Back',
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Splash"
            component={Splash}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignIn"
            component={SignIn}
            options={{ headerShown: false }}
          />
          {/* <Stack.Screen
            name="Signup"
            component={Signup}
            options={{ headerShown: false }}
          /> */}
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPassword}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
