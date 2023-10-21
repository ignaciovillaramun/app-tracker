import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, TouchableOpacity, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import FooterTabs from '../components/nav/FooterTabs';
import { ref, set, update } from 'firebase/database';
import { db } from '../../firebaseCongif';
import tw from 'twrnc';

export default function EnableLocation({ navigation }) {
  const [location, setLocation] = useState(null);
  const [showLocation, setShowLocation] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [isDriving, setIsDriving] = useState(false);
  const [jumpAnimation] = useState(new Animated.Value(0));

  const getPermissions = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    let data = await AsyncStorage.getItem('@auth');
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

    const { name } = userData.user;
    const { url } = userData.user.image;

    const locationData = {
      latitude,
      longitude,
      timestamp,
    };
    const userInfo = {
      name,
      url,
    };

    try {
      await set(ref(db, 'locations/'), {
        location: locationData,
        userInfo: userInfo,
        isDriving: isDriving,
      });
      console.log('Location data saved successfully');
    } catch (error) {
      console.error('Error saving location data:', error);
    }

    const id = setInterval(async () => {
      const updatedLocation = await Location.getCurrentPositionAsync();
      setLocation(updatedLocation);

      const { latitude, longitude, heading } = updatedLocation.coords;
      const timestamp = updatedLocation.timestamp;

      const locationData = {
        latitude,
        longitude,
        timestamp,
      };

      try {
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
      update(ref(db, 'locations/'), {
        isDriving: isDriving,
      });
      console.log('Location data saved successfully');
    } catch (error) {
      console.error('Error saving location data:', error);
    }
  };

  const jumpOnce = () => {
    Animated.sequence([
      Animated.timing(jumpAnimation, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(jumpAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const jumpMultipleTimes = (times, interval) => {
    let count = 0;
    const jumpInterval = setInterval(() => {
      jumpOnce();
      count++;
      if (count >= times) {
        clearInterval(jumpInterval);
      }
    }, interval);
  };

  useEffect(() => {
    if (!showLocation && intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  }, [showLocation]);

  useEffect(() => {
    if (showLocation) {
      // Trigger the jump animation 3 times with a 667ms interval between jumps (2 seconds in total)
      jumpMultipleTimes(3, 667);
    }
  }, [showLocation]);

  return (
    <>
      <View style={tw`flex-1 bg-white items-center`}>
        <View style={tw`mt-40 items-center`}>
          <Animated.Image
            source={require('../assets/icon-location.png')}
            style={[
              tw`rounded-full`,
              {
                transform: [
                  {
                    translateY: jumpAnimation,
                  },
                ],
              },
            ]}
          />
        </View>
        <Text style={tw`text-3xl w-40.5 text-center mt-10`}>
          Enable your location
        </Text>
        {!showLocation ? (
          <TouchableOpacity
            style={tw`bg-yellow-500 rounded-md py-4 px-20 mt-6`}
            onPress={async () => {
              getPermissions();
              await new Promise((resolve) => {
                setTimeout(() => {
                  resolve();
                }, 2800); // Wait for 2 seconds for the animation to complete
              });
              navigation.navigate('Stops');
            }}
          >
            <Text style={tw`text-white font-semibold text-center`}>Enable</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              style={tw`bg-black rounded-md py-4 px-20 mt-6 opacity-70`}
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
