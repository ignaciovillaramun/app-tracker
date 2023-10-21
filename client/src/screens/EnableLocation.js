import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import FooterTabs from '../components/nav/FooterTabs';
import { ref, set, update } from 'firebase/database';
import { db } from '../../firebaseCongif';
import tw from 'twrnc';

export function stopShowingLocation(setIsDriving, intervalId, setShowLocation) {
  setIsDriving(true);
  console.log('stop');
  if (intervalId) {
    clearInterval(intervalId);
    setIntervalId(null);
  }
  setShowLocation(false);

  try {
    // send updated location to firebase
    update(ref(db, 'locations/'), {
      isDriving: isDriving,
    });
    console.log('Location data saved successfully');
  } catch (error) {
    console.error('Error saving location data:', error);
  }
}

export default function EnableLocation({ navigation }) {
  // ... (the rest of your component code)
  const [location, setLocation] = useState(null);
  const [showLocation, setShowLocation] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [isDriving, setIsDriving] = useState(false);

  const getPermissions = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    let data = await AsyncStorage.getItem('@auth');
    // const userId = data.
    const userData = JSON.parse(data);

    if (status !== 'granted') {
      console.log('Please grant location permissions');
      return;
    }

    if (intervalId) {
      clearInterval(intervalId);
    }

    setIsDriving(false);

    let currentLocation = await Location.getCurrentPositionAsync();
    setLocation(currentLocation);

    const { latitude, longitude } = currentLocation.coords;
    const timestamp = currentLocation.timestamp;

    // Get specific data from user
    const { name } = userData.user;
    const { url } = userData.user.image;

    // Create a custom object with desired properties
    const locationData = {
      latitude,
      longitude,
      timestamp,
    };
    const userInfo = {
      name,
      url,
    };

    // set location to firebase
    try {
      // Attempt to set the location data in the Firebase database
      await set(ref(db, 'locations/'), {
        location: locationData,
        userInfo: userInfo,
        isDriving: isDriving,
      });
      console.log('Location data saved successfully');
      // console.log(currentLocation.coords);
    } catch (error) {
      console.error('Error saving location data:', error);
    }

    // send first location to firebase

    const id = setInterval(async () => {
      const updatedLocation = await Location.getCurrentPositionAsync();
      setLocation(updatedLocation);

      // Get specific data from location
      const { latitude, longitude, heading } = updatedLocation.coords;
      const timestamp = updatedLocation.timestamp;

      // Create a custom object with desired properties
      const locationData = {
        latitude,
        longitude,
        timestamp,
        heading,
      };

      try {
        // send updated location to firebase
        update(ref(db, 'locations/'), {
          location: locationData,
          userInfo: userInfo,
          isDriving: isDriving,
        });
        console.log('Location data saved successfully');
      } catch (error) {
        console.error('Error saving location data:', error);
      }
    }, 3000);

    setIntervalId(id);
    setShowLocation(true);
  };

  const stopShowingLocation = () => {
    setIsDriving(true);
    console.log('stop');
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setShowLocation(false);

    try {
      // send updated location to firebase
      update(ref(db, 'locations/'), {
        isDriving: isDriving,
      });
      console.log('Location data saved successfully');
    } catch (error) {
      console.error('Error saving location data:', error);
    }
  };

  useEffect(() => {
    // Clear the interval when showLocation becomes false
    if (!showLocation && intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  }, [showLocation]);

  return (
    <>
      <View style={tw`flex-1 bg-white items-center`}>
        <View style={tw`mt-40 items-center`}>
          <Image
            source={require('../assets/icon-location.png')}
            style={tw`rounded-full`}
          />
        </View>
        <Text style={tw`text-3xl w-40.5 text-center mt-10`}>
          Enable your location
        </Text>
        {!showLocation ? (
          <TouchableOpacity
            style={tw`bg-yellow-500 rounded-md py-4 px-20 mt-6`}
            onPress={() => {
              getPermissions();
              navigation.navigate('Home');
            }}
          >
            <Text style={tw`text-white font-semibold text-center`}>Enable</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              style={tw`bg-yellow-500 rounded-md py-4 px-20 mt-6`}
              onPress={stopShowingLocation}
            >
              <Text style={tw`text-white font-semibold text-center`}>
                Disable
              </Text>
            </TouchableOpacity>
          </>
        )}
        <StatusBar style="auto" />
      </View>
      <View style={tw`flex pb-8.5`}>
        <FooterTabs />
      </View>
    </>
  );
}
