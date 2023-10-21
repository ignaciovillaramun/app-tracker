import React, { useState, useEffect, createContext } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '../../config';
import { useNavigation } from '@react-navigation/native';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [state, setState] = useState({
    user: null,
    token: '',
  });

  // navigation
  const navigation = useNavigation();

  // config axios
  const token = state && state.token ? state.token : '';
  axios.defaults.baseURL = API;
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  // handle expired token or 401 error
  axios.interceptors.response.use(
    async function (response) {
      return response;
    },
    async function (error) {
      if (error.response) {
        // If there's a response in the error object
        let res = error.response;
        if (res.status === 401 && res.config && !res.config.__isRetryRequest) {
          await AsyncStorage.removeItem('@auth');
          setState({ user: null, token: '' });
          navigation.navigate('SignIn');
        }
      } else {
        // Handle the case when error.response is undefined
        console.log('Error response is undefined:', error);
      }
      return Promise.reject(error); // This line is important
    }
  );

  useEffect(() => {
    const loadFormAsyncStorage = async () => {
      let data = await AsyncStorage.getItem('@auth');
      const userData = JSON.parse(data);
      if (userData) {
        setState({ ...state, user: userData.user, token: userData.token });
      }
    };
    loadFormAsyncStorage();
  }, []);

  return (
    <AuthContext.Provider value={[state, setState]}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
