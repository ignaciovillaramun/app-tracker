// import CustomAlert from '../components/Alert';
import tw from 'twrnc';
import React, { useState, useContext, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import UserInput from '../components/auth/UserInput';
import SubmitButton from '../components/auth/SubmitButton';
import Logo from '../components/auth/Logo';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/auth';
import { db } from '../../firebaseCongif';
import { ref, set, update, get, child } from 'firebase/database';

const SignIn = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [state, setState] = useContext(AuthContext);
  const [authenticated, setAuthenticated] = useState();

  useEffect(() => {
    userLogged();
  }, []);

  const userLogged = async () => {
    const userAuthenticated = ref(db, 'authenticated/');
    const snapshot = await get(userAuthenticated);
    if (snapshot.exists()) {
      const data = snapshot.val();
      setAuthenticated(data.authenticated);
    } else {
      console.log('No data available');
    }
  };

  const handleSubmit = async () => {
    await userLogged();

    if (authenticated) {
      return alert('Someone is already logged in!');
    }
    setLoading(true);

    if (!email || !password) {
      // setShowAlert(true);
      alert('All fields are required');
      setLoading(false);
      return;
    }

    try {
      update(ref(db, '/authenticated'), {
        authenticated: true,
      });

      const { data } = await axios.post(`/signin`, {
        email,
        password,
      });

      if (data.error) {
        alert(data.error);
        setLoading(false);
      } else {
        // if (authenticated) {
        //   alert(' Someone is already login');
        // } else {
        // save in context
        setState(data);
        //save response in async storage
        await AsyncStorage.setItem('@auth', JSON.stringify(data));
        userLogged();
        setLoading(false);
        // console.log('SIGN IN SUCCESS =>', data);
        alert('Sign in successful');
      }
    } catch (error) {
      alert('Signup failed. Try again');
      console.log(error);
      setLoading(false);
    }
  };

  //   const loadFormAsyncStorage = async () => {
  //     let data = await AsyncStorage.getItem('@auth');
  //     console.log('Async storage', data);
  //   };
  //   loadFormAsyncStorage();
  console.log('hello user', authenticated);

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={tw`flex justify-center  px-15 bg-gray-100`}
    >
      <View style={tw`mt-10 mb-10`}>
        <Logo />
        <Text style={tw`text-4xl font-bold mb-5 text-center`}>Sign In</Text>

        {/* Add your signin form fields here */}

        <UserInput
          name="Email"
          value={email}
          setValue={setEmail}
          autoCompleteType="email"
          keyboardType="email-address"
        />
        <UserInput
          name="Password"
          value={password}
          setValue={setPassword}
          secureTextEntry={true}
          autoCompleteType="password"
        />

        <SubmitButton
          title="Sign In"
          handleSubmit={handleSubmit}
          loading={loading}
        />

        {/* <Text style={tw`text-center mt-4`}>
          Not yet registered?{' '}
          <Text
            onPress={() => navigation.navigate('Signup')}
            style={tw`text-blue-500`}
          >
            Sign Up
          </Text>
        </Text> */}

        <Text
          onPress={() => navigation.navigate('ForgotPassword')}
          style={{
            textAlign: 'center',
            marginTop: 20,
            color: 'black',
            textDecorationLine: 'underline',
          }}
        >
          Forgot Password?
        </Text>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default SignIn;
