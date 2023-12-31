import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import FooterTabs from '../components/nav/FooterTabs';
import { Picker } from '@react-native-picker/picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ref, update, push } from 'firebase/database';
import { db } from '../../firebaseCongif';
import tw from 'twrnc';

const Stops = () => {
  const [selectedPlace, setSelectedPlace] = useState('');
  const [passengerOff, setPassengerOff] = useState('');
  const [passengerOn, setPassengerOn] = useState('');
  const [passengerData, setPassengerData] = useState([]);

  const createTwoButtonAlert = () =>
    Alert.alert('Recorded', 'Thank you!', [
      { text: 'OK', onPress: () => console.log('OK Pressed') },
    ]);

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

    createTwoButtonAlert();
  };

  return (
    <>
      <KeyboardAwareScrollView contentContainerStyle={tw`flex-1 bg-white p-4`}>
        <View style={styles.container}>
          <Text style={styles.heading}>Stops</Text>
        </View>
        {/* Place Section */}
        <View style={tw`p-4`}>
          <Text style={tw`mb-2 text-lg font-medium mb-[-30]`}>Place:</Text>
          <Picker
            selectedValue={selectedPlace}
            onValueChange={(itemValue, itemIndex) => {
              setSelectedPlace(itemValue);
            }}
            style={tw` rounded p-2`}
            itemStyle={{
              placeholderTextColor: 'blue',
              fontSize: 20,
            }}
          >
            <Picker.Item label='Select a place' value='' />
            <Picker.Item label='WALMART' value='Walmart' />
            <Picker.Item label='EAST MC CIRCLE' value='East MC Circle' />
            <Picker.Item label='ASPEN VILLAGE' value='Aspen Village' />
            <Picker.Item label='CENTER SQUARE' value='Center Square' />
            <Picker.Item label='THE GATES' value='The Gates' />
            <Picker.Item label='CAMDEN APARTMENTS' value='Camden Apartments' />
            <Picker.Item label='COLONIAL HOUSE' value='Colonial House' />
            <Picker.Item label='BYUI HART' value='BYU-I Hart' />
            <Picker.Item label='BYUI PARKING LOT' value='BYU-I Parking Lot' />
          </Picker>
        </View>

        {/* Passenger Off Section */}
        <View style={tw`p-4`}>
          <Text style={tw`mb-2 mt-[-30px] text-lg font-medium`}>
            Passenger Off:
          </Text>
          <TextInput
            style={tw`border rounded p-2 text-lg`}
            placeholder='Number of passengers off'
            value={passengerOff}
            onChangeText={(text) => setPassengerOff(text)}
            keyboardType='numeric'
          />
        </View>

        {/* Passenger On Section */}
        <View style={tw`p-4`}>
          <Text style={tw`mb-2 text-lg font-medium`}>Passenger On:</Text>
          <TextInput
            style={tw`border rounded p-2 text-lg`}
            placeholder='Number of passengers on'
            value={passengerOn}
            onChangeText={(text) => setPassengerOn(text)}
            keyboardType='numeric'
          />
        </View>
        <TouchableOpacity
          onPress={handleFormSubmit}
          style={tw`bg-yellow-500 p-4 rounded-lg mt-6 mx-auto w-10/12 px-7`}
        >
          <Text style={tw`text-white text-center text-lg `}>
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

const styles = StyleSheet.create({
  container: {
    marginTop: 55,
    alignItems: 'center',
    marginBottom: 40,
  },
  heading: {
    fontSize: 28,
    fontWeight: '600',
  },
});

export default Stops;
