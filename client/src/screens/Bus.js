import React, { useState } from 'react';
import { View, TouchableOpacity, SafeAreaView, Text } from 'react-native';
import FooterTabs from '../components/nav/FooterTabs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import tw from 'twrnc';
import { db } from '../../firebaseCongif';
import { ref, set } from 'firebase/database';
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
        <Text style={tw`text-3xl font-semibold mt-[-100px] mb-22 text-center`}>
          Choose a Vehicle
        </Text>
        <View style={tw`flex-row justify-between mt-30 mb-4 px-7`}>
          <TouchableOpacity
            style={[
              tw`p-4 justify-center items-center w-38`,
              selectedOption === 'Van' && { backgroundColor: '#FEC007' },
            ]}
            onPress={() => handleOptionSelect('Van')}
          >
            <Icon
              name="bus"
              size={60}
              style={tw`mb-2`}
              color={selectedOption === 'Van' ? 'white' : '#FEC007'}
            />
            <Text
              style={[
                tw`text-center mt-2 text-2xl`,
                selectedOption === 'Van' && { color: 'white' },
              ]}
            >
              Van
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              tw`p-4 justify-center items-center w-38`,
              selectedOption === 'Bus' && { backgroundColor: '#FEC007' },
            ]}
            onPress={() => handleOptionSelect('Bus')}
          >
            <Icon
              name="bus-alt"
              size={60}
              style={tw`mb-2`}
              color={selectedOption === 'Bus' ? 'white' : '#FEC007'}
            />
            <Text
              style={[
                tw`text-center mt-2 text-2xl`,
                selectedOption === 'Bus' && { color: 'white' },
              ]}
            >
              Bus
            </Text>
          </TouchableOpacity>
        </View>
        {selectedOption ? (
          <View style={tw`mb-4 justify-center items-center`}>
            <TouchableOpacity
              style={tw`bg-yellow-500 p-4 rounded-lg mt-6 w-10/12`}
              onPress={() => {
                submitBusType();
                navigation.navigate('Enable');
              }}
            >
              <Text
                style={tw`text-center text-lg font-medium text-white text-2xl`}
              >
                Select {selectedOption}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={tw`mb-4 justify-center items-center`}>
            <TouchableOpacity
              style={[
                tw`bg-yellow-500 p-4 rounded-lg mt-6 w-10/12 px-7`,
                { opacity: 0.5 },
              ]}
              onPress={handleAlert}
            >
              <Text style={tw`text-center text-lg font-medium text-white`}>
                Select
              </Text>
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
