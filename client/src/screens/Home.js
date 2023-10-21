import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import FooterTabs from '../components/nav/FooterTabs';
import { Picker } from '@react-native-picker/picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ref, update, push } from 'firebase/database';
import { db } from '../../firebaseCongif';
import tw from 'twrnc';

const Home = () => {
  const [selectedPlace, setSelectedPlace] = useState('');
  const [passengerOff, setPassengerOff] = useState('');
  const [passengerOn, setPassengerOn] = useState('');
  const [passengerData, setPassengerData] = useState([]);

  const handleFormSubmit = () => {
    const selectedTime = new Date();
    const formattedDate = selectedTime
      .toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      .replace(/\//g, '-');

    const optionsTime = {
      hour: '2-digit',
      minute: '2-digit',
    };

    const formattedTime = new Intl.DateTimeFormat('en-US', optionsTime).format(
      selectedTime
    );

    const newPassenger = {
      selectedPlace,
      formattedTime,
      passengerOff,
      passengerOn,
    };

    // Add the new passenger object to the passengerData array
    setPassengerData([...passengerData, newPassenger]);

    // Push the new passenger object to the database
    const passengerRef = ref(db, `passengerCount/${formattedDate}`);
    push(passengerRef, newPassenger);

    setSelectedPlace('');
    setPassengerOff('');
    setPassengerOn('');
  };

  return (
    <>
      <KeyboardAwareScrollView contentContainerStyle={tw`flex-1 bg-white p-4`}>
        {/* Place Section */}
        <View style={tw`p-4`}>
          <Text style={tw`mb-2`}>Place:</Text>
          <Picker
            selectedValue={selectedPlace}
            onValueChange={(itemValue, itemIndex) => {
              setSelectedPlace(itemValue);
            }}
            style={tw`border rounded p-2`}
          >
            <Picker.Item label="Select a place" value="" />
            <Picker.Item label="BYUI PARKING LOT" value="BYUI PARKING LOT" />
            <Picker.Item label="BYUI HART" value="BYUI HART" />
            <Picker.Item label="COLONIAL HOUSE" value="COLONIAL HOUSE" />
            <Picker.Item label="CAMDEN APARTMENTS" value="CAMDEN APARTMENTS" />
            <Picker.Item label="THE GATES" value="THE GATES" />
            <Picker.Item label="CENTER SQUARE" value="CENTER SQUARE" />
            <Picker.Item label="ASPEN VILLAGE" value="ASPEN VILLAGE" />
            <Picker.Item label="EAST MC CIRCLE" value="EAST MC CIRCLE" />
            <Picker.Item label="WALMART" value="WALMART" />
          </Picker>
        </View>

        {/* Passenger Off Section */}
        <View style={tw`p-4`}>
          <Text style={tw`mb-2`}>Passenger Off:</Text>
          <TextInput
            style={tw`border rounded p-2`}
            placeholder="Number of passengers off"
            value={passengerOff}
            onChangeText={(text) => setPassengerOff(text)}
            keyboardType="numeric"
          />
        </View>

        {/* Passenger On Section */}
        <View style={tw`p-4`}>
          <Text style={tw`mb-2`}>Passenger On:</Text>
          <TextInput
            style={tw`border rounded p-2`}
            placeholder="Number of passengers on"
            value={passengerOn}
            onChangeText={(text) => setPassengerOn(text)}
            keyboardType="numeric"
          />
        </View>
        <TouchableOpacity
          onPress={handleFormSubmit}
          style={tw`bg-yellow-500 rounded-md p-2 mt-4`}
        >
          <Text style={tw`text-white text-center text-lg`}>
            Send Information
          </Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
      <View style={tw`justify-end pb-8.5`}>
        <FooterTabs />
      </View>
    </>
  );
};

export default Home;
