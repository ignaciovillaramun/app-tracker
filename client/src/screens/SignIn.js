// import CustomAlert from '../components/Alert';
import tw from 'twrnc';
import React, { useState, useContext } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import UserInput from '../components/auth/UserInput';
import SubmitButton from '../components/auth/SubmitButton';
import Logo from '../components/auth/Logo';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/auth';

const SignIn = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [state, setState] = useContext(AuthContext);

  const handleSubmit = async () => {
    setLoading(true);

    if (!email || !password) {
      // setShowAlert(true);
      alert('All fields are required');
      setLoading(false);
      return;
    }

    try {
      console.log('hello');
      const { data } = await axios.post(`/signin`, {
        email,
        password,
      });

      if (data.error) {
        alert(data.error);
        setLoading(false);
      } else {
        // save in context
        setState(data);
        //save response in async storage
        await AsyncStorage.setItem('@auth', JSON.stringify(data));
        setLoading(false);
        // console.log('SIGN IN SUCCESS =>', data);
        alert('Sign in successful');
        //redirect
        // navigation.navigate('Enable');
      }
      // setShowAlert(true);
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
