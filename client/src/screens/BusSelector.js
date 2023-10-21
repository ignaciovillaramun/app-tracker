import React, { useState } from 'react';
import { View, TouchableOpacity, SafeAreaView, Text } from 'react-native';
import FooterTabs from '../components/nav/FooterTabs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import tw from 'twrnc';
import { db } from '../../firebaseCongif';
import { ref, update, set } from 'firebase/database';
import { useNavigation } from 'expo-router';

export default function List() {
  const [selectedOption, setSelectedOption] = useState(null);
  const navigation = useNavigation();

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const submitBusType = () => {
    try {
      set(ref(db, 'busType/'), {
        busType: selectedOption,
      });
    } catch (error) {
      console.log(error);
    }
  };

  function handleAlert() {
    alert('Please choose one option');
  }

  return (
    <>
      <SafeAreaView style={tw`flex-1 bg-white p-4 justify-center`}>
        <Text style={tw`text-2xl font-semibold mb-4`}>Choose a Vehicle</Text>
        <View style={tw`flex-row justify-between mb-4`}>
          <TouchableOpacity
            style={
              selectedOption === 'van'
                ? tw`bg-yellow-500 p-4 rounded-lg justify-center items-center`
                : tw`p-4 justify-center items-center`
            }
            onPress={() => handleOptionSelect('van')}
          >
            <Icon name="bus" size={60} style={tw`mb-2`}></Icon>
            <Text style={tw`text-center mt-2`}>Van</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              selectedOption === 'bus'
                ? tw`bg-yellow-500 p-4 rounded-lg justify-center items-center`
                : tw`p-4 justify-center items-center`
            }
            onPress={() => handleOptionSelect('bus')}
          >
            <Icon name="bus-alt" size={60} style={tw`mb-2`}></Icon>
            <Text style={tw`text-center mt-2`}>Bus</Text>
          </TouchableOpacity>
        </View>
        {selectedOption ? (
          <View style={tw`mb-4 justify-center items-center`}>
            <TouchableOpacity
              style={tw`bg-yellow-500 p-4 rounded-lg`}
              onPress={() => {
                submitBusType();
                navigation.navigate('EnableLocation');
              }}
            >
              <Text style={tw`text-center`}>Select {selectedOption}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={tw`mb-4 justify-center items-center`}>
            <TouchableOpacity
              style={tw`bg-yellow-500 p-4 rounded-lg`}
              onPress={handleAlert}
            >
              <Text style={tw`text-center`}>Select</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
      <View style={tw`justify-end pb-8.5`}>
        <FooterTabs />
      </View>
    </>
  );
}
