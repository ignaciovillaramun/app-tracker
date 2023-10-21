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

const Signup = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [state, setState] = useContext(AuthContext);
  // const [showAlert, setShowAlert] = useState(false);
  // const [showAlertSuccess, setShowAlertSuccess] = useState(false);

  // const handleCloseAlert = () => {
  //   setShowAlert(false);
  // };

  const handleSubmit = async () => {
    setLoading(true);

    if (!name || !email || !password) {
      // setShowAlert(true);
      alert('All fields are required');
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(`/signup`, {
        name,
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
        console.log('SIGN IN SUCCESS =>', data);
        alert('Sign up successful');
        // redirect
        navigation.navigate('Home');
      }

      // setShowAlert(true);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={tw`flex-1 justify-center items-center bg-gray-100`}
    >
      <View style={tw`mt-10 mb-10`}>
        <Logo />
        <Text style={tw`text-2xl font-bold mb-4 text-center`}>Sign Up</Text>

        {/* Add your signup form fields here */}
        <UserInput
          name="NAME"
          value={name}
          setValue={setName}
          autoCapitalize="words"
          autoCorrect={false}
        />
        <UserInput
          name="EMAIL"
          value={email}
          setValue={setEmail}
          autoCompleteType="email"
          keyboardType="email-address"
        />
        <UserInput
          name="PASSWORD"
          value={password}
          setValue={setPassword}
          secureTextEntry={true}
          autoCompleteType="password"
        />

        <SubmitButton
          title="Sign Up"
          handleSubmit={handleSubmit}
          loading={loading}
        />

        {/* <Text>{JSON.stringify({ name, email, password }, null, 4)}</Text> */}

        {/* {showAlert && (
        <CustomAlert
          title="Error"
          message="All fields are required"
          button="Try Again!"
        />
      )}

      {showAlertSuccess && (
        <CustomAlert title="Nice!" message="Sign up successful" button="Ok" />
      )} */}

        <Text style={tw`text-center mt-4`}>
          Already Joined?{' '}
          <Text
            onPress={() => navigation.navigate('Signin')}
            style={tw`text-blue-500`}
          >
            Sign In
          </Text>
        </Text>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Signup;
