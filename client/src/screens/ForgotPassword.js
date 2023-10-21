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

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const [state, setState] = useContext(AuthContext);

  const handleSubmit = async () => {
    setLoading(true);
    if (!email) {
      alert('Email is required');
      setLoading(false);
      return;
    }
    try {
      const { data } = await axios.post('/forgot-password', {
        email,
      });
      if (data.error) {
        alert(data.error);
        setLoading(false);
      } else {
        setLoading(false);
        setVisible(true);
        console.log('RESET PASSWORD RES => ', data);
        alert('Reset code was sent!');
      }
    } catch (error) {
      alert('Error sending email. Try again!');
      console.log(error);
    }
  };

  const handlePasswordReset = async () => {
    try {
      const { data } = await axios.post('/reset-password', {
        email,
        password,
        resetCode,
      });
      if (data.error) {
        alert(data.error);
        setLoading(false);
      } else {
        alert('Now you can login with your new password!');
        navigation.navigate('Signin');
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      alert('Password reset failed. Try again');
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={tw`flex-1  items-center bg-gray-100`}
    >
      <View style={tw`mt-10 mb-10`}>
        <Logo />
        <Text style={tw`text-2xl font-bold mb-10 text-center`}>
          Forgot Password
        </Text>

        {/* Add your signin form fields here */}

        <UserInput
          name="EMAIL"
          value={email}
          setValue={setEmail}
          autoCompleteType="email"
          keyboardType="email-address"
        />
        {visible && (
          <>
            <UserInput
              name="NEW PASSWORD"
              value={password}
              setValue={setPassword}
              secureTextEntry={true}
              autoCompleteType="password"
            />

            <UserInput
              name="RESET CODE"
              value={resetCode}
              setValue={setResetCode}
              secureTextEntry={true}
            />
          </>
        )}

        <SubmitButton
          title={visible ? 'Reset Password' : 'Request Reset Code'}
          handleSubmit={visible ? handlePasswordReset : handleSubmit}
          loading={loading}
        />

        <Text
          onPress={() => navigation.navigate('SignIn')}
          style={tw`text-center mt-4 text-blue-500`}
        >
          Sign In
        </Text>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default ForgotPassword;
