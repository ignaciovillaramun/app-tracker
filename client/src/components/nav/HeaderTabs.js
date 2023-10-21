import React, { useContext } from 'react';
import { View, TouchableOpacity, SafeAreaView, Text } from 'react-native';
import { AuthContext } from '../../context/auth';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';

export default function HeaderTabs() {
  const [state, setState] = useContext(AuthContext);

  // navigation
  const navigation = useNavigation();

  const signOut = async () => {
    setState({ token: '', user: null });
    await AsyncStorage.removeItem('@auth');
  };

  return (
    <SafeAreaView>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('EnableLocation');
        }}
      >
        <FontAwesome5 name="sign-out-alt" size={25} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
