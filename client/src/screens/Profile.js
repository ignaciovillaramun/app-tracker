// import CustomAlert from '../components/Alert';
import tw from 'twrnc';
import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import UserInput from '../components/auth/UserInput';
import SubmitButton from '../components/auth/SubmitButton';
import Logo from '../components/auth/Logo';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/auth';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import * as ImagePicker from 'expo-image-picker';
import FooterTabs from '../components/nav/FooterTabs';

const Profile = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  // const [password, setPassword] = useState('');
  // const [loading, setLoading] = useState(false);
  // Image
  const [uploadImage, setUploadImage] = useState('');
  const [image, setImage] = useState({
    url: '',
    public_id: '',
  });
  // State
  const [state, setState] = useContext(AuthContext);

  const signOut = async () => {
    setState({ token: '', user: null });
    await AsyncStorage.removeItem('@auth');
  };

  useEffect(() => {
    if (state) {
      const { name, email, image, role } = state.user;
      setName(name);
      setEmail(email);
      setRole(role);
      setImage(image);
    }
  }, [state]);

  // const handleSubmit = async () => {
  //   setLoading(true);
  //   // api request
  //   try {
  //     const { data } = await axios.post('/update-password', { password });
  //     if (data.error) {
  //       alert(data.error);
  //       setLoading(false);
  //     } else {
  //       alert('👍 Password Updated');
  //       setPassword('');
  //       setLoading(false);
  //     }
  //   } catch (error) {
  //     alert('Password update failed. Try again');
  //     console.log(error);
  //     setLoading(false);
  //   }
  // };

  const handleUpload = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    // permissionResult.granted = true;
    if (permissionResult.granted === false) {
      alert('Camera access is required');
      return;
    }
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      base64: true,
      quality: 1,
    });

    if (pickerResult.canceled === true) {
      return;
    }
    let selectedAsset = pickerResult.assets[0];
    let base64Image = `data:image/jpg;base64,${selectedAsset.base64}`;
    setUploadImage(base64Image);

    const { data } = await axios.post('/upload-image', {
      image: base64Image,
    });
    // console.log(('UPLOADED RESPONSE => ', data));
    // update async storage
    const userInfo = JSON.parse(await AsyncStorage.getItem('@auth'));
    userInfo.user = data;
    await AsyncStorage.setItem('@auth', JSON.stringify(userInfo));
    // update context
    setState({ ...state, user: data });
    setImage(data.image);
    alert('👍 Profile image saved');
  };

  return (
    <>
      <KeyboardAwareScrollView
        contentContainerStyle={tw`flex-1 items-center bg-gray-100`}
      >
        <View style={styles.container}>
          <Text style={styles.heading}>Profile</Text>
        </View>
        <View style={tw`mt-10 mb-10`}>
          <Logo>
            {image && image.url ? (
              <TouchableOpacity onPress={() => handleUpload()}>
                <Image
                  source={{ url: image.url }}
                  style={tw`w-43 h-43 rounded-full mt-10`}
                />
              </TouchableOpacity>
            ) : uploadImage ? (
              <TouchableOpacity onPress={() => handleUpload()}>
                <Image
                  source={{ url: uploadImage }}
                  style={tw`w-43 h-43 rounded-full mt-10`}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => handleUpload()}
                style={tw`rounded-full bg-gray-300 p-16 mt-10`}
              >
                <FontAwesome5
                  name="camera"
                  size={45}
                  style={tw`text-gray-500`}
                />
              </TouchableOpacity>
            )}
          </Logo>

          <Text style={tw`text-3xl font-bold mb-2 mt-20 text-center`}>
            Hi, {name}
          </Text>
          <Text style={tw`font-medium mb-2 text-center text-lg`}>{email}</Text>
          <Text style={tw` mb-4 text-center font-thin `}>{role}</Text>
          {/* <UserInput
          name="Password"
          value={password}
          setValue={setPassword}
          secureTextEntry={true}
          autoCompleteType="password"
        /> */}

          {/* <SubmitButton
          title="Update Password"
          handleSubmit={handleSubmit}
          loading={loading}
        /> */}
          <TouchableOpacity
            style={tw`bg-red-500 rounded-lg py-4 px-8 mt-4`}
            onPress={() => signOut()}
          >
            <Text style={tw`text-white font-semibold text-center text-lg`}>
              Log Out
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
      <View style={tw`flex pb-8.5`}>
        <FooterTabs />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 70,
    alignItems: 'center',
  },
  heading: {
    fontSize: 28,
    fontWeight: '600',
  },
});

export default Profile;
